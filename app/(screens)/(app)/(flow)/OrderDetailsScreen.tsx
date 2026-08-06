import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Image, ImageBackground } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Check,
  CircleAlert,
  Clock3,
  Flower2,
  MapPin,
  Music2,
  PartyPopper,
  Phone,
  ReceiptText,
  Share2,
  TentTree,
  UsersRound,
  Utensils,
  Video,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { NeedHelpBanner } from '@/components/manageBooking/NeedHelpBanner';

type MetricProps = {
  icon: ReactNode;
  primary: string;
  secondary: string;
  last?: boolean;
};

type ServiceProps = {
  icon: ReactNode;
  label: string;
};

type TimelineStepProps = {
  title: string;
  subtitle: string;
  state: 'done' | 'current' | 'upcoming';
  last?: boolean;
};

const HERO_IMAGE = require('@/assets/images/home/image 1664.png');
const INVOICE_ART = require('@/assets/images/maillike.png');
const TIMER_BANNER = require('@/assets/images/timer_banner.png');

function Metric({ icon, primary, secondary, last }: MetricProps) {
  return (
    <View style={[styles.metric, last && styles.metricLast]}>
      {icon}
      <Text style={styles.metricPrimary}>{primary}</Text>
      <Text style={styles.metricSecondary}>{secondary}</Text>
    </View>
  );
}

function ServiceTile({ icon, label }: ServiceProps) {
  return (
    <View style={styles.serviceTile}>
      {icon}
      <Text style={styles.serviceTileLabel}>{label}</Text>
    </View>
  );
}

function PaymentStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.paymentStat}>
      <Text style={styles.paymentLabel}>{label}</Text>
      <Text style={[styles.paymentValue, { color }]}>{value}</Text>
    </View>
  );
}

