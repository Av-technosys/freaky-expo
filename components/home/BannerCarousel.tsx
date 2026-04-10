/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, Dimensions } from 'react-native';
import   Carousel   from '@/components/common/Carousel';
import SkeletonContent from 'react-native-skeleton-content';


const S3_BASE_URL =process.env.EXPO_PUBLIC_AWS_IMAGE_URL;

type Banner = {
  id: number;
  name: string;
  mediaURL: string;
  priority: number;
};

type Props = {
  banners?: Banner[] | null;
  loading?: boolean;
};

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 180;

export default function BannerCarousel({
  banners = null,
  loading = false,
}: Props) {

  // 🔥 1. LOADING STATE
  if (loading) {
    return (
      <View className="mt-5 px-4">
        <SkeletonContent
          isLoading={true}
          layout={[
            {
              key: 'banner',
              width: width - 32,
              height: BANNER_HEIGHT,
              borderRadius: 16,
            }
          ]}
        />
      </View>
    );
  }

  // 🔥 2. NO DATA CASE (API returned empty or failed)
  if (!banners || banners.length === 0) {
    return null; // clean exit (as per your rule)
  }

  // 🔥 3. MAP IMAGES (safe)
  const images = banners
    .filter(item => item?.mediaURL) // safety
    .map(item => ({
      uri: `${S3_BASE_URL}/${item.mediaURL}`,
    }));

  // 🔥 4. FINAL SAFETY
  if (!images.length) {
    return null;
  }

  // 🔥 5. RENDER
  return (
    <View className="mt-5">
      <Carousel fullWidth images={images} />
    </View>
  );
}