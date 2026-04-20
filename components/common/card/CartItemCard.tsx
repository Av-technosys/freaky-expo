import { View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

type Props = {
  title: string;
  guestRange: string;
  date: string;
  onDelete: () => void;
  onPress?: () => void;
};

export default function CartItemCard({
  title,
  guestRange,
  date,
  onDelete,
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress}>
      <Card className="flex-row -py-6 -mx-4 items-center overflow-hidden rounded-2xl bg-white shadow">

        {/* LEFT ICON */}
        <View className="w-20 h-full bg-orange-300 justify-center items-center rounded-l-2xl">
          <Feather name="gift" size={28} color="#fff" />
        </View>

        {/* CONTENT */}
        <View className="flex-1 px-4 py-3">
          <Text className="text-lg font-semibold text-black">
            {title}
          </Text>

          <View className="flex-row items-center mt-1 gap-2">
            <Feather name="users" size={14} color="#666" />
            <Text className="text-sm text-gray-500">
              {guestRange}
            </Text>
          </View>

          <View className="flex-row items-center mt-1 gap-2">
            <Feather name="calendar" size={14} color="#666" />
            <Text className="text-sm text-gray-500">
              {date}
            </Text>
          </View>
        </View>

        {/* DELETE STRIP */}
        <Pressable
          onPress={onDelete}
          className="w-14 h-full bg-red-200 justify-center items-center"
        >
          <Feather name="trash-2" size={20} color="red" />
        </Pressable>
      </Card>
    </Pressable>
  );
}