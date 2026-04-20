// components/eventProducts/EventTopHeader.tsx

import React from 'react';
import { View, Image, Pressable, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Text } from '@/components/ui/text';

type Props = {
  title?: string;
  subtitle?: string;
  image: ImageSourcePropType;
  date?: string;
  onPress?: () => void;
};

export default function EventTopHeader({
  title,
  subtitle,
  image,
  date,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mt-3 flex-row items-start justify-between"
    >
      {/* TEXT SECTION with Gradient Mask */}
      <View className="flex-1 pr-4">
        <MaskedView
          maskElement={
            <View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-[44px] leading-[52px] font-bold"
              >
                {title}
              </Text>

              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                className="text-[26px] leading-[34px] font-extrabold"
              >
                {subtitle}
              </Text>
            </View>
          }
        >
          <LinearGradient
            colors={['#FBBF24', '#F97316']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {/* MUST MATCH MASK EXACTLY - Same text with opacity 0 */}
            <Text
              numberOfLines={1}
              className="text-[44px] leading-[52px] font-bold opacity-0"
            >
              {title}
            </Text>

            <Text
              numberOfLines={3}
              className="text-[26px] leading-[34px] font-extrabold opacity-0"
            >
              {subtitle}
            </Text>
          </LinearGradient>
        </MaskedView>

        {date && (
          <Text className="text-muted-foreground mt-3 text-base">
            {date}
          </Text>
        )}
      </View>

      {/* IMAGE SECTION */}
      <View className="h-36 w-32 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg">
        <Image
          source={image}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );
}