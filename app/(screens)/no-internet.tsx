import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Network from 'expo-network';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/button';
import Screen from '@/app/provider/Screen';
import { AppButton } from '@/components/common/AppButton';

const NoInternetScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRetry = async () => {
    setLoading(true);
    setError('');

    const state = await Network.getNetworkStateAsync();

    const isOnline = state.isConnected;

    setLoading(false);

    if (!isOnline) {
      setError('Still no internet connection');
    }
  };

  return (
    <Screen>
      <View className="flex-1 items-center justify-center bg-white px-6">
        {/* Icon */}
        <LinearGradient
          colors={['#FACC15', '#F97316']}
          className="mb-6 h-28 w-28 items-center justify-center rounded-full">
          <MaterialCommunityIcons name="wifi-off" size={60} color="#fff" />
        </LinearGradient>

        {/* Title */}
        <Text className="mb-2 text-2xl font-bold text-gray-900">No Internet</Text>

        {/* Subtitle */}
        <Text className="mb-4 text-center text-gray-500">
          You’re offline right now. Please check your internet connection and try again.
        </Text>

        {/* Error */}
        {error ? <Text className="mb-4 text-red-500">{error}</Text> : null}

        {/* Button */}
        <AppButton onPress={handleRetry} disabled={loading}>
          <Text>{loading ? 'Checking...' : 'Reload'}</Text>
        </AppButton>

        {loading && <ActivityIndicator />}
      </View>
    </Screen>
  );
};

export default NoInternetScreen;
