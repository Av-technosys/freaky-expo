
import React, { useState } from 'react';
import { View, Image, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { Signup } from '@/api';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { AppButton } from '@/components/common/AppButton';
import { SocialConnections } from './social-connections';

export function SignUpForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const onChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignup = async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);

    const { name, phone, email, password } = form;

    if (!name || !phone || !email || !password) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' });
      return;
    }

    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' });
      return;
    }

    const payload = {
      full_name: name,
      email,
      number: `+91${phone}`,
      password,
    };

    try {

      setLoading(true);

      const response = await Signup(payload);

      Toast.show({
        type: 'success',
        text1: 'Signup successful. Verify OTP',
      });
      // loginSuccess({ username: email });
      console.log('Signup payload:', payload , response.data);
      router.push({
        pathname: '/otpVerification',
        params: { flow: 'signup', email: payload.email },
      });
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Signup failed';
      Toast.show({ type: 'error', text1: msg });
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

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">Create Account</CardTitle>
          <CardDescription className="mx-auto max-w-xs text-center">
            Sign up to get started with our app
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-5">
          {/* NAME */}
          <View className="gap-1.5">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChangeText={(v) => onChange('name', v)}
              placeholder="Enter your name"
            />
          </View>

          {/* PHONE */}
          <View className="gap-1.5">
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChangeText={(v) => onChange('phone', v)}
              placeholder="Phone number"
              keyboardType="phone-pad"
            />
          </View>

          {/* EMAIL */}
          <View className="gap-1.5">
            <Label>Email</Label>
            <Input
              value={form.email}
              onChangeText={(v) => onChange('email', v)}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* PASSWORD */}
          <View className="gap-1.5">
            <Label>Password</Label>

            <View>
              <Input
                value={form.password}
                onChangeText={(v) => onChange('password', v)}
                placeholder="••••••••"
                secureTextEntry={secure}
              />

              <Pressable onPress={() => setSecure(!secure)} className="absolute right-3 top-3">
                <Feather name={secure ? 'eye' : 'eye-off'} size={20} color="#6b7280" />
              </Pressable>
            </View>
          </View>

          {/* BUTTON */}
          <AppButton size="lg" onPress={handleSignup} disabled={loading}>
            <Text>{loading ? 'Signing up…' : 'Sign Up'}</Text>
          </AppButton>

          {/* LOGIN LINK */}
          <Text className="mt-2 text-center text-sm">
            Already have an account?{' '}
            <Text className="font-medium underline" onPress={() => router.push('/login')}>
              Login
            </Text>
          </Text>
          {/* SOCIAL sign up */}
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
