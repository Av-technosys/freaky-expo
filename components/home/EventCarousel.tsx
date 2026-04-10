import { View, Image, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

import { Text } from '@/components/ui/text';
import { getEvents } from '@/api/event'; // 👈 your API

export default function EventCarousel() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await getEvents();

      if (res?.data && Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.log('Event fetch error', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADING (simple for now)
  if (loading) {
    return null;
  }

  // ✅ NO DATA (your rule)
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <View className="mt-4 ml-2">
      <FlatList
        horizontal
        data={events}
        keyExtractor={(item) => item.id?.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const imageUrl = item?.image; // API field adjust
          const name = item?.name || 'Unnamed';
          const price = item?.price;
          const icon = item?.icon || 'calendar';

          // ✅ if no image → skip item (strict clean UI)
          if (!imageUrl) return null;

          return (
            <View className="mr-4 w-44">

              {/* IMAGE */}
              <Image
                source={{ uri: imageUrl }}
                className="w-44 h-36 rounded-3xl"
                resizeMode="cover"
              />

              {/* NAME + ICON */}
              <View className="mt-2 flex-row gap-2 items-center justify-center">
                <Feather name={icon as any} size={16} color="#444" />
                <Text className="text-sm capitalize">
                  {name}
                </Text>
              </View>

              {/* PRICE */}
              {price ? (
                <View className="mt-1 flex-row gap-1 items-center justify-center">
                  <Text className="text-xs text-muted-foreground">
                    Starting
                  </Text>
                  <Text className="text-sm font-semibold text-orange-600">
                    ₹{price}
                  </Text>
                </View>
              ) : null}

            </View>
          );
        }}
      />
    </View>
  );
}