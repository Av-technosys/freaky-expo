import { View, Text, Image } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Carousel from '@/components/common/Carousel';

type VendorHeaderCardProps = {
  name: string;
  location: string;
  rating?: number;
  logo?: any;
  mediaImages?: string[];
};

export default function VendorHeaderCard({
  name,
  location,
  rating = 0,
  logo,
  mediaImages = [],
}: VendorHeaderCardProps) {
  const hasImages = Array.isArray(mediaImages) && mediaImages.length > 0;

  return (
    <View className="mt-8">
      {/* HEADER */}
      <View className="mx-2 flex-row items-center justify-between">
        {/* LEFT */}
        <View className="flex-1 pr-4">
          <Text className="text-3xl font-bold text-black">{name}</Text>

          {/* LOCATION */}
          <View className="mt-2 flex-row flex-wrap items-center">
            <Feather name="map-pin" size={16} color="#ef4444" />

            <Text className="ml-1 flex-shrink text-sm text-gray-600">
              {location || 'Location not available'}
            </Text>

            <Feather name="help-circle" size={14} color="#6B7280" style={{ marginLeft: 6 }} />
          </View>

          {/* RATING */}
          <View className="mt-2 flex-row items-center self-start rounded-full bg-green-700 px-2 py-1">
            <Text className="text-xs font-semibold text-white">
              {rating?.toFixed?.(1) ?? rating}
            </Text>

            <AntDesign name="star" size={12} color="#facc15" style={{ marginLeft: 4 }} />
          </View>
        </View>

        {/* RIGHT LOGO */}
        <View className="h-28 w-28 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
          <AspectRatio ratio={1} className="w-[80%]">
            <Image
              source={logo?.uri ? logo : require('@/assets/images/vendor-logo.png')}
              className="h-full w-full"
              resizeMode="contain"
            />
          </AspectRatio>
        </View>
      </View>

      {/* CAROUSEL */}
      {hasImages && (
        <View style={{ marginHorizontal: -10, marginTop: 20 }} className="mt-5">
          <Carousel
            fullWidth={false}
            itemSpacing={0}
            borderRadius={0}
            images={mediaImages.map((uri) => ({ uri }))}
          />
        </View>
      )}
    </View>
  );
}
