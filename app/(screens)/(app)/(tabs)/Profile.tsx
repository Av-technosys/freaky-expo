// app/(tabs)/profile.tsx

import { useEffect, useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import NotFound from '@/components/common/NotFound';
import { ProfileInfoCard } from '@/components/common/card/ProfileInfoCard';
import { AppButton } from '@/components/common/AppButton';

// UI
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';

import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userDetails } from '@/api/user';

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await userDetails();
        setUser(res?.data);
      } catch (e) {
        console.log('Failed to load user', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'idToken']);

      Toast.show({
        type: 'success',
        text1: 'Logged out successfully',
      });

      router.replace('/login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout failed',
      });
    }
  };

  const sections = [
    {
      title: 'Manage',
      items: [
        { icon: 'star', title: 'Your Reviews', route: '/reviews' },
        { icon: 'list', title: 'Orders', route: '/OrdersScreen' },
        { icon: 'bookmark', title: 'Manage Booking', route: '/bookings' },
      ],
    },
    {
      title: 'Support',
      items: [{ icon: 'help-circle', title: 'FAQ', route: '/FAQ' }],
    },
    {
      title: 'More',
      items: [{ icon: 'settings', title: 'Permissions', route: '/PermissionScreen' }],
    },
  ];

  const renderSection = (section: any, sectionIndex: number) => {
    const isSingleItem = section.items.length === 1;

    return (
      <View key={sectionIndex} className="gap-4">
        {/* Section Title */}
        <Text className="px-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
          {section.title}
        </Text>

        {/* Section Items */}
        <Card
          className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${
            isSingleItem ? 'w-full' : ''
          }`}>
          <CardContent className="p-0">
            {section.items.map((item: any, idx: number) => (
              <Pressable
                key={idx}
                onPress={() => router.push(item.route as any)}
                className={`flex-row items-center justify-between px-3 ${
                  isSingleItem ? 'py-0' : 'py-3'
                } ${idx !== section.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <View className="flex-row items-center gap-2">
                  {/* Icon with dynamic color */}
                  <View className="rounded-xl p-1">
                    <Feather name={item.icon as any} size={18} color={item.color} />
                  </View>

                  {/* Text */}
                  <Text className="text-md text-gray-800">{item.title}</Text>
                </View>

                <Feather name="chevron-right" size={18} color="#D1D5DB" />
              </Pressable>
            ))}
          </CardContent>
        </Card>
      </View>
    );
  };

  return (
    <Screen scroll>
      <ScreenHeader title="Profile" rightType="notification" />

      {/* Loading State */}
      {loading && (
        <View className=" px-4 pt-8">
          <View className="animate-pulse">
            <View className="h-32 w-full rounded-2xl bg-gray-200" />
            <View className="mt-6 h-20 w-full rounded-xl bg-gray-200" />
            <View className="mt-4 h-20 w-full rounded-xl bg-gray-200" />
            <View className="mt-4 h-20 w-full rounded-xl bg-gray-200" />
          </View>
        </View>
      )}

      {/* Empty State */}
      {!loading && !user && (
        <NotFound title="User not found" description="Unable to load profile." />
      )}

      {/* Data State */}
      {!loading && user && (
        <View className="mt-4 px-2">
          {/* Profile Card */}
          <ProfileInfoCard
            name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
            phone={user?.number}
            email={user?.email}
            profileImage={user?.profileImage}
            onEdit={() => router.push('/ProfileEditScreen')}
          />

          {/* Sections */}
          <View className="mt-4 gap-3">
            {sections.map((section, index) => renderSection(section, index))}
          </View>

          {/* Logout Button */}
          <View className="mt-8 pb-8">
            <AppButton
              variant="outline"
              size="lg"
              onPress={handleLogout}
              className="border-red-200 bg-white">
              <View className="flex-row items-center gap-2">
                <Feather name="log-out" size={18} color="#EF4444" />
                <Text className="font-semibold text-red-500">Log Out</Text>
              </View>
            </AppButton>
          </View>
        </View>
      )}
    </Screen>
  );
}
