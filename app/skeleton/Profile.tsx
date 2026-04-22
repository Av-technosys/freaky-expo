// app/skeleton/profile/Profile.tsx

import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileSkeleton() {
  return (
    <View className="px-3 pt-4">

      {/* PROFILE CARD */}
      <View className="p-4 rounded-2xl border border-border mb-4">

        <View className="flex-row items-center gap-3">
          {/* Avatar */}
          <Skeleton className="h-16 w-16 rounded-full" />

          {/* Name + info */}
          <View className="flex-1 gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </View>
        </View>

      </View>

      {/* SECTIONS */}
      {Array.from({ length: 3 }).map((_, i) => (
        <View key={i} className="mb-4">

          {/* Section title */}
          <Skeleton className="h-4 w-24 mb-2 ml-1" />

          {/* Card */}
          <View className="rounded-2xl border border-border">

            {Array.from({ length: 2 }).map((__, j) => (
              <View
                key={j}
                className={`flex-row items-center justify-between px-4 py-3 ${
                  j !== 1 ? 'border-b border-border' : ''
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded-md" />
                  <Skeleton className="h-4 w-32" />
                </View>

                <Skeleton className="h-4 w-4" />
              </View>
            ))}

          </View>
        </View>
      ))}

      {/* LOGOUT BUTTON */}
      <Skeleton className="h-12 w-full rounded-xl mt-6" />

    </View>
  );
}