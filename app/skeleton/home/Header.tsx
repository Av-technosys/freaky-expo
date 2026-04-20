// app/skeleton/home/Header.tsx

import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function HeaderSkeleton() {
  return (
    <View className="gap-4">
      {/* Top row */}
      <View className="flex-row justify-between items-center">
        <View className="gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-40" />
        </View>

        <View className="flex-row gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </View>
      </View>

      {/* Address */}
      <Skeleton className="h-12 w-full rounded-full" />
    </View>
  );
}