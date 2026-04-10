import { View } from 'react-native';
import SkeletonContent from 'react-native-skeleton-content';

export default function AddressListSkeleton() {
  return (
    <View className="mt-4 px-2">
      <SkeletonContent
        isLoading={true}
        containerStyle={{ gap: 16 }}
        layout={Array.from({ length: 4 }).flatMap((_, i) => [
          // ROW CONTAINER (not visual, just spacing reference)
          {
            key: `row-${i}`,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },

          // LEFT TITLE
          {
            key: `title-${i}`,
            width: 120,
            height: 14,
            borderRadius: 6,
            marginBottom: 6,
          },

          // LEFT ADDRESS
          {
            key: `address-${i}`,
            width: '80%',
            height: 12,
            borderRadius: 6,
            marginBottom: 10,
          },

          // RIGHT ICONS (simulate inline)
          {
            key: `icon1-${i}`,
            width: 20,
            height: 20,
            borderRadius: 10,
            position: 'absolute',
            right: 60,
            top: i * 70 + 10,
          },
          {
            key: `icon2-${i}`,
            width: 20,
            height: 20,
            borderRadius: 10,
            position: 'absolute',
            right: 35,
            top: i * 70 + 10,
          },
          {
            key: `icon3-${i}`,
            width: 20,
            height: 20,
            borderRadius: 10,
            position: 'absolute',
            right: 10,
            top: i * 70 + 10,
          },
        ])}
      />
    </View>
  );
}