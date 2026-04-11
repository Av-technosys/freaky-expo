// components/common/cards/OrderCard.tsx

import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

// UI
import { Text } from '@/components/ui/text';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

type OrderCardVariant = 'default' | 'compact';

type OrderCardProps = {
  title: string;
  venue?: string;
  price?: string | null;
  status?: string;

  onPress: () => void;
  onDelete?: () => void;

  variant?: OrderCardVariant;
};

export default function OrderCard({
  title,
  venue,
  price,
  status,
  onPress,
}: OrderCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card className="overflow-hidden rounded-2xl border border-border">

        <View className="flex-row">

          {/* 🔶 LEFT ICON */}
          <View className="w-16 items-center justify-center bg-orange-400">
            <Feather name="gift" size={24} color="white" />
          </View>

          {/* 📄 CONTENT */}
          <CardContent className="flex-1 px-4 py-3">
            <Text className="font-semibold text-base">
              {title}
            </Text>

            {venue && (
              <Text className="text-muted-foreground mt-1 text-sm">
                {venue}
              </Text>
            )}

            {/* {price && (
              <Text className="mt-1 font-medium">
                ₹ {price}
              </Text>
            )} */}
          </CardContent>

          {/* 📌 STATUS STRIP */}
          {status && (
            <View
              className={`w-14 items-center justify-center ${
                status === 'Paid'
                  ? 'bg-green-100'
                  : 'bg-red-200'
              }`}
            >
              <Text
                className={`text-xs font-semibold rotate-90 ${
                  status === 'Paid'
                    ? 'text-green-600'
                    : 'text-red-700'
                }`}
              >
                {status}
              </Text>
            </View>
          )}

        </View>

      </Card>
    </Pressable>
  );
}