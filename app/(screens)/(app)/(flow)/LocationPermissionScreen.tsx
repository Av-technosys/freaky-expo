import { Image, Pressable, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Crosshair } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { toast } from '@/components/common/ToastManager';

const currentLocation = require('@/public/Current-location.png');

export default function LocationPermissionScreen() {
  const insets = useSafeAreaInsets();

  const enableLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        toast.error('Location permission denied');
        return;
      }

      router.replace('/home');
    } catch {
      toast.error('Unable to request location permission');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      <View
        className="flex-1 px-[27px]"
        style={{ paddingTop: 61, paddingBottom: Math.max(insets.bottom, 0) + 57 }}
      >
        <Text className="self-center text-center text-[17px] font-extrabold leading-[20px] text-[#555555]">
          Set Your Location to Start Exploring{'\n'}Nearby Services
        </Text>

        <View className="flex-1 items-center justify-center">
          <Image
            source={currentLocation}
            resizeMode="contain"
            className="h-[286px] w-full"
          />
        </View>

        <View className="gap-3">
          <Button
            onPress={enableLocation}
            className="h-[46px] w-full rounded-lg bg-[#ff6a2e]"
          >
            <View className="flex-row items-center justify-center">
              <Crosshair size={15} color="#ffffff" strokeWidth={2.4} />
              <Text className="ml-2 text-[13px] font-extrabold text-white">
                Enable Device Location
              </Text>
            </View>
          </Button>

          <Pressable
            onPress={() => router.navigate('/AddressManagementScreen')}
            className="h-[46px] items-center justify-center rounded-lg border border-[#ff5a2a] bg-white"
          >
            <Text className="text-[13px] font-extrabold text-[#ff5a2a]">
              Enter Your location Manually
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
