

import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = ButtonProps & {
  variant?: 'default' | 'outline';
};

export function AppButton({ variant = 'default', className, ...props }: Props) {
  const gradientColors = ['#FACC15', '#F97316'] as const;

  // ✅ DEFAULT (gradient background)
  if (variant === 'default') {
    return (
      <View className="w-full h-12 rounded-xl overflow-hidden">
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="absolute inset-0"
        />
        <Button
          {...props}
          variant="default"
          className={cn(
            'bg-transparent h-full w-full rounded-xl items-center justify-center hover:bg-transparent active:bg-transparent',
            className
          )}
        />
      </View>
    );
  }

  // ✅ OUTLINE (gradient border)
  if (variant === 'outline') {
    return (
      <View className="w-full h-12 rounded-xl p-[2px] overflow-hidden">
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="absolute inset-0"
        />
        <View className="flex-1 bg-white rounded-xl">
          <Button
            {...props}
            variant="outline"
            className={cn(
              'bg-transparent border-0 h-full w-full rounded-xl items-center justify-center',
              className
            )}
          />
        </View>
      </View>
    );
  }

  return null;
}