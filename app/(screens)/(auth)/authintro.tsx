import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '@/app/provider/Screen';
import { useRouter } from 'expo-router';
import { AppButton } from '@/components/common/AppButton';

export default function AuthIntroScreen() {
  const router = useRouter();

  return (
    <Screen scroll>
      {/* HERO */}
      <View className="relative h-[45%] w-full">
        {/* BG IMAGE */}
        <Image
          source={require('@/assets/images/login-bg-bottom.png')}
          resizeMode="cover"
          className="absolute h-full w-full"
        />

        {/* TOP IMAGE */}
        <Image
          source={require('@/assets/images/login-bg-top.png')}
          resizeMode="contain"
          className="absolute h-full w-full"
        />

        {/* GRADIENT FADE */}
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="absolute bottom-0 h-32 w-full"
        />
      </View>

      {/* CONTENT */}
      <View className="flex-1 px-6 pt-4">
        {/* LOGO */}
        <View className="mb-4 items-center">
          <Image
            source={require('@/assets/images/freeky-icon.png')}
            resizeMode="contain"
            className="h-20 w-48"
          />
        </View>

        {/* TEXT */}
        <Text className="mb-3 text-center text-2xl font-semibold text-foreground">
          Make your events unforgettable
        </Text>

        <Text className="mb-8 text-center text-base leading-6 text-muted-foreground">
          Discover curated services for birthdays, parties, weddings and more — all in one place.
        </Text>

        {/* ACTIONS */}
        <View className="mt-8 w-full gap-4 px-6 pb-6">
          <AppButton size="lg" onPress={() => router.replace('/signUp')}>
            Sign Up
          </AppButton>

          <AppButton variant="outline" size="lg" onPress={() => router.replace('/login')}>
            Log In
          </AppButton>
        </View>
      </View>
    </Screen>
  );
}
