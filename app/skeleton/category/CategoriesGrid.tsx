// app/skeleton/home/CategoriesGrid.tsx

import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesSkeleton() {
  return (
    <View className="px-4 mt-4 flex-row flex-wrap justify-between">
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} className="w-[48%] mb-4">

          <View className="border border-orange-200 rounded-3xl p-4 items-center">
            <Skeleton className="h-20 w-20 rounded-xl mb-3" />
            <Skeleton className="h-4 w-20" />
          </View>

        </View>
      ))}
    </View>
  );
}