import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  Copy,
  Gift,
  Mail,
  UserRound,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';

type NextStepProps = {
  icon: 'planner' | 'mail' | 'gift';
  title: string;
  description: string;
};

function NextStep({ icon, title, description }: NextStepProps) {
  const iconColor = '#ff593e';

  return (
    <View style={styles.nextStep}>
      <View style={styles.nextIcon}>
        {icon === 'planner' ? <UserRound size={20} color={iconColor} strokeWidth={1.9} /> : null}
        {icon === 'mail' ? <Mail size={20} color={iconColor} strokeWidth={1.9} /> : null}
        {icon === 'gift' ? <Gift size={20} color={iconColor} strokeWidth={1.9} /> : null}
      </View>
      <View style={styles.nextCopy}>
        <Text style={styles.nextTitle}>{title}</Text>
        <Text style={styles.nextDescription}>{description}</Text>
      </View>
    </View>
  );
}

export default function BookingConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const confirmationId = bookingId || 'FCB250525001';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" backgroundColor="#ffffff" hidden={false} translucent={false} />

      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.replace('/home')}
          style={styles.backButton}
        >
          <ArrowLeft size={21} color="#172033" strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.celebration}>
          <Image
            source={require('@/assets/images/paysuccess.png')}
            resizeMode="contain"
            style={styles.celebrationImage}
          />
        </View>

        <Text style={styles.confirmedTitle}>Your Booking is Confirmed!</Text>
        <Text style={styles.confirmedDescription}>We have received your booking.{'\n'}Our team will contact you soon.</Text>

        <View style={styles.bookingIdCard}>
          <Text style={styles.bookingIdLabel}>Booking ID</Text>
          <View style={styles.bookingIdRow}>
            <Text style={styles.bookingId}>{confirmationId}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Copy booking ID" hitSlop={10} style={styles.copyButton}>
              <Copy size={19} color="#ff593e" strokeWidth={1.9} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.nextHeading}>What's Next?</Text>
        <View style={styles.nextList}>
          <NextStep icon="planner" title="Our event planner will contact you" description="within 2 hours" />
          <NextStep icon="mail" title="We will share the final details" description="and timings" />
          <NextStep icon="gift" title="Enjoy your special day!" description="We'll handle the rest" />
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable style={styles.homeButton} onPress={() => router.replace('/home')}>
          <LinearGradient
            colors={['#ff593c', '#ffad4d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.homeGradient}
          >
            <Text style={styles.homeLabel}>Back to Home</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: { height: 60, alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', left: 12, width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#141b2a', fontSize: 17, lineHeight: 22, fontWeight: '700' },
  content: { flex: 1, paddingHorizontal: 12, paddingTop: 18 },
  celebration: { width: 250, height: 142, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: 2 },
  celebrationImage: { width: 250, height: 167, transform: [{ scale: 1.27 }] },
  confirmedTitle: { color: '#ff593e', fontSize: 20, lineHeight: 25, fontWeight: '800', textAlign: 'center', marginTop: 10 },
  confirmedDescription: { color: '#596579', fontSize: 15, lineHeight: 20, textAlign: 'center', marginTop: 9 },
  bookingIdCard: { marginTop: 16, paddingHorizontal: 13, paddingVertical: 13, borderWidth: 1, borderColor: '#ff8067', borderRadius: 7, backgroundColor: '#fffefe' },
  bookingIdLabel: { color: '#4b5565', fontSize: 13, lineHeight: 17, fontWeight: '500' },
  bookingIdRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 },
  bookingId: { color: '#ff593e', fontSize: 17, lineHeight: 22, fontWeight: '800' },
  copyButton: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  nextHeading: { color: '#273247', fontSize: 16, lineHeight: 20, fontWeight: '700', marginTop: 18, marginLeft: 1 },
  nextList: { gap: 9, marginTop: 13 },
  nextStep: { minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderWidth: 1, borderColor: '#e8edf2', borderRadius: 7, backgroundColor: '#ffffff', shadowColor: '#1c2738', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.035, shadowRadius: 3, elevation: 1 },
  nextIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: '#fff0ed' },
  nextCopy: { flex: 1, marginLeft: 12 },
  nextTitle: { color: '#2b3545', fontSize: 15, lineHeight: 19, fontWeight: '700' },
  nextDescription: { color: '#5e6a7d', fontSize: 13, lineHeight: 17, marginTop: 1 },
  footer: { paddingHorizontal: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eff1f4', backgroundColor: '#ffffff' },
  homeButton: { height: 48, overflow: 'hidden', borderRadius: 7 },
  homeGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  homeLabel: { color: '#ffffff', fontSize: 16, lineHeight: 20, fontWeight: '700' },
});