function TimelineStep({ title, subtitle, state, last }: TimelineStepProps) {
  const isDone = state === 'done';
  const isCurrent = state === 'current';

  return (
    <View style={styles.timelineStep}>
      {!last ? <View style={[styles.timelineLine, !isDone && styles.timelineLineMuted]} /> : null}
      <View style={[styles.timelineMarker, state === 'upcoming' && styles.timelineMarkerUpcoming]}>
        {isDone ? <Check size={15} color="#ffffff" strokeWidth={2.8} /> : null}
        {isCurrent ? <CircleAlert size={15} color="#ffffff" strokeWidth={2.6} /> : null}
      </View>
      <View style={styles.timelineCopy}>
        <Text style={[styles.timelineTitle, state === 'upcoming' && styles.timelineTitleUpcoming]}>{title}</Text>
        <Text style={styles.timelineSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

function DetailCell({ icon, label, value, lastColumn, lastRow }: { icon: ReactNode; label: string; value: string; lastColumn?: boolean; lastRow?: boolean }) {
  return (
    <View style={[styles.detailCell, lastColumn && styles.detailCellLastColumn, lastRow && styles.detailCellLastRow]}>
      <View style={styles.detailCellHeading}>
        {icon}
        <Text style={styles.detailCellLabel}>{label}</Text>
      </View>
      <Text style={styles.detailCellValue}>{value}</Text>
    </View>
  );
}

export default function OrderDetailsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" backgroundColor="#ffffff" hidden={false} translucent={false} />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <ArrowLeft size={23} color="#172033" strokeWidth={2.25} />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Booking</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Share booking" hitSlop={12} style={styles.headerButtonRight}>
          <Share2 size={22} color="#172033" strokeWidth={2.1} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 34 }]}>
        <Image source={HERO_IMAGE} resizeMode="cover" style={styles.heroImage} />

        <View style={styles.metricsCard}>
          <Metric icon={<UsersRound size={22} color="#ff674d" strokeWidth={1.95} />} primary="250" secondary="Guests" />
          <Metric icon={<CalendarDays size={21} color="#ff674d" strokeWidth={1.95} />} primary={'23 Jul\n2026'} secondary="10:00 AM" />
          <Metric icon={<MapPin size={21} color="#ff674d" strokeWidth={1.95} />} primary={'Royal\nHeritage'} secondary="Jaipur, RJ" />
          <Metric icon={<PartyPopper size={21} color="#ff674d" strokeWidth={1.95} />} primary="Wedding" secondary="Event Type" last />
        </View>

        <Text style={styles.sectionTitle}>Included Services (6)</Text>
        <View style={styles.servicesGrid}>
          <ServiceTile icon={<Flower2 size={23} color="#ff674d" strokeWidth={1.9} />} label="Decoration" />
          <ServiceTile icon={<TentTree size={24} color="#ff674d" strokeWidth={1.9} />} label="Tent & Canopy" />
          <ServiceTile icon={<Camera size={24} color="#ff674d" strokeWidth={1.9} />} label="Photography" />
          <ServiceTile icon={<Utensils size={23} color="#ff674d" strokeWidth={1.9} />} label="Catering" />
          <ServiceTile icon={<Music2 size={23} color="#ff674d" strokeWidth={1.9} />} label="DJ & Music" />
          <ServiceTile icon={<Video size={23} color="#ff674d" strokeWidth={1.9} />} label="Videography" />
        </View>

        <Text style={styles.sectionTitle}>Booking Summary</Text>
        <View style={styles.summaryOverview}>
          <View style={styles.summaryPriceBlock}>
            <Text style={styles.totalAmountLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹2,45,000</Text>
          </View>
          <View style={styles.invoiceArt}>
            <Image source={INVOICE_ART} resizeMode="contain" style={styles.invoiceArtImage} />
          </View>
          <Pressable accessibilityRole="button" style={styles.invoiceButton}>
            <ReceiptText size={17} color="#384354" strokeWidth={1.9} />
            <Text style={styles.invoiceLabel}>View Invoice</Text>
          </Pressable>
        </View>
        <View style={styles.paymentStats}>
          <PaymentStat label={'ADVANCE\nPAID'} value="₹50k" color="#00a85a" />
          <PaymentStat label="REMAINING" value="₹1.95L" color="#ff3f38" />
          <PaymentStat label="STATUS" value="Partial" color="#13894a" />
        </View>

        <Text style={styles.sectionTitle}>Event Timeline</Text>
        <View style={styles.timelineSection}>
          <View style={styles.timelineList}>
            <TimelineStep title="Booking Confirmed" subtitle="15 May 2026 • 11:20 AM" state="done" />
            <TimelineStep title="Advance Paid" subtitle="15 May 2026 • 12:30 PM" state="done" />
            <TimelineStep title="Services Locked" subtitle="15 May 2026 • 04:15 PM" state="done" />
            <TimelineStep title="Event Day" subtitle="23 Jul 2026 • 10:00 AM" state="current" />
            <TimelineStep title="Completed" subtitle="-" state="upcoming" last />
          </View>
          <ImageBackground source={TIMER_BANNER} resizeMode="cover" imageStyle={styles.countdownImage} style={styles.countdownCard}>
            <Text style={styles.countdownCaption}>WEDDING START IN</Text>
            <Text style={styles.countdownValue}>01</Text>
            <Text style={styles.countdownUnit}>DAYS</Text>
            <View style={styles.countdownRule} />
            <Text style={styles.countdownValue}>05</Text>
            <Text style={styles.countdownUnit}>HOURS</Text>
            <View style={styles.countdownRule} />
            <Text style={styles.countdownValue}>05</Text>
            <Text style={styles.countdownUnit}>MINUTES</Text>
            <View style={styles.countdownRule} />
            <Text style={styles.countdownValue}>25</Text>
            <Text style={styles.countdownUnit}>SECONDS</Text>
          </ImageBackground>
        </View>

        <Text style={styles.sectionTitle}>Additional Information</Text>
        <View style={styles.additionalCard}>
          <DetailCell icon={<UsersRound size={17} color="#ff674d" strokeWidth={1.85} />} label="Bookers Name" value="Prateek Sharma" />
          <DetailCell icon={<Text style={styles.hashIcon}>#</Text>} label="Booking ID" value="WB123456" lastColumn />
          <DetailCell icon={<CalendarDays size={17} color="#ff674d" strokeWidth={1.85} />} label="Booking Date" value={'15 May 2026\n02:30 PM'} />
          <DetailCell icon={<Phone size={17} color="#ff674d" strokeWidth={1.85} />} label="Phone Number" value="+91 98765 43210" lastColumn />
          <DetailCell icon={<MapPin size={17} color="#ff674d" strokeWidth={1.85} />} label="Venue" value={'Royal Heritage,\nJaipur'} lastRow />
          <DetailCell icon={<UsersRound size={17} color="#ff674d" strokeWidth={1.85} />} label="Guests" value="250" lastColumn lastRow />
        </View>

        <NeedHelpBanner />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  header: { height: 62, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#cbd0d6' },
  headerButton: { width: 45, height: 52, alignItems: 'center', justifyContent: 'center' },
  headerButtonRight: { width: 45, height: 52, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
  headerTitle: { color: '#212632', fontSize: 19, lineHeight: 24, fontWeight: '800' },
  content: { paddingHorizontal: 18, paddingTop: 30 },
  heroImage: { width: '100%', height: 246, borderRadius: 8, backgroundColor: '#e9e3dc' },
  metricsCard: { minHeight: 116, flexDirection: 'row', marginTop: 31, paddingVertical: 15, borderWidth: 1, borderColor: '#e0e1e5', borderRadius: 8, backgroundColor: '#ffffff', shadowColor: '#1c2738', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  metric: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderRightWidth: 1, borderRightColor: '#edf0f2' },
  metricLast: { borderRightWidth: 0 },
  metricPrimary: { color: '#4a5160', fontSize: 17, lineHeight: 21, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  metricSecondary: { color: '#90939c', fontSize: 14, lineHeight: 18, fontWeight: '500', textAlign: 'center', marginTop: 7 },
  sectionTitle: { color: '#253044', fontSize: 19, lineHeight: 24, fontWeight: '800', marginTop: 38 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 18 },
  serviceTile: { width: '30.7%', height: 80, alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1, borderColor: '#f4e3e0', borderRadius: 8, backgroundColor: '#fff7f5' },
  serviceTileLabel: { color: '#656b7b', fontSize: 14, lineHeight: 18, fontWeight: '600', textAlign: 'center' },
  summaryOverview: { height: 128, position: 'relative', marginTop: 14 },
  summaryPriceBlock: { position: 'absolute', top: 0, left: 0 },
  totalAmountLabel: { color: '#5e6370', fontSize: 16, lineHeight: 20, fontWeight: '600' },
  totalAmount: { color: '#222b3d', fontSize: 29, lineHeight: 35, fontWeight: '800', marginTop: 4 },
  invoiceButton: { position: 'absolute', top: 77, left: 0, height: 33, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, borderWidth: 1, borderColor: '#9497a0', borderRadius: 4, backgroundColor: '#ffffff' },
  invoiceLabel: { color: '#394253', fontSize: 14, lineHeight: 18, fontWeight: '700' },
  invoiceArt: { position: 'absolute', top: 0, right: 2, width: 112, height: 79, alignItems: 'center', justifyContent: 'center' },
  invoiceArtImage: { width: 112, height: 79 },
  paymentStats: { flexDirection: 'row', gap: 12, marginTop: 0 },
  paymentStat: { height: 88, flex: 1, justifyContent: 'space-between', padding: 12, borderWidth: 1, borderColor: '#f2e6e5', borderRadius: 8, backgroundColor: '#fff8f6', shadowColor: '#5e4c47', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.045, shadowRadius: 4, elevation: 1 },
  paymentLabel: { color: '#7d7480', fontSize: 13, lineHeight: 16, fontWeight: '700' },
  paymentValue: { fontSize: 19, lineHeight: 23, fontWeight: '800' },
  timelineSection: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 20 },
  timelineList: { flex: 1, minWidth: 0, paddingTop: 9 },
  timelineStep: { minHeight: 62, flexDirection: 'row', position: 'relative' },
  timelineLine: { position: 'absolute', top: 23, bottom: -4, left: 11, width: 2, backgroundColor: '#ff674d' },
  timelineLineMuted: { backgroundColor: '#dedfe3' },
  timelineMarker: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#ff674d', zIndex: 1 },
  timelineMarkerUpcoming: { borderWidth: 2, borderColor: '#ff674d', backgroundColor: '#ffffff' },
  timelineCopy: { flex: 1, minWidth: 0, paddingTop: 1, marginLeft: 15 },
  timelineTitle: { color: '#4c5363', fontSize: 16, lineHeight: 20, fontWeight: '800' },
  timelineTitleUpcoming: { color: '#5b5f69' },
  timelineSubtitle: { color: '#9296a0', fontSize: 14, lineHeight: 18, fontWeight: '600', marginTop: 2 },
  countdownCard: { width: 158, height: 316, alignItems: 'center', paddingTop: 26, overflow: 'hidden' },
  countdownImage: { borderRadius: 9 },
  countdownCaption: { color: '#8e776b', fontSize: 12, lineHeight: 15, fontWeight: '700', letterSpacing: 0.6, textAlign: 'center' },
  countdownValue: { color: '#ff674d', fontSize: 28, lineHeight: 33, fontWeight: '500', marginTop: 8 },
  countdownUnit: { color: '#8e776b', fontSize: 12, lineHeight: 15, fontWeight: '700', letterSpacing: 2.2, marginTop: 1 },
  countdownRule: { width: 80, height: 1, backgroundColor: '#e5d6ca', marginTop: 8 },
  additionalCard: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 18, borderWidth: 1, borderColor: '#f0e7e6', borderRadius: 8, overflow: 'hidden', backgroundColor: '#ffffff', shadowColor: '#1c2738', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 5, elevation: 1 },
  detailCell: { width: '50%', minHeight: 80, paddingHorizontal: 14, paddingVertical: 14, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#f0e7e6' },
  detailCellLastColumn: { borderRightWidth: 0 },
  detailCellLastRow: { borderBottomWidth: 0 },
  detailCellHeading: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hashIcon: { color: '#ff674d', fontSize: 19, lineHeight: 21, fontWeight: '800' },
  detailCellLabel: { color: '#777988', fontSize: 14, lineHeight: 18, fontWeight: '600' },
  detailCellValue: { color: '#4c5363', fontSize: 16, lineHeight: 21, fontWeight: '700', marginTop: 8 },
});
