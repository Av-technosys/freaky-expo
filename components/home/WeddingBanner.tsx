import { View, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import SectionHeader from '@/components/home/SectionHeader';

export default function WeddingBanner() {
  return (
    <View className="mt-6 -mx-4">
      {/* HEADER */}
      <SectionHeader
        left={
          <Text className="text-2xl font-bold text-black">
            Today Special Events 🎊
          </Text>
        }
        right={<Feather name="chevron-right" size={22} color="#666" />}
      />

      {/* IMAGE */}
      <View className="relative w-full -mt-8 z-10">
        <Image
          source={require('@/assets/images/weddingBanner.png')}
          className="w-full h-66"
          resizeMode="stretch"
        />
      </View>
    </View>
  );
}