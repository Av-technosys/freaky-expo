import { useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Phone,
  ReceiptText,
  Search,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';

type BookingFilter = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

type FilterTab = {
  id: BookingFilter;
  label: string;
  count: number;
};

type BookingImage = {
  source: ImageSourcePropType;
  title: string;
};

const FILTERS: FilterTab[] = [
  { id: 'upcoming', label: 'Upcoming', count: 3 },
  { id: 'ongoing', label: 'Ongoing', count: 1 },
  { id: 'completed', label: 'Completed', count: 15 },
  { id: 'cancelled', label: 'Cancelled', count: 2 },
];

const IMAGES = {
  wedding: require('@/assets/images/home/image 1516.png'),
  photography: require('@/assets/images/home/image 1532.png'),
  decoration: require('@/assets/images/home/image 1534.png'),
};

function BookingStatus() {
  return (
    <View style={styles.statusPill}>
      <Text style={styles.statusText}>Confirmed</Text>
    </View>
  );
}

function BookingFilterCard({ filter, active, onPress }: { filter: FilterTab; active: boolean; onPress: () => void }) {
  const color = active ? '#ff593e' : '#747681';

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.filterCard, active && styles.filterCardActive]}
    >
      {filter.id === 'upcoming' ? <CalendarDays size={22} color={color} strokeWidth={2} /> : null}
      {filter.id === 'ongoing' ? <Clock3 size={22} color={color} strokeWidth={2} /> : null}
      {filter.id === 'completed' ? <CheckCircle2 size={22} color={color} strokeWidth={2} /> : null}
      {filter.id === 'cancelled' ? <ChevronRight size={22} color={color} strokeWidth={2} /> : null}
      <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{filter.label}</Text>
      <Text style={[styles.filterCount, active && styles.filterCountActive]}>{filter.count}</Text>
    </Pressable>
  );
}

function EventBookingCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.eventCard}>
      <View style={styles.eventCardTop}>
        <Image source={IMAGES.wedding} style={styles.eventImage} resizeMode="cover" />
        <View style={styles.eventDetails}>
          <View style={styles.eventHeading}>
            <Text style={styles.eventTitle}>Wedding{`\n`}Package</Text>
            <BookingStatus />
          </View>
          <View style={styles.detailLine}>
            <CalendarDays size={15} color="#566174" strokeWidth={1.9} />
            <Text style={styles.detailText}>23 July 2026</Text>
            <View style={styles.dot} />
            <Clock3 size={15} color="#566174" strokeWidth={1.9} />
            <Text style={styles.detailText}>10:00 AM</Text>
          </View>
          <View style={[styles.detailLine, styles.locationLine]}>
            <MapPin size={15} color="#566174" strokeWidth={1.9} />
            <Text style={styles.detailText}>Jaipur, Rajasthan</Text>
          </View>
          <Text style={styles.eventAmount}>₹24,999</Text>
        </View>
      </View>
      <View style={styles.eventActions}>
        <Pressable accessibilityRole="button" style={styles.outlineAction}>
          <Phone size={18} color="#273247" strokeWidth={1.8} />
          <Text style={styles.outlineActionText}>Call</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={styles.outlineAction}>
          <ReceiptText size={18} color="#273247" strokeWidth={1.8} />
          <Text style={styles.outlineActionText}>Invoice</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

