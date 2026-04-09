/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';

import { confirmForgotPassword } from '@/api/auth';

type RouteParams = {
  ResetPassword: {
    username: string;
    code: string;
  };
};

export default function ResetPasswordScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'ResetPassword'>>();
  const { username, code } = route.params;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' });
      return;
    }

    try {
      setLoading(true);
      await confirmForgotPassword({ username, code, newPassword: password });
      Toast.show({ type: 'success', text1: 'Password reset successful' });

      navigation.reset({
        index: 0,
        routes: [{ name: 'PasswordSuccess' }],
      });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <ScreenHeader title="Reset Password" showBack />

      {/* LOGO */}
      <View className="items-center">
        <Image
          source={require('@/assets/images/freeky-icon.png')}
          className="w-64 h-28"
          resizeMode="contain"
        />
      </View>

      {/* TITLE */}
      <View className="items-center mt-4 px-6">
        <Text className="text-3xl font-semibold text-foreground">Reset Password</Text>
        <Text className="text-muted-foreground text-center mt-2">
          Please create a new password for your account
        </Text>
      </View>

      {/* FORM */}
      <View className="mt-10 space-y-6">
        <View>
          <Text className="text-sm font-medium text-foreground mb-2">New Password</Text>
          <View className="flex-row items-center">
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              secureTextEntry={secure1}
              className="flex-1"
            />
            <Pressable onPress={() => setSecure1(!secure1)} className="ml-2">
              <Text>{secure1 ? '👁️‍🗨️' : '👁️'}</Text>
            </Pressable>
          </View>
        </View>

        <View>
          <Text className="text-sm font-medium text-foreground mb-2">Confirm Password</Text>
          <View className="flex-row items-center">
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry={secure2}
              className="flex-1"
            />
            <Pressable onPress={() => setSecure2(!secure2)} className="ml-2">
              <Text>{secure2 ? '👁️‍🗨️' : '👁️'}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* SUBMIT */}
      <Button
        variant="default"
        size="lg"
        className="mt-16 mb-8"
        onPress={handleSubmit}
        disabled={loading}
      >
        Submit
      </Button>
    </Screen>
  );
}
