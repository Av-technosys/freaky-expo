import { View, Image, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

import { Text } from '@/components/ui/text';
import { getEvents } from '@/api/event'; // 👈 your API
import { getImageUrl } from '@/utils/image';
import { AspectRatio } from '../ui/aspect-ratio';

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
    <View className="ml-2 mt-4">
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
              <AspectRatio
                ratio={44 / 36} // or 5/4 for cleaner
                className="w-44 overflow-hidden rounded-3xl">
                <Image
                  source={{ uri: getImageUrl(item.mediaURL) }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </AspectRatio>

              {/* NAME + ICON */}
              <View className="mt-2 flex-row items-center justify-center gap-2">
                <Feather name={icon as any} size={16} color="#444" />
                <Text className="text-sm capitalize">{name}</Text>
              </View>

              {/* PRICE */}
              {price ? (
                <View className="mt-1 flex-row items-center justify-center gap-1">
                  <Text className="text-xs text-muted-foreground">Starting</Text>
                  {/* <Text className="text-sm font-semibold text-orange-600">
                    ₹{price}
                  </Text> */}
                </View>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}
