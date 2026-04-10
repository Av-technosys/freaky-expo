import { View, Image, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

export default function ServiceCard({ item }: any) {
  const navigation = useNavigation<any>();

  const imageUrl = item?.bannerImage;
  const title = item?.title || 'Untitled';
  const rating = Math.round(item?.rating || 0);
  const price = item?.price?.[0]?.price ?? item?.price;

  // ✅ strict rule
  if (!imageUrl) return null;

  return (
    <Pressable
      onPress={() =>
        navigation.getParent()?.navigate('FlowStack', {
          screen: 'ProductDetails',
          params: {
            productId: item?.productId,
          },
        })
      }
      className="mr-3"
    >
      <Card className="w-[22rem] overflow-hidden rounded-2xl">

        {/* IMAGE */}
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-44"
          resizeMode="cover"
        />

        <CardContent className="px-4 py-3">

          {/* TITLE */}
          <Text
            numberOfLines={2}
            className="text-base font-semibold text-foreground"
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
          {price ? (
            <Text className="mt-3 text-lg font-bold text-foreground">
              ₹{price}
            </Text>
          ) : null}

        </CardContent>
      </Card>
    </Pressable>
  );
}