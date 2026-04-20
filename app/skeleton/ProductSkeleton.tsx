import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View className="px-4">
      {[...Array(count)].map((_, index) => (
        <View key={index} className="flex-row mb-4 p-3 bg-card rounded-xl">
          <View className="flex-1 gap-2">
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md mt-2" />
            <Skeleton className="h-9 w-24 rounded-lg mt-2" />
          </View>
          <Skeleton className="w-44 h-40 rounded-xl ml-3" />
        </View>
      ))}
    </View>
  );
}