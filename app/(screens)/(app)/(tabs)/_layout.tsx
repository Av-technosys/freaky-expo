/* eslint-disable react/no-unstable-nested-components */
import { Tabs } from 'expo-router';
import  MyTabBar from '@/components/common/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="Cart" options={{ title: 'Cart' }} />
      <Tabs.Screen name="Event" options={{ title: 'Event' }} />
      <Tabs.Screen name="Manage" options={{ title: 'Manage' }} />
      <Tabs.Screen name="Profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="Categories" options={{ title: 'Categories' }} />
    </Tabs>
  );
}
