import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

type Props = {
  title?: string;
  subtitle?: string;
};

export default function EmptyProductsState({
  title = 'No services available',
  subtitle = 'Try another category or check back later.',
}: Props) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <View className="w-20 h-20 bg-muted rounded-full items-center justify-center mb-6">
        <Text className="text-4xl">📦</Text>
      </View>
      <Text className="text-2xl font-bold text-foreground text-center mb-3">{title}</Text>
      <Text className="text-muted-foreground text-base text-center max-w-[280px]">{subtitle}</Text>
    </View>
  );
}