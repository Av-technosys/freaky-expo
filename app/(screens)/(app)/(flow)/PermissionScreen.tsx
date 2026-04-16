import { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import Feather from '@expo/vector-icons/Feather';

import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';

import { PermissionDialog } from '@/components/PermissionDialog';

export default function PermissionScreen() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [status, setStatus] = useState<any>({
    location: null,
    contact: null,
    message: null,
  });

  // 🔥 PERMISSION LIST
const permissions = [
  {
    key: 'location',
    title: 'Location Permission',
    description:
      'We use your location to show nearby services, improve accuracy, and personalize results.',
    icon: 'map-pin',
  },
  {
    key: 'message',
    title: 'Notification Permission',
    description:
      'Get real-time updates, booking alerts, and important notifications from the app.',
    icon: 'bell',
  },
  {
    key: 'contact',
    title: 'Contact Permission',
    description:
      'We access contacts to help you connect and invite friends easily.',
    icon: 'users',
  },
];

  // 🔥 SAFE NOTIFICATION PERMISSION (EXPO GO FRIENDLY)
  const requestNotificationPermission = async () => {
    try {
      const Notifications = await import('expo-notifications');

      const { status } =
        await Notifications.requestPermissionsAsync();

      return status;
    } catch (e) {
      console.log('Notifications not supported in Expo Go');
      return 'unavailable';
    }
  };

  // 🔥 REQUEST PERMISSION SWITCH
  const requestPermission = async (key: string) => {
    switch (key) {
      case 'location': {
        const { status } =
          await Location.requestForegroundPermissionsAsync();
        return status;
      }

      case 'contact': {
        const { status } =
          await Contacts.requestPermissionsAsync();
        return status;
      }

      case 'message': {
        return await requestNotificationPermission();
      }

      default:
        return 'undetermined';
    }
  };

  // 🔥 CHECK STATUS ON LOAD
  const checkStatus = async () => {
    const location = await Location.getForegroundPermissionsAsync();
    const contact = await Contacts.getPermissionsAsync();

    let messageStatus = 'unavailable';

    try {
      const Notifications = await import('expo-notifications');
      const res = await Notifications.getPermissionsAsync();
      messageStatus = res.status;
    } catch (e) {
      messageStatus = 'unavailable';
    }

    setStatus({
      location: location.status,
      contact: contact.status,
      message: messageStatus,
    });
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <>
    <Screen scroll>
      <ScreenHeader title="Permission" showBack />

      <View className=" mt-10">

        <Card className="rounded-2xl border border-gray-200">
          <CardContent className="p-0">

            {permissions.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  setSelected(item);
                  setOpen(true);
                }}
                className="flex-row items-center justify-between px-4 py-4"
              >
                <View className="flex-row items-center gap-3">

                  <View className="rounded-xl bg-orange-100 p-2">
                    <Feather
                      name={item.icon as any}
                      size={16}
                      color="#F97316"
                    />
                  </View>

                  <View>
                    <Text className="font-medium text-gray-700">
                      {item.title}
                    </Text>

                    <Text className="text-xs text-gray-400">
                      {status[item.key] === 'granted'
                        ? 'Allowed'
                        : status[item.key] === 'unavailable'
                        ? 'Not supported in Expo Go'
                        : 'Tap to allow'}
                    </Text>
                  </View>

                </View>

                <Feather name="chevron-right" size={18} color="#9CA3AF" />
              </Pressable>
            ))}

          </CardContent>
        </Card>
      </View>
   </Screen>
      {/* 🔥 DIALOG */}
      {selected && (
        <PermissionDialog
          visible={open}
          title={selected.title}
          description={selected.description}
          isGranted={status[selected.key] === 'granted'}
          onClose={() => setOpen(false)}

          onAllow={async () => {
            const result = await requestPermission(selected.key);

            setStatus((prev: any) => ({
              ...prev,
              [selected.key]: result,
            }));

            setOpen(false);
          }}
        />
      )}
 </>
  );
}