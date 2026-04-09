import React from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/ui/button'; // your reusable button

export default function AuthIntroScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} className="flex-1 bg-background">
      <StatusBar style="dark" />

      {/* HERO */}
      <View className="relative w-full h-[45%]">
        {/* BG IMAGE */}
        <Image
          source={require('@/assets/images/login-bg-bottom.png')}
          resizeMode="cover"
          className="absolute w-full h-full"
        />

        {/* TOP IMAGE */}
        <Image
          source={require('@/assets/images/login-bg-top.png')}
          resizeMode="contain"
          className="absolute w-full h-full"
        />

        {/* GRADIENT FADE */}
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="absolute bottom-0 w-full h-32"
        />
      </View>

      {/* CONTENT */}
      <View className="flex-1 px-6 pt-4">
        {/* LOGO */}
        <View className="items-center mb-4">
          <Image
            source={require('@/assets/images/freeky-icon.png')}
            resizeMode="contain"
            className="w-48 h-20"
          />
        </View>

        {/* TEXT */}
        <Text className="text-2xl font-semibold text-center text-foreground mb-3">
          Make your events unforgettable
        </Text>

        <Text className="text-base text-center text-muted-foreground leading-6 mb-8">
          Discover curated services for birthdays, parties, weddings
          and more — all in one place.
        </Text>

        {/* ACTIONS */}
        <View className="mt-8 pb-6 space-y-4">
          <Button
            variant="default" // gradient-filled
            size="lg"
            onPress={() =>
              navigation.getParent()?.navigate('AuthStack', {
                screen: 'SignUp',
              })
            }
          >
            Sign Up
          </Button>

          <Button
            variant="outline"
            size="lg"
            onPress={() =>
              navigation.getParent()?.navigate('AuthStack', {
                screen: 'Login',
              })
            }
          >
            Log In
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
