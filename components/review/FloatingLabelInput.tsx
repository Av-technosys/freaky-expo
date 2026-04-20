import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';

type FloatingLabelInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
};

export function FloatingLabelInput({ 
  label, 
  value, 
  onChangeText, 
  multiline = false 
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="relative">
      <Text className={`absolute left-4 px-1 bg-background z-10 text-sm ${isFocused || value ? 'text-primary top-0' : 'text-muted-foreground top-4'}`}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        className={`pt-6 pb-3 px-4 text-base rounded-xl border ${isFocused ? 'border-primary' : 'border-input'} bg-background text-foreground ${multiline ? 'min-h-[100px]' : 'h-14'}`}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
}