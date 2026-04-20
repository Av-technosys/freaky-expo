import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ServiceSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <View className="flex-row items-center">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <View className="ml-4 flex-1 gap-1">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/3 rounded-md" />
          </View>
        </View>
        <View className="mt-4">
          <Skeleton className="h-6 w-32 rounded-md" />
        </View>
      </CardContent>
    </Card>
  );
}