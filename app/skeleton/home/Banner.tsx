
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export default function BannerSkeleton() {
  return (
    <View className="px-4 mt-5">
      <Skeleton className="h-[180px] w-full rounded-2xl" />
    </View>
  );
}