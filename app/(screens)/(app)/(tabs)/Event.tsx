import { View, Pressable, Image } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { Text } from '@/components/ui/text';
import { AppButton } from '@/components/common/AppButton';

type Option = {
  eventTypeId: string;
  title: string;
  image: any;
};

const OPTIONS: Option[] = [
  {
    eventTypeId: '1',
    title: 'Professional',
    image: require('@/assets/images/eventType1.jpg'),
  },
  {
    eventTypeId: '2',
    title: 'Party',
    image: require('@/assets/images/eventType2.jpg'),
  },
  {
    eventTypeId: '3',
    title: 'Corporate',
    image: require('@/assets/images/eventType3.jpg'),
  },
  {
    eventTypeId: '4',
    title: 'Casual',
    image: require('@/assets/images/eventType4.jpg'),
  },
];

export default function EventTypeSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Screen scroll>
      <ScreenHeader title="Events" showBack={false} rightType="menu" />

      {/* GRID */}
      <View className="flex-row flex-wrap justify-between px-3">
        {OPTIONS.map((item) => {
          const isSelected = selected === item.eventTypeId;

          return (
            <Pressable
              key={item.eventTypeId}
              onPress={() => setSelected(item.eventTypeId)}
              className="w-[44%] mt-8 mb-4 rounded-2xl"
            >
              <View className="relative rounded-2xl overflow-hidden">
                <Image
                  source={item.image}
                  className="w-full h-64"
                  resizeMode="cover"
                />

                <View className="absolute inset-0 bg-black/20" />

                <View className="absolute top-3 left-3 w-5 h-5 rounded-full border-2 border-white items-center justify-center">
                  {isSelected && (
                    <View className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </View>

                <Text className="absolute bottom-3 left-3 text-white text-lg font-semibold">
                  {item.title}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* BUTTON */}
      <View className="px-4 mt-6">
        <AppButton
          disabled={!selected}
          onPress={() => {
            if (!selected) return;

            router.push({
              pathname: '/eventDetails',
              params: { eventTypeId: selected },
            });
          }}
        >
          <Text
            className={`font-semibold ${
              selected ? 'text-white' : 'text-gray-400'
            }`}
          >
            Continue
          </Text>
        </AppButton>
      </View>
    </Screen>
  );
}