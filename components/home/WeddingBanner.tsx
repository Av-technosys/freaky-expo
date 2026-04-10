import { View, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import SectionHeader from '../home/SectionHeader';

type Props = {
  banner?: {
    title?: string;
    image?: string;
  } | null;
};

export default function WeddingBanner({ banner }: Props) {

  // ✅ NO DATA (your rule)
  if (!banner || !banner.image) {
    return null;
  }

  return (
    <View className="mt-6">

      {/* HEADER */}
      <SectionHeader
        left={
          <Text className="text-xl font-semibold text-foreground">
            {banner.title || 'Special Events 🎊'}
          </Text>
        }
        right={
          <Feather name="chevron-right" size={20} color="#666" />
        }
      />

      {/* IMAGE */}
      <View className="relative w-full -mt-6">
        <Image
          source={{ uri: banner.image }}
          className="w-full h-64"
          resizeMode="cover"
        />
      </View>

    </View>
  );
}