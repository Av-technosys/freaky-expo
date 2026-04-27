import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Network from 'expo-network';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    <Screen scroll>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#f8fafc', '#eef2ff']}
        className="flex-1 items-center justify-center px-6">
        {/* Card Container */}
        <View className="w-full rounded-3xl bg-white p-8 shadow-lg">
          {/* Icon */}
          <View className="items-center">
            <LinearGradient
              colors={['#FACC15', '#F97316']}
              className="h-24 w-24 items-center justify-center rounded-full shadow-md">
              <MaterialCommunityIcons name="wifi-off" size={50} color="#fff" />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text className="mt-6 text-center text-2xl font-bold text-gray-900">
            No Internet Connection
          </Text>

          {/* Subtitle */}
          <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
            Looks like you're offline. Please check your connection and try again.
          </Text>

          {/* Error Message */}
          {error ? (
            <View className="mt-4 rounded-lg bg-red-50 p-3">
              <Text className="text-center text-sm text-red-500">{error}</Text>
            </View>
          ) : null}

          {/* Button */}
          <View className="mt-6">
            <AppButton variant="default" onPress={handleRetry} disabled={loading}>
              {loading ? 'Checking...' : 'Try Again'}
            </AppButton>
          </View>

          {/* Loader */}
          {loading && (
            <View className="mt-4 items-center">
              <ActivityIndicator size="small" color="#000" />
            </View>
          )}
        </View>
      </LinearGradient>
    </Screen>
  );
};

export default NoInternetScreen;
