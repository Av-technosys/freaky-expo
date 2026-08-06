import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock3,
  Film,
  Link2,
  Music2,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  Volume2,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import {
  type EventCartFeature,
  type EventCartService,
  useCartStore,
} from '@/store/cartStore';

const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

function CartHeader() {
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/home');
  };

  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" hitSlop={12} onPress={goBack} style={styles.backButton}>
        <ArrowLeft size={21} color="#141a27" strokeWidth={2.1} />
      </Pressable>
      <View style={styles.headerCopy}>
        <Text style={styles.headerTitle}>Your Selected Services</Text>
        <Text style={styles.headerSubtitle}>Review your selected services</Text>
      </View>
    </View>
  );
}

function FeatureIcon({ icon }: { icon: EventCartFeature['icon'] }) {
  const props = { size: 12, color: '#526178', strokeWidth: 1.75 };

  switch (icon) {
    case 'person':
      return <UserRound {...props} />;
    case 'clock':
      return <Clock3 {...props} />;
    case 'camera':
      return <Camera {...props} />;
    case 'link':
      return <Link2 {...props} />;
    case 'dj':
      return <Film {...props} />;
    case 'music':
      return <Music2 {...props} />;
    case 'sound':
      return <Volume2 {...props} />;
    case 'star':
      return <Star {...props} />;
    case 'balloon':
    case 'sparkles':
    case 'fun':
    case 'anchor':
    default:
      return <Sparkles {...props} />;
  }
}

