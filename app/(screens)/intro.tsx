import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import type { RootState } from '@/store';
import * as Location from 'expo-location';

export default function IntroScreen() {
  console.log('IntroScreen rendered');
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  
  const isConnected = useNetworkStatus();
  return (
    <View style={styles.container}>
      <StatusBar hidden translucent />

      <LottieView
        source={require('@/assets/intro.json')}
        autoPlay
        loop={false}
        resizeMode="cover"
        onAnimationFinish={async () => {
          if (!isConnected) {
            router.replace('/no-internet');
          } else if (!isLoggedIn) {
            router.replace('/authintro');
          } else {
            const locationPermission = await Location.getForegroundPermissionsAsync();
            if (locationPermission.status !== 'granted') {
              router.replace('/LocationPermissionScreen');
              return;
            }
            router.replace('/home');
          }
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
