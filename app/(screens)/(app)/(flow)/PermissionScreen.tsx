import { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  Bell,
  Mail,
} from 'lucide-react-native';
import Feather from '@expo/vector-icons/Feather';

import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

type ReminderKey = 'push' | 'email';

type ReminderItem = {
  key: ReminderKey;
  title: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
};

const REMINDERS: ReminderItem[] = [
  { key: 'push', title: 'Push Notification', icon: Bell },
  { key: 'email', title: 'Email', icon: Mail },
];

export default function PermissionScreen() {
  const insets = useSafeAreaInsets();
  const [enabled, setEnabled] = useState<Record<ReminderKey, boolean>>({
    push: true,
    email: true,
  });

  const toggle = (key: ReminderKey) => {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />

      <View
        className="flex-1 px-4"
        style={{
          paddingTop: 34,
          paddingBottom: Math.max(insets.bottom, 0) + 24,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/Profile'))}
            className="-ml-1 h-8 w-8 justify-center"
          >
            <Feather name="arrow-left" size={24} color="#111111" />
          </Pressable>
          <Text className="ml-2 text-base font-extrabold text-[#111111]">Settings</Text>
        </View>

        <Text className="mt-[29px] text-[22px] font-extrabold leading-7 text-black">
          Notification & Reminders
        </Text>

        <View className="mt-[31px]">
          {REMINDERS.map((item) => {
            const Icon = item.icon;

            return (
              <View key={item.key}>
                <View className="h-[63px] flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Icon size={21} color="#111111" strokeWidth={1.9} />
                    <Text className="ml-3 text-[14px] font-extrabold text-[#4a4a4a]">
                      {item.title}
                    </Text>
                  </View>

                  <Switch
                    value={enabled[item.key]}
                    onValueChange={() => toggle(item.key)}
                    trackColor={{ false: '#d1d5db', true: '#0a8553' }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#d1d5db"
                  />
                </View>
                <Separator className="bg-[#d8d8d8]" />
              </View>
            );
          })}
        </View>

        <View className="mt-6 rounded-md bg-[#eeeeee] px-3 py-3">
          <Text className="text-[15px] font-medium leading-5 text-black">
            Order related message
          </Text>
          <Text className="mt-2 text-[12px] font-medium leading-[17px] text-[#7b7b7b]">
            Order related messages can’t be turnes off as they are important for service
            experience
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
