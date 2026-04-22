// app/skeleton/home/AddressList.tsx

import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function AddressListSkeleton() {
  return (
    <View className="px-4">

      {/* Header */}
      <View className="mb-4">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-32" />
      </View>

      {/* Search */}
      <Skeleton className="h-11 w-full rounded-lg mb-4" />

      {/* Button */}
      <Skeleton className="h-12 w-full rounded-xl mb-4" />

      {/* Divider */}
      <Skeleton className="h-[1px] w-full mb-4" />

      {/* Address Cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <View key={i} className="mb-3 p-4 rounded-xl border border-border">

          {/* Title + badge */}
          <View className="flex-row justify-between items-center mb-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </View>

          {/* Address lines */}
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-4/5 mb-1" />
          <Skeleton className="h-4 w-3/5" />

          {/* Phone */}
          <View className="mt-3 flex-row items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </View>

          {/* Actions */}
          <View className="flex-row gap-4 mt-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
          </View>

        </View>
      ))}
    </View>
  );
}