function ServiceCard({ service, onRemove }: { service: EventCartService; onRemove: () => void }) {
  return (
    <View style={styles.serviceCard}>
      <Image source={{ uri: service.imageUri }} style={styles.serviceImage} />

      <View style={styles.serviceContent}>
        <View style={styles.serviceTopLine}>
          <Text style={styles.serviceTitle} numberOfLines={1}>{service.title}</Text>
          <Text style={styles.servicePrice}>{formatPrice(service.price)}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${service.title}`} hitSlop={10} onPress={onRemove} style={styles.deleteButton}>
            <Trash2 size={17} color="#e05252" strokeWidth={2} />
          </Pressable>
        </View>

        <Text style={styles.packageName} numberOfLines={2}>{service.packageName}</Text>

        <View style={styles.featureList}>
          {service.features.map((feature) => (
            <View key={feature.label} style={styles.featureRow}>
              <FeatureIcon icon={feature.icon} />
              <Text style={styles.featureText} numberOfLines={1}>{feature.label}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.detailsButton} accessibilityRole="button">
          <Text style={styles.detailsLabel}>View Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SuccessNotice({ count }: { count: number }) {
  return (
    <View style={styles.successNotice}>
      <CheckCircle2 size={20} color="#14934a" strokeWidth={2} />
      <View style={styles.successCopy}>
        <Text style={styles.successTitle}>{count} services added successfully!</Text>
        <Text style={styles.successText}>You can review, customize or remove any service.</Text>
      </View>
    </View>
  );
}

function PriceSummary({ services }: { services: EventCartService[] }) {
  const total = services.reduce((sum, service) => sum + service.price, 0);

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Price Summary</Text>
      <View style={styles.summaryList}>
        {services.map((service) => (
          <View key={service.id} style={styles.summaryRow}>
            <Text style={styles.summaryLabel} numberOfLines={2}>{service.title} ({service.packageName})</Text>
            <Text style={styles.summaryPrice}>{formatPrice(service.price)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summaryDivider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalPrice}>{formatPrice(total)}</Text>
      </View>

      <View style={styles.taxNotice}>
        <CheckCircle2 size={14} color="#15a251" strokeWidth={1.9} />
        <Text style={styles.taxNoticeText}>Taxes and other charges may apply at checkout.</Text>
      </View>
    </View>
  );
}

function EmptyCart() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No services selected</Text>
      <Text style={styles.emptyCopy}>Choose services for your celebration to see them here.</Text>
    </View>
  );
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const services = useCartStore((state) => state.eventServices);
  const removeEventService = useCartStore((state) => state.removeEventService);
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" backgroundColor="#ffffff" hidden={false} translucent={false} />
      <CartHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 92 }]}
      >
        {services.length > 0 ? (
          <>
            <SuccessNotice count={services.length} />
            <Text style={styles.selectedTitle}>Selected Services ({services.length})</Text>
            <View style={styles.servicesList}>
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} onRemove={() => removeEventService(service.id)} />
              ))}
            </View>
            <PriceSummary services={services} />
          </>
        ) : (
          <EmptyCart />
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable
          accessibilityRole="button"
          disabled={services.length === 0}
          onPress={() => router.push('/eventDetails' as never)}
          style={[styles.continueButton, services.length === 0 && styles.continueButtonDisabled]}
        >
          <LinearGradient colors={['#ff5a3c', '#ffad4c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.continueGradient}>
            <Text style={styles.continueLabel}>Continue</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: { height: 72, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#f4f5f7' },
  backButton: { position: 'absolute', left: 14, width: 36, height: 42, alignItems: 'center', justifyContent: 'center' },
  headerCopy: { alignItems: 'center', paddingHorizontal: 54 },
  headerTitle: { color: '#121927', fontSize: 16, lineHeight: 20, fontWeight: '700' },
  headerSubtitle: { color: '#748094', fontSize: 13, lineHeight: 17, marginTop: 1 },
  content: { paddingHorizontal: 12, paddingTop: 12 },
  successNotice: { minHeight: 76, flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 13, paddingVertical: 13, borderWidth: 1, borderColor: '#bcefd0', borderRadius: 7, backgroundColor: '#effbf4' },
  successCopy: { flex: 1 },
  successTitle: { color: '#0d8540', fontSize: 14, lineHeight: 18, fontWeight: '700' },
  successText: { color: '#405168', fontSize: 12, lineHeight: 17, marginTop: 2 },
  selectedTitle: { color: '#273247', fontSize: 14, lineHeight: 18, fontWeight: '700', marginTop: 20, marginLeft: 1 },
  servicesList: { gap: 12, marginTop: 11 },
  serviceCard: { minHeight: 151, flexDirection: 'row', padding: 12, borderWidth: 1, borderColor: '#edf0f4', borderRadius: 8, backgroundColor: '#ffffff', shadowColor: '#334155', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  serviceImage: { width: 68, height: 68, borderRadius: 6, backgroundColor: '#eef1f5' },
  serviceContent: { flex: 1, minWidth: 0, marginLeft: 12, paddingBottom: 1 },
  serviceTopLine: { minHeight: 18, flexDirection: 'row', alignItems: 'center' },
  serviceTitle: { flex: 1, minWidth: 0, color: '#1f2939', fontSize: 15, lineHeight: 19, fontWeight: '700' },
  servicePrice: { color: '#1f2939', fontSize: 14, lineHeight: 18, fontWeight: '700', marginLeft: 7 },
  deleteButton: { width: 23, height: 25, alignItems: 'flex-end', justifyContent: 'center', marginLeft: 4 },
  packageName: { maxWidth: '70%', color: '#697990', fontSize: 13, lineHeight: 17, marginTop: 1 },
  featureList: { gap: 5, marginTop: 10, paddingRight: 86 },
  featureRow: { height: 15, flexDirection: 'row', alignItems: 'center', gap: 5 },
  featureText: { flex: 1, color: '#526178', fontSize: 12, lineHeight: 15 },
  detailsButton: { position: 'absolute', right: 0, bottom: 0, minWidth: 82, height: 28, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, borderWidth: 1, borderColor: '#d6dde6', borderRadius: 4, backgroundColor: '#ffffff' },
  detailsLabel: { color: '#344258', fontSize: 11, lineHeight: 14, fontWeight: '600' },
  summaryCard: { marginTop: 15, padding: 15, borderWidth: 1, borderColor: '#eef0f3', borderRadius: 8, backgroundColor: '#ffffff', shadowColor: '#334155', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  summaryTitle: { color: '#1f2939', fontSize: 16, lineHeight: 20, fontWeight: '700' },
  summaryList: { gap: 8, marginTop: 13 },
  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  summaryLabel: { flex: 1, color: '#62718a', fontSize: 13, lineHeight: 17 },
  summaryPrice: { color: '#253146', fontSize: 13, lineHeight: 17, fontWeight: '700' },
  summaryDivider: { marginTop: 13, borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#dbe2e9' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  totalLabel: { color: '#202a3b', fontSize: 15, lineHeight: 19, fontWeight: '700' },
  totalPrice: { color: '#202a3b', fontSize: 17, lineHeight: 21, fontWeight: '800' },
  taxNotice: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15, paddingHorizontal: 10, borderRadius: 7, backgroundColor: '#f2faf6' },
  taxNoticeText: { flex: 1, color: '#128243', fontSize: 11, lineHeight: 14 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 100, paddingHorizontal: 36 },
  emptyTitle: { color: '#202a3b', fontSize: 16, lineHeight: 21, fontWeight: '700' },
  emptyCopy: { color: '#6d7b90', fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 6 },
  footer: { paddingHorizontal: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0f2f4', backgroundColor: '#ffffff' },
  continueButton: { height: 45, overflow: 'hidden', borderRadius: 7 },
  continueButtonDisabled: { opacity: 0.45 },
  continueGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  continueLabel: { color: '#ffffff', fontSize: 15, lineHeight: 19, fontWeight: '700' },
});
