import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/api/auth';
import { loginSuccess } from '@/store/slices/authSlice';
import { decodeIdToken } from '@/utils/decodeToken';
import Screen from '@/app/provider/Screen';

export default function LoginScreen() {
  const [secure, setSecure] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Please enter email and password' });
      return;
    }

    try {
      setLoading(true);
      const data = await login({ email, password });

      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('idToken', data.idToken);

      const user = decodeIdToken(data.idToken);
      await AsyncStorage.setItem('username', user?.username);

      dispatch(loginSuccess(user));

      Toast.show({ type: 'success', text1: 'Login successful' });

      router.push('/home');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Please check your credentials',
      });
      console.log('LOGIN ERROR ❌', error?.response || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>

      {/* LOGO */}
      <View className="items-center">
        <Image
          source={require('@/assets/images/freeky-icon.png')}
          className="w-64 h-28"
          resizeMode="contain"
        />
      </View>

      {/* TITLE */}
      <Text className="text-center text-foreground font-semibold text-3xl mt-4">
        Get Started Now
      </Text>
      <Text className="text-center text-muted-foreground text-lg mt-2 px-6">
        Create an account or log in to explore our app
      </Text>

      {/* FORM */}
      <View className="mt-10 space-y-6">
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View className="relative">
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry={secure}
          />
          <Pressable
            onPress={() => setSecure(!secure)}
            className="absolute right-4 top-3"
          >
            <Text>{secure ? '👁️' : '👁️‍🗨️'}</Text>
          </Pressable>
        </View>
      </View>

      {/* LOGIN BUTTON */}
      <Button
        variant="default"
        size="lg"
        className="mt-12"
        onPress={handleLogin}
        disabled={loading}
        
      >
        {loading ? 'Logging in…' : 'Log In'}
      </Button>

      {/* SIGN UP LINK */}
      <Pressable
        onPress={() =>
       router.push('/signup')
        }
        className="mt-6 flex-row justify-center"
      >
        <Text className="text-foreground">Don't have an account? </Text>
        <Text className="text-primary font-semibold">Sign Up</Text>
      </Pressable>
    </Screen>
  );
}
