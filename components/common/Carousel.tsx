import React, { useState } from 'react';
import { View, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type BannerCarouselProps = {
  images: any[];
  height?: number;
  showDots?: boolean;
  fullWidth?: boolean;
  borderRadius?: number;
  itemSpacing?: number;
};

export default function BannerCarousel({
  images = [],
  height = 200,
  showDots = true,
  fullWidth = true,
  itemSpacing = 16,
  borderRadius = 12,
}: BannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ no data → clean exit
  if (!images || images.length === 0) {
    return null;
  }

  const ITEM_WIDTH = fullWidth
    ? SCREEN_WIDTH
    : SCREEN_WIDTH - itemSpacing * 2;

  return (
    <View
      className="mt-4"
      style={{
        width: SCREEN_WIDTH,
        height,
      }}
    >
      <Carousel
        width={ITEM_WIDTH}
        height={height}
        data={images}
        loop={false}
        pagingEnabled
        style={{ width: SCREEN_WIDTH }}
        onProgressChange={(_, absoluteProgress) => {
          const index = Math.round(absoluteProgress);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width: SCREEN_WIDTH,
              alignItems: 'center',
            }}
          >
            <Image
              source={item}
              style={{
                width: ITEM_WIDTH,
                height,
                borderRadius: fullWidth ? 0 : borderRadius,
              }}
              resizeMode="cover"
            />
          </View>
        )}
      />

      {/* ✅ dots */}
      {showDots && (
        <View
          style={{
            position: 'absolute',
            bottom: 12,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            {images.map((_, index) => (
              <View
                key={index}
                style={{
                  marginHorizontal: 4,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    activeIndex === index ? '#F97316' : '#D1D5DB',
                }}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}