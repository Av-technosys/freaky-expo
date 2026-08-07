import { useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
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
  PackageOpen,
  Search,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useGroupedBookings, type BookingFilterGroup, type BookingItem } from '@/api/booking';
import { getMediaUrl } from '@/utils/image';

// Fallback images for booking cards when vendor logo is unavailable
const FALLBACK_IMAGES: ImageSourcePropType[] = [
  require('@/assets/images/home/image 1516.png'),
  require('@/assets/images/home/image 1532.png'),
  require('@/assets/images/home/image 1534.png'),
];

// ─── Config ───────────────────────────────────────────────────────────────────

type FilterTabConfig = { id: BookingFilterGroup; label: string };

const FILTER_TABS: FilterTabConfig[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusInfo = (status: string): { label: string; color: string; bg: string } => {
  switch (status) {
    case 'CONFIRMED':   return { label: 'Confirmed',    color: '#27863e', bg: '#e4f4e8' };
    case 'HOLD':        return { label: 'On Hold',      color: '#b45309', bg: '#fef3c7' };
    case 'IN_PROGRESS': return { label: 'In Progress',  color: '#1d4ed8', bg: '#dbeafe' };
    case 'COMPLETED':   return { label: 'Completed',    color: '#27863e', bg: '#e4f4e8' };
    case 'CANCELLED':   return { label: 'Cancelled',    color: '#dc2626', bg: '#fee2e2' };
    default:            return { label: status,          color: '#27863e', bg: '#e4f4e8' };
  }
};

const formatDate = (iso: string | null): string => {
  if (!iso) return 'Date TBD';
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return 'Date TBD';
  }
};

const formatAmount = (amount: number | null): string => {
  if (!amount) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function BookingStatusBadge({ status }: { status: string }) {
  const { label, color, bg } = statusInfo(status);
  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <Text style={[styles.statusText, { color }]}>{label}</Text>
    </View>
  );
}

function BookingCard({ booking, index, onPress }: { booking: BookingItem; index: number; onPress: () => void }) {
  const logoUri = getMediaUrl(booking.vendorLogo);
  const imageSource: ImageSourcePropType = logoUri
    ? { uri: logoUri }
    : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  const title = booking.contactName || `Booking #${booking.bookingId}`;
  const dateLabel = formatDate(booking.startTime);
  const amountLabel = formatAmount(booking.totalAmount);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.serviceCard}>
      <Image source={imageSource} style={styles.serviceImage} resizeMode="cover" />
      <View style={styles.serviceDetails}>
        <View style={styles.serviceHeading}>
          <Text style={styles.serviceTitle} numberOfLines={2}>{title}</Text>
          <View style={styles.serviceTag}>
            <Text style={styles.serviceTagText}>Booking</Text>
          </View>
        </View>

        <View style={styles.detailLine}>
          <CalendarDays size={15} color="#7a808b" strokeWidth={1.8} />
          <Text style={styles.detailText}>{dateLabel}</Text>
        </View>

        {booking.vendorName ? (
          <View style={[styles.detailLine, styles.locationLine]}>
            <MapPin size={15} color="#7a808b" strokeWidth={1.8} />
            <Text style={styles.detailText} numberOfLines={1}>{booking.vendorName}</Text>
          </View>
        ) : null}

        <BookingStatusBadge status={booking.bookingStatus} />

        <View style={styles.serviceDivider} />
        <View style={styles.serviceTotalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <View style={styles.totalValueWrap}>
            <Text style={styles.serviceAmount}>{amountLabel}</Text>
            <ChevronRight size={20} color="#8e6f65" strokeWidth={2} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function EmptyState({ filter }: { filter: BookingFilterGroup }) {
  const messages: Record<BookingFilterGroup, { title: string; copy: string }> = {
    upcoming:  { title: 'No upcoming bookings', copy: 'Your confirmed bookings will appear here.' },
    ongoing:   { title: 'No ongoing bookings',  copy: 'Your active in-progress bookings will appear here.' },
    completed: { title: 'No completed bookings', copy: 'Bookings you\'ve finished will appear here.' },
    cancelled: { title: 'No cancelled bookings', copy: 'Cancelled bookings will appear here.' },
  };
  const { title, copy } = messages[filter];

  return (
    <View style={styles.emptyState}>
      <PackageOpen size={52} color="#c0c5d0" strokeWidth={1.3} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyCopy}>{copy}</Text>
    </View>
  );
}

