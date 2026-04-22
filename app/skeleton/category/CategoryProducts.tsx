// app/skeleton/product/CategoryProducts.tsx

import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryProductsSkeleton() {
  return (
    <View className="px-3 pt-4">

      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} className="mb-6 p-3 rounded-2xl border border-border">

          <View className="flex-row gap-3">

            {/* IMAGE */}
            <Skeleton className="h-24 w-24 rounded-xl" />

            {/* CONTENT */}
            <View className="flex-1 gap-2">

              {/* TITLE */}
              <Skeleton className="h-5 w-40" />

              {/* DESCRIPTION */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />

              {/* RATING */}
              <Skeleton className="h-3 w-24" />

              {/* PRICE */}
              <Skeleton className="h-5 w-20 mt-1" />

            </View>

          </View>

        </View>
      ))}

    </View>
  );
}