import { View, Image, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Feather } from '@expo/vector-icons';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getImageUrl } from '@/utils/image';

type Props = {
  name?: string;
  phone?: string;
  email?: string;
  profileImage?: string | null;
  onEdit?: () => void;
};

export function ProfileInfoCard({ name, phone, email, profileImage, onEdit }: Props) {
  return (
    <View className="flex-row items-center rounded-2xl border border-gray-200 bg-white p-4">
      {/* AVATAR */}
      <View className="w-16">
        <AspectRatio ratio={1}>
          <Image
            source={
              profileImage
                ? { uri: getImageUrl(profileImage) }
                : require('@/assets/images/default-avtar.jpg')
            }
            className="h-full w-full rounded-full"
            resizeMode="cover"
          />
        </AspectRatio>
      </View>

      {/* INFO */}
      <View className="ml-4 flex-1">
        <Text className="text-base font-semibold text-gray-900">{name}</Text>

        <View className="mt-1 flex-row items-center">
          <Feather name="phone" size={14} color="#6B7280" />
          <Text className="ml-2 text-sm text-gray-500">{phone}</Text>
        </View>

        <View className="mt-1 flex-row items-center">
          <Feather name="mail" size={14} color="#6B7280" />
          <Text numberOfLines={1} className="ml-2 text-sm text-gray-500">
            {email}
          </Text>
        </View>
      </View>

      {/* EDIT */}
      {onEdit && (
        <Pressable onPress={onEdit}>
          <Feather name="edit-2" size={16} color="#6B7280" />
        </Pressable>
      )}
    </View>
  );
}
