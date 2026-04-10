import { View, Image } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';

export default function ShowcaseCard({ item, index }: any) {
  const imageUrl = item?.image;
  const title = item?.name || 'Untitled';
  const price = item?.price;

  // ✅ strict rule
  if (!imageUrl) return null;

  return (
    <View className="mr-4 mt-4 w-72">

      <Card className="overflow-hidden rounded-2xl">

        {/* IMAGE */}
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <CardContent className="pt-3 pb-4 flex-row items-start">

          {/* GRADIENT NUMBER */}
          <MaskedView
            style={{ alignSelf: 'flex-start' }}
            maskElement={
              <Text className="text-[48px] leading-[40px] font-extrabold">
                {index + 1}
              </Text>
            }
          >
            <LinearGradient
              colors={['#FFC107', '#FF5722']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text className="text-[48px] leading-[40px] opacity-0 font-extrabold">
                {index + 1}
              </Text>
            </LinearGradient>
          </MaskedView>

          {/* RIGHT SIDE */}
          <View className="ml-3 flex-1">

            {/* TITLE */}
            <Text
              numberOfLines={1}
              className="text-base font-semibold text-foreground"
            >
              {title}
            </Text>

            {/* PRICE */}
            {price ? (
              <Text className="text-sm text-muted-foreground mt-1">
                Starting{' '}
                <Text className="text-orange-500 font-semibold">
                  ₹{price}
                </Text>
              </Text>
            ) : null}

          </View>
        </CardContent>
      </Card>
    </View>
  );
}