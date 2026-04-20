import { View, FlatList, Pressable, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
// import SkeletonContent from 'react-native-skeleton-content';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getEventTypes } from '@/api/event';
import CategoriesSkeleton from '@/app/skeleton/home/Categories';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 32) / 4;

export default function HomeCategoriesSection() {
  const navigation = useNavigation<any>();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      setLoading(true);

      const res = await getEventTypes();

      if (res?.data && Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.log('Failed to fetch event types', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADING
if (loading) {
  return (
    <CategoriesSkeleton/>
  );
}

  // ✅ NO DATA
  if (!events || events.length === 0) {
    return (
      <View className="mt-6 px-4">
        <Text className="text-center text-muted-foreground">
          No categories available
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-5 -mx-2">
      <FlatList
        data={events}
        numColumns={4}
        keyExtractor={(item) => item.id?.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const iconName = item?.iconName || 'calendar';

          return (
            <Pressable
              onPress={() =>
                navigation.getParent()?.navigate('FlowStack', {
                  screen: 'CategoryProducts',
                  params: {
                    eventTypeId: item.id,
                    eventName: item.name,
                  },
                })
              }
              className="mb-6 w-[25%] px-2 items-center"
            >
              {/* CARD STYLE ICON BOX */}
              <Card className="w-full aspect-square rounded-3xl items-center justify-center bg-orange-50 shadow-sm">
                <Feather name={iconName as any} size={22} color="#ff6b35" />
              </Card>

              {/* LABEL */}
              <Text
                numberOfLines={2}
                className="mt-2 text-xs text-center text-foreground"
              >
                {item?.name || 'Unnamed'}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}