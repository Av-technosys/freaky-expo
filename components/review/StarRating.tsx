import React, { useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  showLabels?: boolean;
};

const LABELS = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

export function StarRating({ value, onChange, size = 32, showLabels = true }: StarRatingProps) {
  const scaleAnims = useRef([...Array(5)].map(() => new Animated.Value(1))).current;

  const handlePress = (ratingValue: number, index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
    onChange(ratingValue);
  };

  return (
    <View className="flex-row justify-between w-full px-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const ratingValue = index + 1;
        const active = ratingValue <= value;
        return (
          <TouchableOpacity 
            key={ratingValue} 
            activeOpacity={0.7}
            onPress={() => handlePress(ratingValue, index)} 
            className="items-center flex-1"
          >
            <Animated.View style={{ transform: [{ scale: scaleAnims[index] }] }}>
              <Ionicons
                name={active ? 'star' : 'star-outline'}
                size={size}
                color={active ? '#F59E0B' : '#E5E7EB'}
              />
            </Animated.View>
            {showLabels && (
              <Text className={`text-xs mt-2 font-semibold ${active ? 'text-amber-500' : 'text-gray-400'}`}>
                {LABELS[index]}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}