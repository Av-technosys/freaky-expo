import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ChevronLeft, Search, Star, Frown } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { getEventTypes } from '@/api/event';
import ServiceSkeleton from '@/app/skeleton/ServiceSkeleton';

const STATIC_EVENT_IMAGES: Record<string, any> = {
  wedding: require('@/assets/images/home/image 1698.png'),
  birthday: require('@/assets/images/birthday.png'),
  engagement: require('@/assets/images/event1.png'),
  house: require('@/assets/images/home/image 1701.png'),
  baby: require('@/assets/images/eventType2.jpg'),
  festive: require('@/assets/images/eventType4.jpg'),
  anniversary: require('@/assets/images/eventType1.jpg'),
  corporate: require('@/assets/images/eventType3.jpg'),
};

const getEventLocalImage = (name: string) => {
  const norm = (name || '').toLowerCase();
  if (norm.includes('wedding')) return STATIC_EVENT_IMAGES.wedding;
  if (norm.includes('birthday')) return STATIC_EVENT_IMAGES.birthday;
  if (norm.includes('engagement')) return STATIC_EVENT_IMAGES.engagement;
  if (norm.includes('house') || norm.includes('party')) return STATIC_EVENT_IMAGES.house;
  if (norm.includes('baby')) return STATIC_EVENT_IMAGES.baby;
  if (norm.includes('festive') || norm.includes('celebration')) return STATIC_EVENT_IMAGES.festive;
  if (norm.includes('anniversary')) return STATIC_EVENT_IMAGES.anniversary;
  if (norm.includes('corporate')) return STATIC_EVENT_IMAGES.corporate;

  return STATIC_EVENT_IMAGES.wedding;
};

