import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ChevronLeft, Search, Star } from 'lucide-react-native';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

type EventOption = { id: string; title: string; image: ImageSourcePropType };

const EVENT_IMAGES = {
  birthday: require('@/assets/images/birthday.png'),
  wedding: require('@/assets/images/weddingBanner.png'),
  party: require('@/assets/images/event1.png'),
  eventOne: require('@/assets/images/eventType1.jpg'),
  eventTwo: require('@/assets/images/eventType2.jpg'),
  eventThree: require('@/assets/images/eventType3.jpg'),
  eventFour: require('@/assets/images/eventType4.jpg'),
} satisfies Record<string, ImageSourcePropType>;

const TRENDING_EVENTS: EventOption[] = [
  { id: 'birthday', title: 'Birthday', image: EVENT_IMAGES.birthday },
  { id: 'anniversary', title: 'Anniversary', image: EVENT_IMAGES.eventOne },
  { id: 'wedding', title: 'Wedding', image: EVENT_IMAGES.wedding },
];

const EVENTS: EventOption[] = [
  { id: 'wedding', title: 'Wedding', image: EVENT_IMAGES.wedding },
  { id: 'birthday', title: 'Birthday Party', image: EVENT_IMAGES.birthday },
  { id: 'engagement', title: 'Engagement', image: EVENT_IMAGES.party },
  { id: 'corporate', title: 'Corporate Event', image: EVENT_IMAGES.eventThree },
  { id: 'baby-shower', title: 'Baby Shower', image: EVENT_IMAGES.eventTwo },
  { id: 'graduation', title: 'Graduation Party', image: EVENT_IMAGES.eventFour },
  { id: 'house-party', title: 'House Party', image: EVENT_IMAGES.eventOne },
  { id: 'haldi-mehndi', title: 'Haldi/Mehndi Event', image: EVENT_IMAGES.party },
];

function EventCard({ event, onPress }: { event: EventOption; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.eventCardPressable}>
      <Card style={styles.eventCard} className="border-[#e7e7e7] bg-white shadow-sm shadow-black/10">
        <Image source={event.image} resizeMode="cover" style={styles.eventImage} />
        <CardContent style={styles.eventCardContent}>
          <Text numberOfLines={1} style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.ratingRow}>
            <Star size={15} color="#f8bf16" fill="#f8bf16" strokeWidth={1.7} />
            <Text style={styles.ratingText}>4.76 (2.8M)</Text>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}

export default function EventTypeSelector() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const filteredEvents = useMemo(() => {
    const value = query.trim().toLowerCase();
    return value ? EVENTS.filter((event) => event.title.toLowerCase().includes(value)) : EVENTS;
  }, [query]);

  const chooseEvent = (event: EventOption) => {
    router.navigate({ pathname: '/EventServices', params: { eventTypeId: event.id, eventName: event.title } });
  };

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

        <View style={styles.searchShell}>
          <Search size={21} color="#656b73" strokeWidth={1.8} />
          <Input value={query} onChangeText={setQuery} placeholder="Search Event" placeholderTextColor="#7e8187" style={styles.searchInput} className="border-0 bg-transparent shadow-none" />
        </View>

        {!query ? (
          <>
            <Text style={styles.sectionTitle}>Trending This Month</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRail}>
              {TRENDING_EVENTS.map((event) => (
                <Pressable key={event.id} onPress={() => chooseEvent(event)} style={styles.trendingCard}>
                  <Image source={event.image} resizeMode="cover" style={styles.trendingImage} />
                  <View style={styles.trendingOverlay} />
                  <Text style={styles.trendingTitle}>{event.title}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        ) : null}

        <Text style={styles.browseTitle}>{query ? 'Search Results' : 'Browse Event'}</Text>
        {filteredEvents.length ? (
          <View style={styles.grid}>
            {filteredEvents.map((event) => <EventCard key={event.id} event={event} onPress={() => chooseEvent(event)} />)}
          </View>
        ) : <Text style={styles.emptyText}>No events found for "{query}".</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingTop: 22, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  backButton: { width: 32, height: 36, alignItems: 'flex-start', justifyContent: 'center' },
  headerCopy: { flex: 1, alignItems: 'center' },
  headerSpacer: { width: 32, height: 36 },
  headerTitle: { color: '#111111', fontSize: 17, lineHeight: 21, fontWeight: '700' },
  headerDescription: { marginTop: 5, color: '#707070', fontSize: 14, lineHeight: 16, textAlign: 'center' },
  searchShell: { height: 45, marginTop: 26, flexDirection: 'row', alignItems: 'center', borderRadius: 8, backgroundColor: '#f6f6f6', paddingHorizontal: 16 },
  searchInput: { flex: 1, height: 45, marginLeft: 10, paddingHorizontal: 0, color: '#313131', fontSize: 14 },
  sectionTitle: { marginTop: 27, color: '#111111', fontSize: 17, lineHeight: 21, fontWeight: '700' },
  trendingRail: { gap: 10, paddingTop: 17, paddingRight: 8 },
  trendingCard: { width: 134, height: 110, overflow: 'hidden', borderRadius: 7, backgroundColor: '#ededed' },
  trendingImage: { width: '100%', height: '100%' },
  trendingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.17)' },
  trendingTitle: { position: 'absolute', bottom: 8, left: 8, right: 8, color: '#ffffff', fontSize: 13, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  browseTitle: { marginTop: 28, color: '#111111', fontSize: 17, lineHeight: 21, fontWeight: '700' },
  grid: { marginTop: 18, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 20 },
  eventCardPressable: { width: '48.5%' },
  eventCard: { overflow: 'hidden', borderRadius: 8 },
  eventImage: { width: '100%', height: 174 },
  eventCardContent: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 12 },
  eventTitle: { color: '#202124', fontSize: 15, lineHeight: 18, fontWeight: '700' },
  ratingRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 6, color: '#707070', fontSize: 13, lineHeight: 16 },
  emptyText: { marginTop: 26, color: '#777777', fontSize: 15, textAlign: 'center' },
});
