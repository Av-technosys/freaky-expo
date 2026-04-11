import { Redirect } from 'expo-router';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';


export default function Index() {
  const isConnected = useNetworkStatus();
  useEffect(() => {
    const checkStorage = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        console.log("ALL KEYS 👉", keys);

        const items = await AsyncStorage.multiGet(keys);
        console.log("ALL DATA 👉", items);
      } catch (e) {
        console.log("Storage error", e);
      }
    };

    checkStorage();
  }, []);
  if (isConnected === null) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  // ✅ ALWAYS show intro first
  return <Redirect href="/intro" />;
}