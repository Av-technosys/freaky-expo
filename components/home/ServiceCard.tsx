import { View, Image, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { getImageUrl } from '@/utils/image';

export default function ServiceCard({ item }: any) {
  const router = useRouter();

  const imageUrl = item?.bannerImage;
  const title = item?.title || 'Untitled';
  const rating = Math.round(item?.rating || 0);

  // ✅ SAFE PRICE EXTRACTION
  let price: number | string | null = null;

  if (Array.isArray(item?.price)) {
    price = item.price[0]?.salePrice ?? item.price[0]?.price ?? null;
  } else if (typeof item?.price === 'object') {
    price = item.price?.salePrice ?? item.price?.price ?? null;
  } else if (typeof item?.price === 'number' || typeof item?.price === 'string') {
    price = item.price;
  }

  // ❌ don't render broken cards
  if (!imageUrl) return null;

  return (
    <Pressable
      // onPress={() =>
      //   router.push({
      //     // pathname: '/productDetails',
      //     params: {
      //       productId: item?.productId,
      //     },
      //   })
      // }
      className="mr-3"
    >
      <Card className="w-[22rem] overflow-hidden rounded-2xl">

        {/* IMAGE */}
        <Image
          source={{ uri: getImageUrl(imageUrl) }}
          className="w-full h-44"
          resizeMode="cover"
        />

        <CardContent className="px-4 py-3">

          {/* TITLE */}
          <Text
            numberOfLines={2}
            className="text-base font-semibold"
          >
            {title}
          </Text>

          {/* RATING */}
          {rating > 0 && (
            <View className="flex-row items-center mt-2">
              {Array.from({ length: rating }).map((_, i) => (
                <Feather key={i} name="star" size={14} color="#facc15" />
              ))}
            </View>
          )}

          {/* PRICE */}
          {price !== null && price !== undefined && (
            <Text className="mt-3 text-lg font-bold">
              ₹{price}
            </Text>
          )}

        </CardContent>
      </Card>
    </Pressable>
  );
}