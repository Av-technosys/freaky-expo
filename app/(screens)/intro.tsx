import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import type { RootState } from '@/store';

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
        onAnimationFinish={() => {
          if (!isConnected) {
            router.replace('/no-internet');
          } else if (!isLoggedIn) {
            router.replace('/authIntro');
          } else {
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
