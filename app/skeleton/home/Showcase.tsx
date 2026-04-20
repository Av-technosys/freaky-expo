// app/skeleton/home/Showcase.tsx

import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShowcaseSkeleton() {
  return (
    <View className="mt-4 px-4 flex-row">
      {Array.from({ length: 3 }).map((_, i) => (
        <View key={i} className="mr-3">
          <Skeleton className="h-[180px] w-[260px] rounded-2xl" />
          <Skeleton className="h-4 w-40 mt-2" />
          <Skeleton className="h-3 w-24 mt-1" />
        </View>
      ))}
    </View>
  );
}