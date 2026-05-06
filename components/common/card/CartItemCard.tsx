import { View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

type Props = {
  title: string;
  vendorName?: string;
  guestRange: string;
  date: string;
  time?: string;
  phone?: string;
  address?: string;
  price: number;
  quantity: number;
  onDelete: () => void;
  onPress?: () => void;
};

export default function CartItemCard({
  title,
  vendorName,
  guestRange,
  date,
  time,
  phone,
  address,
  price,
  quantity,
  onDelete,
  onPress,
}: Props) {
  const total = Number(price || 0) * Number(quantity || 1);

  return (
    <Pressable onPress={onPress}>
      <Card className="-mx-4 mt-4 -py-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow">
        <View className="flex-row">
          <View className="w-16 items-center justify-center bg-orange-400">
            <Feather name="gift" size={28} color="#fff" />
          </View>

          <View className="flex-1 px-4 py-3">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-base font-semibold text-black" numberOfLines={1}>
                  {title}
                </Text>
                <Text className="mt-0.5 text-xs text-gray-500" numberOfLines={1}>
                  {vendorName || 'Vendor not specified'}
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-xs text-gray-400">Qty {quantity}</Text>
                <Text className="font-bold text-orange-500">₹ {total.toFixed(2)}</Text>
              </View>
            </View>

            <View className="mt-3 gap-1.5">
              <View className="flex-row items-center gap-2">
                <Feather name="calendar" size={14} color="#666" />
                <Text className="flex-1 text-xs text-gray-600" numberOfLines={1}>
                  {date}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Feather name="clock" size={14} color="#666" />
                <Text className="flex-1 text-xs text-gray-600" numberOfLines={1}>
                  {time || 'Time not specified'}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Feather name="users" size={14} color="#666" />
                <Text className="flex-1 text-xs text-gray-600" numberOfLines={1}>
                  {guestRange}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Feather name="phone" size={14} color="#666" />
                <Text className="flex-1 text-xs text-gray-600" numberOfLines={1}>
                  {phone || 'Phone not specified'}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Feather name="map-pin" size={14} color="#666" />
                <Text className="flex-1 text-xs text-gray-600" numberOfLines={1}>
                  {address || 'Address not specified'}
                </Text>
              </View>
            </View>
          </View>

          <Pressable onPress={onDelete} className="w-12 items-center justify-center bg-red-100">
            <Feather name="trash-2" size={20} color="#dc2626" />
          </Pressable>
        </View>
      </Card>
    </Pressable>
  );
}
