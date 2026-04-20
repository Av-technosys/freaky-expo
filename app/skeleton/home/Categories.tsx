// app/skeleton/home/Categories.tsx

import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesSkeleton() {
  return (
    <View className="mt-6 px-4 flex-row flex-wrap justify-between">
      {Array.from({ length: 8 }).map((_, i) => (
        <View key={i} className="w-[22%] items-center mb-6">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <Skeleton className="h-3 w-12 mt-2" />
        </View>
      ))}
    </View>
  );
}