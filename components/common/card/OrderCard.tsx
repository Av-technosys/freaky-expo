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
  price?: string | any;
  status?: string;
  date?: string;

  onPress: () => void;
  onDelete?: () => void;

  variant?: OrderCardVariant;
};

export default function OrderCard({
  title,
  venue,
  price,
  status,
  date,
  onPress,
}: OrderCardProps) {
  const safeTitle = title || ''
  const safeVenue = venue || ''
  const safePrice = price != null ? String(price) : ''
  const safeStatus = status || ''

  let safeDate = ''
  if (date) {
    const d = new Date(date)
    if (!isNaN(d.getTime())) {
      safeDate = d.toLocaleDateString()
    }
  }

  return (
    <Pressable onPress={onPress}>
      <Card className="overflow-hidden -py-4 mt-6 rounded-2xl border border-border">

        <View className="flex-row">

          <View className="w-16 items-center justify-center bg-orange-400">
            <Feather name="gift" size={24} color="white" />
          </View>

          <CardContent className="flex-1 px-4 py-3">
            <Text className="font-semibold text-base">
              {safeTitle}
            </Text>

            {safeVenue ? (
              <Text className="text-muted-foreground mt-1 text-sm">
                {safeVenue}
              </Text>
            ) : null}

            {safeDate ? (
              <Text className="text-muted-foreground mt-1 text-sm">
                {safeDate}
              </Text>
            ) : null}

            {safePrice ? (
              <Text className="mt-1 font-medium">
                ₹ {safePrice}
              </Text>
            ) : null}
          </CardContent>

          {safeStatus ? (
            <View
              className={`w-14 items-center justify-center ${safeStatus === 'confirmed' || safeStatus === 'completed'
                ? 'bg-green-100'
                : 'bg-red-200'
                }`}
            >
              <Text
                className={`text-xs font-semibold rotate-90 ${safeStatus === 'confirmed' || safeStatus === 'completed'
                  ? 'text-green-600'
                  : 'text-red-700'
                  }`}
              >
                {safeStatus}
              </Text>
            </View>
          ) : null}

        </View>

      </Card>
    </Pressable>
  )
}