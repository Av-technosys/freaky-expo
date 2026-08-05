import { Image, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/text';

const logo = require('@/assets/images/freeky-icon.png');

export default function AboutFCScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 34,
          paddingBottom: Math.max(insets.bottom, 0) + 36,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/Profile'))}
            className="-ml-1 h-8 w-8 justify-center"
          >
            <Feather name="arrow-left" size={24} color="#111111" />
          </Pressable>
          <Text className="ml-2 text-base font-extrabold text-[#111111]">About FC</Text>
        </View>

        <Image source={logo} resizeMode="contain" className="mt-[29px] h-[45px] w-[103px]" />

        <Text className="mt-[25px] text-[22px] font-extrabold leading-7 text-black">
          Freaky Chimp
        </Text>
        <Text className="mt-1 text-[14px] font-medium text-[#555555]">Version 1.0.0</Text>

        <Text className="mt-[25px] text-base font-medium leading-[23px] text-[#555555]">
          Freaky Chimp is an all-in-one event and service booking platform that makes
          planning celebrations simple and hassle-free. From weddings and birthdays to
          engagements, baby showers, housewarming ceremonies, and festive events, you can
          book curated event packages or individual services with ease.
        </Text>

        <Text className="mt-[25px] text-base font-medium leading-[23px] text-[#555555]">
          Our mission is to deliver seamless event experiences through trusted services,
          elegant planning, and a user-friendly platform-helping you create unforgettable
          moments, every time.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
