import { View, FlatList, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import SkeletonContent from 'react-native-skeleton-content';

import { Text } from '@/components/ui/text';
import SectionHeader from '../home/SectionHeader';
import ShowCaseCard from '../home/ShowcaseCard';
import { getFeaturedEvents } from '@/api/event';

const { width } = Dimensions.get('window');

export default function ShowCaseList() {
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      setLoading(true);

      const res = await getFeaturedEvents();

      if (res?.data && Array.isArray(res.data)) {
        setFeaturedEvents(res.data);
      } else {
        setFeaturedEvents([]);
      }
    } catch (error) {
      console.log('Failed to fetch featured events', error);
      setFeaturedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-8">
      {/* HEADER */}
      <SectionHeader
        left={
          <Text className="text-xl font-semibold text-foreground">
            Most Popular Now 🎈
          </Text>
        }
        right={
          <Feather name="chevron-right" size={20} color="#666" />
        }
      />

      {/* LOADING */}
      {loading ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={Array.from({ length: 4 })}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => (
            <SkeletonContent
              isLoading
              containerStyle={{ width: width * 0.75, marginRight: 12 }}
              layout={[
                // IMAGE / CARD
                {
                  key: 'image',
                  width: '100%',
                  height: 180,
                  borderRadius: 16,
                },
                // TITLE
                {
                  key: 'title',
                  marginTop: 10,
                  width: '70%',
                  height: 16,
                  borderRadius: 6,
                },
                // SUBTITLE
                {
                  key: 'subtitle',
                  marginTop: 6,
                  width: '50%',
                  height: 12,
                  borderRadius: 6,
                },
              ]}
            />
          )}
        />
      ) : !featuredEvents || featuredEvents.length === 0 ? (
        // NO DATA
        <View className="px-4 mt-4">
          <Text className="text-center text-muted-foreground">
            No featured events available
          </Text>
        </View>
      ) : (
        // DATA
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={featuredEvents}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => {
            // strict check (no fake fallback)
            if (!item?.image) return null;

            return (
              <View className="mr-3">
                <ShowCaseCard item={item} />
              </View>
            );
          }}
        />
      )}
    </View>
  );
}