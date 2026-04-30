// components/auth/SignInForm.tsx

import React, { useRef, useState } from 'react';
import { View, Pressable, TextInput, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { login } from '@/api/auth';
import { loginSuccess } from '@/store/slices/authSlice';
import { decodeIdToken } from '@/utils/decodeToken';
import { Feather } from '@expo/vector-icons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Separator } from '@/components/ui/separator';
import { SocialConnections } from '@/components/social-connections';
import { AppButton } from './common/AppButton';
import { setGlobalToken } from '@/api/interceptors';

export function SignInForm() {
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Enter email & password' });
      return;
    }

    try {
      setLoading(true);

      const data = await login({ email, password });

      await AsyncStorage.multiSet([
        ['accessToken', data.accessToken],
        ['refreshToken', data.refreshToken],
        ['idToken', data.idToken],
      ]);
     setGlobalToken(data.accessToken); 
      const user = decodeIdToken(data.idToken);
      await AsyncStorage.setItem('username', user?.username);

      dispatch(loginSuccess(user));

      Toast.show({ type: 'success', text1: 'Welcome back 👋' });

      router.replace('/home');
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Check credentials',
      });

      console.log('LOGIN ERROR ❌', err?.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-12 gap-6">
      
      <View className="items-center">
        <Image
          source={require('@/assets/images/freeky-icon.png')}
          className="h-20 w-48"
          resizeMode="contain"
        />
      </View>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">Get Started Now</CardTitle>
          <CardDescription className="text-center max-w-xs mx-auto">
  Create an account or log in to explore our app
</CardDescription>
        </CardHeader>

        <CardContent className="gap-5">
          {/* EMAIL */}
          <View className="gap-1.5">
            <Label>Email</Label>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>

          <View className="gap-1.5">
            <Label>Password</Label>

            <View>
              <Input
                //ref={passwordRef }
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
                placeholder="••••••••"
                returnKeyType="send"
                onSubmitEditing={handleLogin}
              />

              {/* 👁 toggle */}
              <Pressable onPress={() => setSecure(!secure)} className="absolute right-3 top-3">
                <Feather name={secure ? 'eye' : 'eye-off'} size={20} color="#6b7280" />
              </Pressable>
            </View>

            {/* ✅ Forgot below input */}
            <Pressable  className="mt-1 items-end">
              <Text onPress={() => router.push('/forgetPassword')} className="text-md underline">
                Forgot password?
              </Text>
            </Pressable>
          </View>

          {/* BUTTON */}
          <AppButton size="lg" onPress={handleLogin} disabled={loading}>
            <Text>{loading ? 'Logging in…' : 'Log In'}</Text>
          </AppButton>

          {/* DIVIDER */}
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="px-3 text-xs text-muted-foreground">OR</Text>
            <Separator className="flex-1" />
          </View>
              {/* SIGNUP */}
          <Text className="mt-2 text-center text-sm">
            Don’t have an account?{' '}
            <Text className="font-medium underline" onPress={() => router.push('/signUp')}>
              Sign up
            </Text>
          </Text>

          {/* SOCIAL LOGIN */}
          <SocialConnections />

      
        </CardContent>
      </Card>
    </View>
  );
}
