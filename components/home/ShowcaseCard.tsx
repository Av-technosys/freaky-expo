import { View, Image } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '../ui/aspect-ratio';

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
        <AspectRatio ratio={4 / 3}>
          <Image source={{ uri: imageUrl }} className="h-full w-full" resizeMode="cover" />
        </AspectRatio>

        <CardContent className="flex-row items-start pb-4 pt-3">
          {/* GRADIENT NUMBER */}
          <MaskedView
            style={{ alignSelf: 'flex-start' }}
            maskElement={
              <Text className="text-[48px] font-extrabold leading-[40px]">{index + 1}</Text>
            }>
            <LinearGradient
              colors={['#FFC107', '#FF5722']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}>
              <Text className="text-[48px] font-extrabold leading-[40px] opacity-0">
                {index + 1}
              </Text>
            </LinearGradient>
          </MaskedView>

          {/* RIGHT SIDE */}
          <View className="ml-3 flex-1">
            {/* TITLE */}
            <Text numberOfLines={1} className="text-base font-semibold text-foreground">
              {title}
            </Text>

            {/* PRICE */}
            {price ? (
              <Text className="mt-1 text-sm text-muted-foreground">
                Starting <Text className="font-semibold text-orange-500">₹{price}</Text>
              </Text>
            ) : null}
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
