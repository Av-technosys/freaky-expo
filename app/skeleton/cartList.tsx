// app/skeleton/cart/Cart.tsx

import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartSkeleton() {
  return (
    <View className="px-4 pt-4">

      {/* Items */}
      {Array.from({ length: 3 }).map((_, i) => (
        <View key={i} className="mb-4 p-4 rounded-2xl border border-border">

          <View className="flex-row gap-3">
            {/* Image */}
            <Skeleton className="h-20 w-20 rounded-xl" />

            {/* Content */}
            <View className="flex-1 gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row justify-between mt-4 items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </View>

        </View>
      ))}

      {/* Summary */}
      <View className="mt-4 p-4 rounded-2xl border border-border">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full rounded-xl mt-3" />
      </View>

    </View>
  );
}