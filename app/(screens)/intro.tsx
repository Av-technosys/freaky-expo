import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';

export default function IntroScreen() {
  console.log('IntroScreen rendered');
  return (
    <View style={styles.container}>
      <StatusBar hidden translucent />

      <LottieView
       source={require('@/assets/intro.json')}
        autoPlay
        loop={false}
        resizeMode="cover"
        onAnimationFinish={() => {
          router.replace('/'); 
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