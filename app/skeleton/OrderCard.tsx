import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  variant?: 'default' | 'compact';
};

export default function OrderCardSkeleton({ variant = 'default' }: Props) {
  if (variant === 'compact') {
    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <View className="flex-row gap-4">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <View className="flex-1 gap-2">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
              <Skeleton className="h-3 w-2/5 rounded-md" />
            </View>
          </View>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <View className="flex-row justify-between items-start mb-3">
          <Skeleton className="h-6 w-3/5 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </View>

        <View className="gap-2 mb-3">
          <View className="flex-row items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-4/5 rounded-md" />
          </View>
          <View className="flex-row items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-2/5 rounded-md" />
          </View>
        </View>

        <View className="h-px bg-border my-2" />

        <View className="flex-row justify-between items-center">
          <View className="gap-1">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </View>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </View>
      </CardContent>
    </Card>
  );
}