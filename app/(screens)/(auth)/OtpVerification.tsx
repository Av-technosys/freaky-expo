/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { Button } from '@/components/ui/button';
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';

import { confirmOtp, resendOtp } from '@/api/auth';
import { loginSuccess } from '@/store/slices/authSlice';
import { decodeIdToken } from '@/utils/decodeToken';

type RouteProps = RouteProp<any, 'OtpVerification'>;

const OTP_LENGTH = 6;
const RESEND_TIME = 30;

export default function OtpVerificationScreen() {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIME);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);

  const inputs = useRef<(TextInput | null)[]>([]);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProps>();

  const { flow, email: username = '' } = route.params ?? {};

  // countdown timer
  useEffect(() => {
    if (!resendDisabled) return;
    if (secondsLeft === 0) {
      setResendDisabled(false);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, resendDisabled]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleResendOtp = async () => {
    try {
      setResendDisabled(true);
      setSecondsLeft(RESEND_TIME);
      await resendOtp({ username });
      Toast.show({ type: 'success', text1: 'OTP resent successfully' });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Failed to resend OTP' });
      setResendDisabled(false);
    }
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

  const handleConfirm = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) {
      Toast.show({ type: 'error', text1: 'Please enter the complete OTP' });
      return;
    }

    try {
      setLoading(true);
      const data = await confirmOtp({ email: username, code });
      Toast.show({ type: 'success', text1: 'OTP verified successfully' });

      if (flow === 'signup') {
        const { accessToken, refreshToken } = data;
        await AsyncStorage.multiSet([
          ['accessToken', accessToken],
          ['refreshToken', refreshToken],
        ]);
        const user = decodeIdToken(accessToken);
        dispatch(loginSuccess(user));
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        return;
      }

      if (flow === 'forgotPassword') {
        navigation.navigate('ResetPassword', { username, code });
        return;
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'OTP verification failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <ScreenHeader title="Verify OTP" showBack />

      {/* LOGO */}
      <View className="items-center">
        <Image
          source={require('@/assets/images/freeky-icon.png')}
          className="w-64 h-28"
          resizeMode="contain"
        />
      </View>

      {/* TITLE */}
      <View className="items-center pt-6 px-6">
        <Text className="text-3xl font-semibold text-foreground">Verify OTP</Text>
        <Text className="text-muted-foreground text-center mt-2">
          Enter the 6-digit code sent to you
        </Text>
      </View>

      {/* OTP INPUTS */}
      <View className="pt-12 flex-row justify-center" style={{ gap: 12 }}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref: TextInput | null) => {
              inputs.current[index] = ref;
            }}
            value={digit}
            onChangeText={v => handleChange(v, index)}
            keyboardType="number-pad"
            maxLength={1}
            className="w-14 h-16 border border-gray-300 rounded-xl text-center text-xl font-semibold text-foreground"
          />
        ))}
      </View>

      {/* RESEND */}
      <View className="flex-row justify-between mt-6 px-4">
        <Pressable onPress={handleResendOtp} disabled={resendDisabled}>
          <Text
            className={`font-medium ${
              resendDisabled ? 'text-gray-400' : 'text-primary'
            }`}
          >
            Resend code
          </Text>
        </Pressable>
        {resendDisabled && (
          <Text className="text-muted-foreground">{formatTime(secondsLeft)}</Text>
        )}
      </View>

      {/* CONFIRM BUTTON */}
      <Button
        variant="default"
        size="lg"
        className="mt-24"
        onPress={handleConfirm}
        disabled={loading}
      >
        Confirm
      </Button>
    </Screen>
  );
}
