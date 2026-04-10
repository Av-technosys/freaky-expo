// components/auth/VerifyEmailForm.tsx

import React, { useRef, useState, useEffect } from 'react';
import { View, Pressable, TextInput, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { confirmOtp, resendOtp } from '@/api/auth';
import { loginSuccess } from '@/store/slices/authSlice';
import { decodeIdToken } from '@/utils/decodeToken';

// UI
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { AppButton } from '@/components/common/AppButton';

const OTP_LENGTH = 6;
const RESEND_TIME = 30;

export function VerifyEmailForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { flow, email: username = '' }:any = useLocalSearchParams();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIME);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const inputs = useRef<(TextInput | null)[]>([]);

  // ⏱ timer
  useEffect(() => {
    if (!resendDisabled) return;

    if (secondsLeft === 0) {
      setResendDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft, resendDisabled]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      setResendDisabled(true);
      setSecondsLeft(RESEND_TIME);

      await resendOtp({ username });

      Toast.show({ type: 'success', text1: 'OTP resent' });
    } catch {
      Toast.show({ type: 'error', text1: 'Resend failed' });
      setResendDisabled(false);
    }
  };

  const handleConfirm = async () => {
    const code = otp.join('');

    if (code.length !== OTP_LENGTH) {
      Toast.show({ type: 'error', text1: 'Enter full OTP' });
      return;
    }

    try {
      setLoading(true);

       const data = await confirmOtp({ email: username, code });

      Toast.show({ type: 'success', text1: 'OTP verified 🎉' });

      if (flow === 'signup') {
        const { accessToken, refreshToken } = data;

        await AsyncStorage.multiSet([
          ['accessToken', accessToken],
          ['refreshToken', refreshToken],
        ]);

        const user = decodeIdToken(accessToken);
        dispatch(loginSuccess(user));

        router.replace('/home');
        return;
      }

      if (flow === 'forgotPassword') {
        router.push({
          pathname: '/resetPassword',
          params: { username, code },
        });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'OTP failed' });
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
          className="h-20 w-48"
          resizeMode="contain"
        />
      </View>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Verify OTP
          </CardTitle>
          <CardDescription className="text-center max-w-xs mx-auto">
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6 items-center">

          {/* OTP BOXES */}
          <View className="flex-row justify-center gap-3">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                //ref={(ref) => (inputs.current[index] = ref)}
                value={digit}
                onChangeText={(v) => handleChange(v, index)}
                keyboardType="number-pad"
                maxLength={1}
                className="w-12 h-14 border border-border rounded-lg text-center text-lg font-semibold"
              />
            ))}
          </View>

          {/* RESEND */}
          <View className="flex-row justify-between w-full px-2">
            <Pressable onPress={handleResend} disabled={resendDisabled}>
              <Text className={resendDisabled ? 'text-muted-foreground' : 'text-primary'}>
                Resend code
              </Text>
            </Pressable>

            {resendDisabled && (
              <Text className="text-muted-foreground">
                {formatTime(secondsLeft)}
              </Text>
            )}
          </View>

          {/* BUTTON */}
          <AppButton onPress={handleConfirm} disabled={loading}>
            <Text>{loading ? 'Verifying…' : 'Confirm'}</Text>
          </AppButton>

        </CardContent>
      </Card>
    </View>
  );
}