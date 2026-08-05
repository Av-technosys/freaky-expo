import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, SlidersHorizontal, SquarePlus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

const TAB_BAR_HEIGHT = 69;
const ACTIVE_COLOR = '#ff553a';
const DEFAULT_COLOR = '#151515';

type TabItemProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  icon: 'home' | 'event' | 'manage';
};

function TabItem({ label, active, onPress, icon }: TabItemProps) {
  const color = active ? ACTIVE_COLOR : DEFAULT_COLOR;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.tab}
    >
      {icon === 'home' ? <Home size={22} color={color} fill={active ? color : 'none'} strokeWidth={2.35} /> : null}
      {icon === 'event' ? <SquarePlus size={21} color={color} strokeWidth={2} /> : null}
      {icon === 'manage' ? <SlidersHorizontal size={22} color={color} strokeWidth={2} /> : null}
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

export default function MyTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const focusedRoute = state.routes[state.index]?.name.toLowerCase();
  const isHome = focusedRoute === 'home';
  const isEvent = focusedRoute === 'event';
  const isManage = focusedRoute === 'profile';

  const navigateTo = (routeName: string) => {
    const route = state.routes.find((item) => item.name.toLowerCase() === routeName.toLowerCase());
    if (route) navigation.navigate(route.name);
  };

  return (
    <View style={[styles.shell, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        <TabItem label="Home" icon="home" active={isHome} onPress={() => navigateTo('home')} />
        <TabItem label="Event" icon="event" active={isEvent} onPress={() => navigateTo('Event')} />
        <TabItem label="Manage" icon="manage" active={isManage} onPress={() => navigateTo('Profile')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  bar: {
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#d2d2d2',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 15,
    fontWeight: '600',
  },
});
