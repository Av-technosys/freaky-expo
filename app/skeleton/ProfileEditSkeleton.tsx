import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileEditSkeleton() {
  return (
    <View className="px-4 pt-20">
      {/* AVATAR */}
      <View className="items-center mb-10">
        <Skeleton className="h-28 w-28 rounded-full" />
      </View>

      {/* FIELD 1 */}
      <View className="mb-5 gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </View>

      {/* FIELD 2 */}
      <View className="mb-5 gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </View>

      {/* FIELD 3 */}
      <View className="mb-6 gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </View>

      {/* BUTTONS */}
      <View className="flex-row gap-4">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 flex-1 rounded-xl" />
      </View>
    </View>
  );
}