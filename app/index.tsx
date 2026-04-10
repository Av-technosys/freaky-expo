import { Redirect } from 'expo-router';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { View, ActivityIndicator } from 'react-native';


export default function Index() {
  const isConnected = useNetworkStatus();

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