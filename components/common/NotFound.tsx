// components/common/notFound/NotFound.tsx

import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';

// UI
import { Text } from '@/components/ui/text';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { AppButton } from '@/components/common/AppButton';
import Screen from '@/app/provider/Screen';
type Props = {
  title: string;
  description: string;
  ctaLabel?: string;
  onPress?: () => void;
};

export default function NotFound({
  title,
  description,
  ctaLabel,
  onPress,
}: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) return onPress();

    // fallback navigation (optional)
    router.push('/home');
  };

  return (
    <Screen>
    <View className="flex-1 justify-center px-6">

      <Card>
        <CardContent className="items-center py-8">

          {/* 🖼 IMAGE */}
          <Image
            source={require('@/assets/images/no-booking.png')}
            resizeMode="contain"
            className="w-full h-56 mb-6"
          />

          {/* 📝 TITLE */}
          <Text className="text-xl font-semibold text-center mb-2">
            {title}
          </Text>

          {/* 📄 DESCRIPTION */}
          <Text className="text-center text-muted-foreground text-base px-4 mb-6">
            {description}
          </Text>

          {/* 🔘 CTA */}
          {ctaLabel && (
            <AppButton onPress={handlePress} className="w-full">
              <Text>{ctaLabel}</Text>
            </AppButton>
          )}

        </CardContent>
      </Card>

    </View>
    </Screen>
  );
}