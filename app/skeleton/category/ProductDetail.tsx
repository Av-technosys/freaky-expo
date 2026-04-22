// app/skeleton/product/ProductDetails.tsx

import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailsSkeleton() {
  return (
    <View className="px-4 pt-4">

      {/* IMAGE / HEADER */}
      <Skeleton className="h-52 w-full rounded-2xl mb-4" />

      {/* TITLE */}
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />

      {/* PRICE + RATING */}
      <View className="flex-row justify-between items-center mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
      </View>

      {/* DESCRIPTION */}
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-1" />
      <Skeleton className="h-4 w-4/6 mb-4" />

      {/* VENDOR CARD */}
      <View className="flex-row items-center gap-3 mb-4 p-3 rounded-xl border border-border">
        <Skeleton className="h-12 w-12 rounded-full" />
        <View className="flex-1 gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </View>
      </View>

      {/* REVIEWS */}
      <Skeleton className="h-5 w-28 mb-2" />
      {Array.from({ length: 2 }).map((_, i) => (
        <View key={i} className="mb-3 p-3 rounded-xl border border-border">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-4/5" />
        </View>
      ))}

      {/* BUTTON */}
      <Skeleton className="h-12 w-full rounded-xl mt-4" />

    </View>
  );
}