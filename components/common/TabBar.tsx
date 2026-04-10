/* eslint-disable react-native/no-inline-styles */
import { Text, Pressable, View, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS: Record<string, string> = {
  home: 'home',
  categories: 'grid',
  event: 'plus-circle',
  cart: 'shopping-cart',
  profile: 'user',
};

export default function MyTabBar({ state, navigation }: BottomTabBarProps) {
  const inset = useSafeAreaInsets();

  return (
    <View
      style={{ paddingBottom: Math.max(inset.bottom, 0) }}
      className="absolute left-0 right-0 bottom-0"
    >
      <View className="rounded-full">
        <LinearGradient
          colors={['#FFD451', '#FFA588']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="flex-row h-20 items-center p-2"
          style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
           const routeName = route.name.split('/').pop() as keyof typeof ICONS;
          const iconName = ICONS[routeName];

            // animations
            const translateY = useRef(new Animated.Value(0)).current;
            const scale = useRef(new Animated.Value(1)).current;

            useEffect(() => {
              Animated.parallel([
                Animated.spring(translateY, {
                  toValue: isFocused ? -12 : 0,
                  useNativeDriver: true,
                }),
                Animated.spring(scale, {
                  toValue: isFocused ? 1.3 : 1,
                  useNativeDriver: true,
                }),
              ]).start();
            }, [isFocused]);

            return (
              <Pressable
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                className="flex-1 items-center justify-center"
              >
                <Animated.View
                  style={{
                    transform: [{ translateY }, { scale }],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isFocused ? (
                    <View className="h-12 w-12 rounded-full bg-white items-center justify-center shadow">
                      <Feather name={iconName as any} size={18} color="orange" />
                    </View>
                  ) : (
                    <Feather name={iconName as any} size={18} />
                  )}
                </Animated.View>

                {!isFocused && (
                  <Text className="text-sm mt-1 font-semibold capitalize">
                    {route.name}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </LinearGradient>
      </View>
    </View>
  );
}