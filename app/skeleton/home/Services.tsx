// app/skeleton/home/Services.tsx

import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function ServicesSkeleton() {
  return (
    <View className="mt-6 px-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <View key={i} className="mb-4">
          <Skeleton className="h-5 w-32 mb-3" />

          <View className="flex-row">
            {Array.from({ length: 2 }).map((_, j) => (
              <View key={j} className="mr-3">
                <Skeleton className="h-[140px] w-[220px] rounded-xl" />
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}