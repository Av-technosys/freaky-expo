// components/auth/ForgotPasswordForm.tsx

import { useState } from 'react';
import { View, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

import { forgotPassword } from '@/api/auth';

// UI
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { AppButton } from '@/components/common/AppButton';

export function ForgotPasswordForm() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!username) {
      Toast.show({ type: 'error', text1: 'Enter email or phone' });
      return;
    }

    try {
      setLoading(true);

      await forgotPassword({ email: username });

      Toast.show({
        type: 'success',
        text1: 'OTP sent successfully',
      });

      router.push({
        pathname: '/otpVerification',
        params: { email: username, flow: 'forgotPassword' },
      });

    } catch {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-12 gap-6">

      {/* LOGO */}
      <View className="items-center">
        <Image
          source={require('@/assets/images/freeky-icon.png')}
          className="h-20 w-40"
          resizeMode="contain"
        />
      </View>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Forgot Password
          </CardTitle>

          <CardDescription className="text-center max-w-xs mx-auto">
            Enter your email or phone number to receive OTP
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">

          {/* INPUT */}
          <View className="gap-1.5">
            <Label>Email / Phone</Label>
            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="Enter email or phone"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* BUTTON */}
          <AppButton
            size="lg"
            onPress={handleSendOtp}
            disabled={loading}
          >
            <Text>
              {loading ? 'Sending…' : 'Send OTP'}
            </Text>
          </AppButton>

        </CardContent>
      </Card>
    </View>
  );
}