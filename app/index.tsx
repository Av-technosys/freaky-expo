import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IntroScreen() {
  const isConnected = useNetworkStatus();

  const checkAuth = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const idToken = await AsyncStorage.getItem('idToken');

    if (!isConnected) {
      router.replace('/no-internet');
      return;
    }

    if (!accessToken || !idToken) {
      router.replace('/authIntro');
      return;
    }

    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden translucent />

      <LottieView
        source={require('@/assets/intro.json')}
        autoPlay
        loop={false}
        resizeMode="cover"
        onAnimationFinish={() => {
           router.replace('/home')
        }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});