function ServiceBookingCard({ image, title, date, amount, onPress }: { image: BookingImage; title: string; date: string; amount: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.serviceCard}>
      <Image source={image.source} style={styles.serviceImage} resizeMode="cover" />
      <View style={styles.serviceDetails}>
        <View style={styles.serviceHeading}>
          <Text style={styles.serviceTitle} numberOfLines={2}>{title}</Text>
          <View style={styles.serviceTag}>
            <Text style={styles.serviceTagText}>Service</Text>
          </View>
        </View>
        <View style={styles.detailLine}>
          <CalendarDays size={15} color="#7a808b" strokeWidth={1.8} />
          <Text style={styles.detailText}>{date} · 6:00 PM</Text>
        </View>
        <View style={[styles.detailLine, styles.locationLine]}>
          <MapPin size={15} color="#7a808b" strokeWidth={1.8} />
          <Text style={styles.detailText}>Jaipur, Rajasthan</Text>
        </View>
        <BookingStatus />
        <View style={styles.serviceDivider} />
        <View style={styles.serviceTotalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <View style={styles.totalValueWrap}>
            <Text style={styles.serviceAmount}>{amount}</Text>
            <ChevronRight size={20} color="#8e6f65" strokeWidth={2} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function ManageScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<BookingFilter>('upcoming');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" backgroundColor="#ffffff" hidden={false} translucent={false} />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
          style={styles.headerButton}
        >
          <ArrowLeft size={23} color="#111827" strokeWidth={2.25} />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Booking</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Search bookings" hitSlop={12} style={styles.headerButtonRight}>
          <Search size={23} color="#111827" strokeWidth={1.8} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 94 }]}
      >
        <Text style={styles.activeSummary}>
          You have <Text style={styles.activeSummaryAccent}>3 Active Bookings</Text>
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList} style={styles.filterScroll}>
          {FILTERS.map((filter) => (
            <BookingFilterCard
              key={filter.id}
              filter={filter}
              active={filter.id === activeFilter}
              onPress={() => setActiveFilter(filter.id)}
            />
          ))}
        </ScrollView>

        {activeFilter === 'upcoming' ? (
          <View style={styles.bookingList}>
            <EventBookingCard
              onPress={() => router.push({ pathname: '/OrderDetailsScreen', params: { bookingId: 'WB123456' } })}
            />
            <ServiceBookingCard
              image={{ source: IMAGES.photography, title: 'Pro Photography' }}
              title="Pro Photography"
              date="10 Jul 2026"
              amount="₹17,999"
              onPress={() => router.push({ pathname: '/ManageServiceDetails', params: { bookingId: 'SRV-PR-17999' } })}
            />
            <ServiceBookingCard
              image={{ source: IMAGES.decoration, title: 'Birthday Decoration' }}
              title="Birthday Decoration"
              date="10 Jul 2026"
              amount="₹18,999"
              onPress={() => router.push({ pathname: '/OrderDetailsScreen', params: { bookingId: 'SRV-BD-18999' } })}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No {activeFilter} bookings</Text>
            <Text style={styles.emptyCopy}>Your {activeFilter} bookings will appear here.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  header: { height: 62, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#cbd0d6' },
  headerButton: { width: 45, height: 52, alignItems: 'center', justifyContent: 'center' },
  headerButtonRight: { width: 45, height: 52, marginLeft: 'auto', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#121820', fontSize: 18, lineHeight: 23, fontWeight: '800' },
  content: { paddingTop: 31, paddingHorizontal: 16 },
  activeSummary: { color: '#545967', fontSize: 17, lineHeight: 22, fontWeight: '500' },
  activeSummaryAccent: { color: '#ff593e', fontWeight: '800' },
  filterScroll: { marginTop: 18, marginHorizontal: -16 },
  filterList: { paddingHorizontal: 16, gap: 13 },
  filterCard: { width: 97, height: 97, alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderColor: '#d9d3e4', borderRadius: 8, backgroundColor: '#fcfbfd' },
  filterCardActive: { borderColor: '#ff593e', backgroundColor: '#fffdfd' },
  filterLabel: { color: '#747681', fontSize: 15, lineHeight: 19, fontWeight: '600' },
  filterLabelActive: { color: '#ff593e' },
  filterCount: { color: '#525766', fontSize: 17, lineHeight: 21, fontWeight: '700' },
  filterCountActive: { color: '#ff593e' },
  bookingList: { gap: 12, marginTop: 17 },
  eventCard: { padding: 15, borderWidth: 1, borderColor: '#e4e7eb', borderRadius: 8, backgroundColor: '#ffffff', shadowColor: '#162130', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.055, shadowRadius: 5, elevation: 2 },
  eventCardTop: { flexDirection: 'row' },
  eventImage: { width: 97, height: 97, borderRadius: 8 },
  eventDetails: { flex: 1, minWidth: 0, marginLeft: 16 },
  eventHeading: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 7 },
  eventTitle: { flex: 1, color: '#202a3b', fontSize: 18, lineHeight: 21, fontWeight: '800' },
  statusPill: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12, backgroundColor: '#e4f4e8' },
  statusText: { color: '#27863e', fontSize: 13, lineHeight: 16, fontWeight: '700' },
  detailLine: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 7 },
  locationLine: { marginTop: 8 },
  detailText: { color: '#5f6674', fontSize: 14, lineHeight: 18, fontWeight: '500' },
  dot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 2, backgroundColor: '#30394a' },
  eventAmount: { color: '#ff593e', fontSize: 18, lineHeight: 22, fontWeight: '800', marginTop: 12 },
  eventActions: { flexDirection: 'row', gap: 9, marginTop: 16 },
  outlineAction: { height: 46, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderWidth: 1, borderColor: '#cec6dc', borderRadius: 7, backgroundColor: '#ffffff' },
  outlineActionText: { color: '#2a3040', fontSize: 15, lineHeight: 19, fontWeight: '600' },
  serviceCard: { minHeight: 178, flexDirection: 'row', padding: 12, borderWidth: 1, borderColor: '#e4e7eb', borderRadius: 8, backgroundColor: '#ffffff', shadowColor: '#162130', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.055, shadowRadius: 5, elevation: 2 },
  serviceImage: { width: 112, height: 112, borderRadius: 9 },
  serviceDetails: { flex: 1, minWidth: 0, marginLeft: 16 },
  serviceHeading: { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  serviceTitle: { flex: 1, color: '#34242a', fontSize: 17, lineHeight: 21, fontWeight: '800' },
  serviceTag: { marginTop: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: '#fff0eb' },
  serviceTagText: { color: '#c64925', fontSize: 11, lineHeight: 14, fontWeight: '700' },
  serviceDivider: { height: 1, marginTop: 12, backgroundColor: '#eef0f2' },
  serviceTotalRow: { height: 36, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  totalLabel: { color: '#8a6a62', fontSize: 14, lineHeight: 18, fontWeight: '600' },
  totalValueWrap: { flexDirection: 'row', alignItems: 'center', marginRight: -4 },
  serviceAmount: { color: '#ff593e', fontSize: 17, lineHeight: 22, fontWeight: '800' },
  emptyState: { alignItems: 'center', paddingVertical: 72 },
  emptyTitle: { color: '#2e3644', fontSize: 18, lineHeight: 23, fontWeight: '800' },
  emptyCopy: { color: '#707887', fontSize: 15, lineHeight: 20, textAlign: 'center', marginTop: 6 },
});
