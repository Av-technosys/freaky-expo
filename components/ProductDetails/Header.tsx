import { View, Text, Image } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

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
      <View className="flex-row mx-6 items-center justify-between">
        
        {/* LEFT */}
        <View className="flex-1 pr-4">

          <Text className="text-3xl font-bold text-black">
            {name}
          </Text>

          {/* LOCATION */}
          <View className="mt-2 flex-row items-center flex-wrap">
            <Feather name="map-pin" size={16} color="#ef4444" />

            <Text className="ml-1 text-gray-600 text-sm flex-shrink">
              {location || 'Location not available'}
            </Text>

            <Feather
              name="help-circle"
              size={14}
              color="#6B7280"
              style={{ marginLeft: 6 }}
            />
          </View>

          {/* RATING */}
          <View className="mt-2 flex-row items-center self-start bg-green-700 px-2 py-1 rounded-full">
            <Text className="text-xs font-semibold text-white">
              {rating?.toFixed?.(1) ?? rating}
            </Text>

            <AntDesign
              name="star"
              size={12}
              color="#facc15"
              style={{ marginLeft: 4 }}
            />
          </View>

        </View>

        {/* RIGHT LOGO */}
        <View className="h-28 w-28 items-center justify-center rounded-xl bg-gray-100">
          <Image
            source={
              logo?.uri
                ? logo
                : require('@/assets/images/vendor-logo.png')
            }
            className="w-[80%] h-[80%]"
            resizeMode="contain"
          />
        </View>

      </View>

      {/* CAROUSEL */}
      {hasImages && (
        <View className="mt-5">
          <Carousel
            fullWidth={false}
            itemSpacing={0}
            borderRadius={15}
            images={mediaImages.map((uri) => ({ uri }))}
          />
        </View>
      )}

    </View>
  );
}