// components/common/SuccessScreen.tsx

import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { Text } from '@/components/ui/text';
import { AppButton } from '@/components/common/AppButton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

type Props = {
  title: string;
  description: string;
  buttonText?: string;
  onPress?: () => void;
};

export function SuccessScreen({
  title,
  description,
  buttonText = 'Continue',
  onPress,
}: Props) {
  const router = useRouter();

  const handleContinue = () => {
    if (onPress) return onPress();

    Toast.show({ type: 'success', text1: 'Welcome back!' });
    router.replace('/home');
  };

  return (
    <View className="flex-1  justify-center">

      <Card className="gap-6 py-6 px-4 ">

        <CardHeader className="items-center">
          {/* LOGO */}
          <Image
            source={require('@/assets/images/freeky-icon.png')}
            resizeMode="contain"
            className="w-48 h-20 mb-4"
          />

          {/* TITLE */}
          <CardTitle className="text-center text-xl">
            {title}
          </CardTitle>

          {/* DESCRIPTION */}
          <CardDescription className="text-center max-w-xs">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-4 py-6 px-6 items-center">
          {/* BUTTON */}
          <AppButton size="lg" onPress={handleContinue}>
            <Text>{buttonText}</Text>
          </AppButton>
        </CardContent>

      </Card>
    </View>
  );
}