function FilterTab({
  id, label, count, active, onPress,
}: { id: BookingFilterGroup; label: string; count: number; active: boolean; onPress: () => void }) {
  const color = active ? '#ff593e' : '#747681';
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.filterCard, active && styles.filterCardActive]}
    >
      {id === 'upcoming'  ? <CalendarDays size={22} color={color} strokeWidth={2} /> : null}
      {id === 'ongoing'   ? <Clock3       size={22} color={color} strokeWidth={2} /> : null}
      {id === 'completed' ? <CheckCircle2 size={22} color={color} strokeWidth={2} /> : null}
      {id === 'cancelled' ? <ChevronRight size={22} color={color} strokeWidth={2} /> : null}
      <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{label}</Text>
      <Text style={[styles.filterCount, active && styles.filterCountActive]}>{count}</Text>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ManageScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<BookingFilterGroup>('upcoming');
  const { data: grouped, isLoading, isRefetching, refetch } = useGroupedBookings();

  const filterCounts: Record<BookingFilterGroup, number> = {
    upcoming:  grouped?.upcoming.length  ?? 0,
    ongoing:   grouped?.ongoing.length   ?? 0,
    completed: grouped?.completed.length ?? 0,
    cancelled: grouped?.cancelled.length ?? 0,
  };

  const activeBookings: BookingItem[] = grouped?.[activeFilter] ?? [];
  const totalActive = filterCounts.upcoming + filterCounts.ongoing;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" backgroundColor="#ffffff" hidden={false} translucent={false} />

      {/* Header */}
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search bookings"
          hitSlop={12}
          style={styles.headerButtonRight}
        >
          <Search size={23} color="#111827" strokeWidth={1.8} />
        </Pressable>
      </View>

      {/* Loading spinner on first load */}
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#ff593e" />
          <Text style={styles.loadingText}>Loading your bookings…</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 94 }]}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#ff593e"
              colors={['#ff593e']}
            />
          }
        >
          {/* Summary headline */}
          <Text style={styles.activeSummary}>
            You have{' '}
            <Text style={styles.activeSummaryAccent}>
              {totalActive} Active {totalActive === 1 ? 'Booking' : 'Bookings'}
            </Text>
          </Text>

          {/* Filter tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            style={styles.filterScroll}
          >
            {FILTER_TABS.map((tab) => (
              <FilterTab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                count={filterCounts[tab.id]}
                active={tab.id === activeFilter}
                onPress={() => setActiveFilter(tab.id)}
              />
            ))}
          </ScrollView>

          {/* Booking list or empty state */}
          {activeBookings.length === 0 ? (
            <EmptyState filter={activeFilter} />
          ) : (
            <View style={styles.bookingList}>
              {activeBookings.map((booking, index) => (
                <BookingCard
                  key={booking.bookingId}
                  booking={booking}
                  index={index}
                  onPress={() =>
                    router.push({
                      pathname: '/OrderDetailsScreen',
                      params: { bookingId: String(booking.bookingId) },
                    })
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },

  // Header
  header: { height: 62, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#cbd0d6' },
  headerButton: { width: 45, height: 52, alignItems: 'center', justifyContent: 'center' },
  headerButtonRight: { width: 45, height: 52, marginLeft: 'auto', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#121820', fontSize: 18, lineHeight: 23, fontWeight: '800' },

  // Loading
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  loadingText: { color: '#7a808b', fontSize: 15, fontWeight: '500' },

  // Content
  content: { paddingTop: 31, paddingHorizontal: 16 },
  activeSummary: { color: '#545967', fontSize: 17, lineHeight: 22, fontWeight: '500' },
  activeSummaryAccent: { color: '#ff593e', fontWeight: '800' },

  // Filters
  filterScroll: { marginTop: 18, marginHorizontal: -16 },
  filterList: { paddingHorizontal: 16, gap: 13 },
  filterCard: { width: 97, height: 97, alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderColor: '#d9d3e4', borderRadius: 8, backgroundColor: '#fcfbfd' },
  filterCardActive: { borderColor: '#ff593e', backgroundColor: '#fffdfd' },
  filterLabel: { color: '#747681', fontSize: 15, lineHeight: 19, fontWeight: '600' },
  filterLabelActive: { color: '#ff593e' },
  filterCount: { color: '#525766', fontSize: 17, lineHeight: 21, fontWeight: '700' },
  filterCountActive: { color: '#ff593e' },

  // Booking list
  bookingList: { gap: 12, marginTop: 17 },

  // Status badge
  statusPill: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12, marginTop: 6 },
  statusText: { fontSize: 13, lineHeight: 16, fontWeight: '700' },

  // Booking card
  serviceCard: { minHeight: 148, flexDirection: 'row', padding: 12, borderWidth: 1, borderColor: '#e4e7eb', borderRadius: 8, backgroundColor: '#ffffff', shadowColor: '#162130', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.055, shadowRadius: 5, elevation: 2 },
  serviceImage: { width: 112, height: 112, borderRadius: 9 },
  serviceDetails: { flex: 1, minWidth: 0, marginLeft: 16 },
  serviceHeading: { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  serviceTitle: { flex: 1, color: '#34242a', fontSize: 17, lineHeight: 21, fontWeight: '800' },
  serviceTag: { marginTop: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: '#fff0eb' },
  serviceTagText: { color: '#c64925', fontSize: 11, lineHeight: 14, fontWeight: '700' },
  detailLine: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 7 },
  locationLine: { marginTop: 5 },
  detailText: { flex: 1, color: '#5f6674', fontSize: 14, lineHeight: 18, fontWeight: '500' },
  serviceDivider: { height: 1, marginTop: 10, backgroundColor: '#eef0f2' },
  serviceTotalRow: { height: 36, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  totalLabel: { color: '#8a6a62', fontSize: 14, lineHeight: 18, fontWeight: '600' },
  totalValueWrap: { flexDirection: 'row', alignItems: 'center', marginRight: -4 },
  serviceAmount: { color: '#ff593e', fontSize: 17, lineHeight: 22, fontWeight: '800' },

  // Empty state
  emptyState: { alignItems: 'center', paddingTop: 72, paddingHorizontal: 24, gap: 10 },
  emptyTitle: { color: '#2e3644', fontSize: 18, lineHeight: 23, fontWeight: '800', textAlign: 'center' },
  emptyCopy: { color: '#707887', fontSize: 15, lineHeight: 20, textAlign: 'center' },
});
