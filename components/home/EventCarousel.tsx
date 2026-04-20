import { View, Image, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';

const eventData = [
  {
    id: 1,
    price: 2934,
    image: require('@/assets/images/event1.png'),
    name: 'videography',
    icon: 'video',
  },
  {
    id: 2,
    price: 2934,
    image: require('@/assets/images/event2.png'),
    name: 'Photography',
    icon: 'camera',
  },
  {
    id: 3,
    price: 2934,
    image: require('@/assets/images/event1.png'),
    name: 'Catering',
    icon: 'coffee',
  },
  {
    id: 4,
    price: 2934,
    image: require('@/assets/images/event2.png'),
    name: 'Decoration',
    icon: 'star',
  },
];

export default function EventCarousel() {
  return (
    <View className="mt-2  z-30">
      <FlatList
        horizontal
        data={eventData}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="mr-4">
            {/* IMAGE */}
            <Image
              source={item.image}
              className="w-44 h-36 rounded-3xl"
              resizeMode="cover"
            />

            {/* NAME + ICON */}
            <View className="mt-2 flex-row gap-2 items-center justify-center">
              <Feather name={item.icon as any} size={18} color="#000" />
              <Text className="text-[14px] capitalize">{item.name}</Text>
            </View>

            {/* PRICE */}
            <View className="mt-2 flex-row gap-2 items-baseline justify-center">
              <Text className="text-sm text-black">Starting</Text>
              <Text className="text-[14px] font-semibold text-orange-600">
                ₹{item.price}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}