export default function EventTypeSelector() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const { data: eventTypesData, isLoading, isFetching } = useQuery({
    queryKey: ['event-types-list'],
    queryFn: getEventTypes,
    staleTime: 60_000,
  });

  const eventList = useMemo(() => {
    const rawList = eventTypesData?.data || eventTypesData;
    if (!Array.isArray(rawList) || rawList.length === 0) {
      return [
        { id: '1', title: 'Wedding Ceremony', imageSource: STATIC_EVENT_IMAGES.wedding },
        { id: '2', title: 'Birthday Celebration', imageSource: STATIC_EVENT_IMAGES.birthday },
        { id: '3', title: 'Engagement Party', imageSource: STATIC_EVENT_IMAGES.engagement },
        { id: '4', title: 'House Party', imageSource: STATIC_EVENT_IMAGES.house },
        { id: '5', title: 'Baby Shower', imageSource: STATIC_EVENT_IMAGES.baby },
        { id: '6', title: 'Festive Celebration', imageSource: STATIC_EVENT_IMAGES.festive },
        { id: '7', title: 'Anniversary Party', imageSource: STATIC_EVENT_IMAGES.anniversary },
        { id: '8', title: 'Corporate Event', imageSource: STATIC_EVENT_IMAGES.corporate },
      ];
    }

    return rawList.map((item: any, idx: number) => {
      const name = item.name || item.title || 'Event';
      return {
        id: String(item.id || item.eventTypeId || idx),
        title: name,
        imageSource: getEventLocalImage(name),
      };
    });
  }, [eventTypesData]);

  const filteredEvents = useMemo(() => {
    const value = query.trim().toLowerCase();
    return value ? eventList.filter((event) => event.title.toLowerCase().includes(value)) : eventList;
  }, [query, eventList]);

  const chooseEvent = (event: { id: string; title: string }) => {
    router.navigate({ pathname: '/EventServices', params: { eventTypeId: event.id, eventName: event.title } });
  };

  if (isLoading || isFetching) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          <Text style={{ fontSize: 21, fontWeight: '800', color: '#111111', marginBottom: 4 }}>Choose Your Event</Text>
          {Array.from({ length: 4 }).map((_, i) => (
            <ServiceSkeleton key={i} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 0) + 96 }]}>
        <View style={styles.header}>
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} style={styles.backButton} accessibilityLabel="Go back">
            <ChevronLeft size={26} color="#111111" strokeWidth={2.2} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>Choose Your Event</Text>
            <Text style={styles.headerDescription}>Select an event to discover{'\n'}recommended services</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Live Search Input */}
        <View style={styles.searchShell}>
          <Search size={21} color="#656b73" strokeWidth={1.8} />
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="Search Event (e.g. Wedding, Birthday, Party)"
            placeholderTextColor="#7e8187"
            style={styles.searchInput}
            className="border-0 bg-transparent shadow-none"
          />
        </View>

        {!query ? (
          <>
            <Text style={styles.sectionTitle}>Trending This Month</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRail}>
              {eventList.slice(0, 3).map((event) => (
                <Pressable key={event.id} onPress={() => chooseEvent(event)} style={styles.trendingCard}>
                  <Image source={event.imageSource} resizeMode="cover" style={styles.trendingImage} />
                  <View style={styles.trendingOverlay} />
                  <Text style={styles.trendingTitle}>{event.title}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>
          {query ? `Search Results (${filteredEvents.length})` : 'All Event Categories'}
        </Text>

        {filteredEvents.length === 0 ? (
          <View style={styles.noResults}>
            <Frown size={40} color="#94a3b8" />
            <Text style={styles.noResultsText}>No events found matching "{query}"</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredEvents.map((event) => (
              <Pressable key={event.id} onPress={() => chooseEvent(event)} style={styles.eventCardPressable}>
                <Card style={styles.eventCard} className="border-[#e7e7e7] bg-white shadow-sm shadow-black/10">
                  <Image source={event.imageSource} resizeMode="cover" style={styles.eventImage} />
                  <CardContent style={styles.eventCardContent}>
                    <Text numberOfLines={1} style={styles.eventTitle}>{event.title}</Text>
                    <View style={styles.ratingRow}>
                      <Star size={15} color="#f8bf16" fill="#f8bf16" strokeWidth={1.7} />
                      <Text style={styles.ratingText}>4.8 (1.2k bookings)</Text>
                    </View>
                  </CardContent>
                </Card>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingHorizontal: 16, paddingTop: 18 },
  header: { flexDirection: 'row', alignItems: 'center' },
  backButton: { width: 32, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerCopy: { flex: 1, alignItems: 'center' },
  headerSpacer: { width: 32 },
  headerTitle: { color: '#111111', fontSize: 21, lineHeight: 26, fontWeight: '800' },
  headerDescription: { marginTop: 4, color: '#727883', fontSize: 14, lineHeight: 18, textAlign: 'center' },
  searchShell: { marginTop: 18, height: 48, borderRadius: 10, borderWidth: 1, borderColor: '#e1e5eb', backgroundColor: '#f8fafc', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' },
  searchInput: { flex: 1, marginLeft: 8, color: '#111111', fontSize: 15 },
  sectionTitle: { marginTop: 22, color: '#111111', fontSize: 18, fontWeight: '800' },
  trendingRail: { marginTop: 12, gap: 12 },
  trendingCard: { width: 150, height: 170, borderRadius: 14, overflow: 'hidden', position: 'relative', backgroundColor: '#1e293b' },
  trendingImage: { width: '100%', height: '100%' },
  trendingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  trendingTitle: { position: 'absolute', bottom: 14, left: 12, right: 12, color: '#ffffff', fontSize: 15, fontWeight: '800' },
  grid: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  eventCardPressable: { width: '48%' },
  eventCard: { overflow: 'hidden', borderRadius: 12 },
  eventImage: { width: '100%', height: 115, backgroundColor: '#f1f5f9' },
  eventCardContent: { padding: 12 },
  eventTitle: { color: '#111111', fontSize: 15, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  ratingText: { marginLeft: 5, color: '#64748b', fontSize: 12, fontWeight: '500' },
  noResults: { marginTop: 40, alignItems: 'center', justifyContent: 'center', gap: 12 },
  noResultsText: { color: '#64748b', fontSize: 15, fontWeight: '600', textAlign: 'center' },
});
