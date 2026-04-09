import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import type { RootState } from '@/store';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  const isConnected = useNetworkStatus();

  useEffect(() => {
    const checkIntro = async () => {
      const seen = await AsyncStorage.getItem('introSeen');
      setShowIntro(!seen); // show intro only if NOT seen
    };

    checkIntro();
  }, []);

  // ⏳ wait until everything ready
  if (showIntro === null || isConnected === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // 🚀 INTRO (only first time)
  if (showIntro) {
    return <Redirect href="/intro" />;
  }

  // 🚀 NO INTERNET
  if (!isConnected) {
    return <Redirect href="/no-internet" />;
  }

  // 🚀 AUTH
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  // 🚀 MAIN APP
  return <Redirect href="/home" />;
}