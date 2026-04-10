// components/auth/ResetPasswordForm.tsx

import React, { useState } from 'react';
import { View, Image, Pressable } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { confirmForgotPassword } from '@/api/auth';

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

export function ResetPasswordForm() {
  const router = useRouter();
  const { username, code }:any = useLocalSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Fill all fields' });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }

    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Min 6 characters required' });
      return;
    }

    try {
      setLoading(true);

      await confirmForgotPassword({
        username,
        code,
        newPassword: password,
      });

      Toast.show({
        type: 'success',
        text1: 'Password reset successful 🎉',
      });

      router.replace('/passwordSuccess');

    } catch {
      Toast.show({
        type: 'error',
        text1: 'Reset failed',
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
          className="h-20 w-48"
          resizeMode="contain"
        />
      </View>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Reset Password
          </CardTitle>

          <CardDescription className="text-center max-w-xs mx-auto">
            Create a new password for your account
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">

          {/* NEW PASSWORD */}
          <View className="gap-1.5">
            <Label>New Password</Label>

            <View>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                secureTextEntry={secure1}
              />

              <Pressable
                onPress={() => setSecure1(!secure1)}
                className="absolute right-3 top-3"
              >
                <Feather
                  name={secure1 ? 'eye' : 'eye-off'}
                  size={20}
                  color="#6b7280"
                />
              </Pressable>
            </View>
          </View>

          {/* CONFIRM PASSWORD */}
          <View className="gap-1.5">
            <Label>Confirm Password</Label>

            <View>
              <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                secureTextEntry={secure2}
              />

              <Pressable
                onPress={() => setSecure2(!secure2)}
                className="absolute right-3 top-3"
              >
                <Feather
                  name={secure2 ? 'eye' : 'eye-off'}
                  size={20}
                  color="#6b7280"
                />
              </Pressable>
            </View>
          </View>

          {/* BUTTON */}
          <AppButton
            size="lg"
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text>
              {loading ? 'Updating…' : 'Submit'}
            </Text>
          </AppButton>

        </CardContent>
      </Card>
    </View>
  );
}