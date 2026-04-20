import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  showLabels?: boolean;
};

const LABELS = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

export function StarRating({ value, onChange, size = 28, showLabels = true }: StarRatingProps) {
  return (
    <View className="flex-row justify-between w-full px-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const ratingValue = index + 1;
        const active = ratingValue <= value;
        return (
          <TouchableOpacity 
            key={ratingValue} 
            onPress={() => onChange(ratingValue)} 
            className="items-center flex-1"
          >
            <Ionicons
  name={active ? 'star' : 'star-outline'}
  size={size}
  color={active ? '#f59e0b' : '#d1d5db'}
/>
            {showLabels && (
              <Text className={`text-xs mt-2 font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {LABELS[index]}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}