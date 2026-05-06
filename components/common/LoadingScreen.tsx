import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>

      <View style={styles.innerContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // You can change this to match your app's background
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 38, // Slightly less than the gradient's 40 to show the gradient border
    justifyContent: 'center',
    alignItems: 'center',
  },
});
