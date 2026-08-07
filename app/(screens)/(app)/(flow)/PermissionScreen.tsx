import { useState, useEffect } from 'react';
import { Pressable, Switch, View, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Bell, Mail } from 'lucide-react-native';
import Feather from '@expo/vector-icons/Feather';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { toast } from '@/components/common/ToastManager';
import { useUserDetails, saveFcmToken } from '@/api/user';

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

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  try {
    const tokenData = await Notifications.getDevicePushTokenAsync();
    return tokenData.data;
  } catch (error) {
    console.error('Error getting device push token, trying expo token:', error);
    try {
      const expoTokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      return expoTokenData.data;
    } catch (expoError) {
      console.error('Error getting expo push token:', expoError);
      return null;
    }
  }
}

export default function PermissionScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const { data: userDetailsResponse } = useUserDetails();
  const user = userDetailsResponse?.data;

  const [enabled, setEnabled] = useState<Record<ReminderKey, boolean>>({
    push: false,
    email: true,
  });

  // Sync state with backend token value on load
  useEffect(() => {
    if (user) {
      setEnabled((prev) => ({
        ...prev,
        push: !!user.firebaseToken,
      }));
    }
  }, [user]);

  // Sync state with actual OS permissions on mount/change
  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted' && enabled.push) {
        setEnabled((prev) => ({ ...prev, push: false }));
      }
    };
    checkPermission();
  }, [enabled.push]);

  const saveTokenMutation = useMutation({
    mutationFn: saveFcmToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-details'] });
    },
  });

  const toggle = async (key: ReminderKey) => {
    if (key === 'email') {
      setEnabled((prev) => ({ ...prev, email: !prev.email }));
      return;
    }

    if (key === 'push') {
      const nextVal = !enabled.push;
      
      if (nextVal) {
        try {
          const token = await registerForPushNotificationsAsync();
          if (token && user?.userId) {
            await saveTokenMutation.mutateAsync({
              userId: user.userId,
              fcmToken: token,
              platform: Platform.OS.toUpperCase(),
            });
            setEnabled((prev) => ({ ...prev, push: true }));
            toast.success('Push notifications enabled successfully!');
          } else {
            setEnabled((prev) => ({ ...prev, push: false }));
            toast.error('Could not enable push notifications. Check permissions.');
          }
        } catch (err) {
          console.error(err);
          setEnabled((prev) => ({ ...prev, push: false }));
          toast.error('Unable to enable push notifications.');
        }
      } else {
        try {
          if (user?.userId) {
            await saveTokenMutation.mutateAsync({
              userId: user.userId,
              fcmToken: null,
              platform: Platform.OS.toUpperCase(),
            });
          }
          setEnabled((prev) => ({ ...prev, push: false }));
          toast.success('Push notifications disabled.');
        } catch (err) {
          console.error(err);
          toast.error('Failed to disable push notifications.');
        }
      }
    }
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
            Order related messages can’t be turned off as they are important for service
            experience
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
