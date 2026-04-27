
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartDetailSkeleton() {
  return (
    <View className="px-3 mt-10">

      {/* HEADER */}
      <View className="flex-row items-start mb-6">
        <Skeleton className="w-24 h-20 rounded-xl" />

        <View className="ml-4 flex-1 gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </View>
      </View>

      {/* ITEMS */}
      {Array.from({ length: 2 }).map((_, i) => (
        <View key={i} className="mb-4 p-4 rounded-2xl border border-border">

          <View className="flex-row justify-between">
            <View className="flex-row flex-1 gap-3">

              <Skeleton className="w-12 h-12 rounded-xl" />

              <View className="flex-1 gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
              </View>
            </View>

            <View className="items-end gap-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-6 w-16" />
            </View>
          </View>

        </View>
      ))}

      {/* PRICING */}
      <View className="mt-6">

        <Skeleton className="h-5 w-40 mb-4" />

        <View className="gap-3 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </View>

        <Skeleton className="h-6 w-32" />
      </View>

      {/* PAYMENT */}
      <View className="mt-6">
        <Skeleton className="h-14 w-full rounded-2xl mb-3" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </View>

      {/* CTA */}
      <Skeleton className="h-12 w-full rounded-xl mt-6" />

    </View>
  );
}