import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, ChevronLeft, CircleCheck, ShoppingCart, Star } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useCartStore } from '@/store/cartStore';

export default function ServiceAddedConfirmation() {
  const insets = useSafeAreaInsets();
  const { packageId, packageName } = useLocalSearchParams<{ packageId?: string; packageName?: string }>();
  const eventServices = useCartStore((state) => state.eventServices);

  // Find exact added service from cart store
  const addedService = eventServices.find(
    (s) => s.id === `package-${packageId}` || s.id === packageId || s.title === packageName || s.packageName === packageName
  ) || eventServices[eventServices.length - 1];

  const serviceTitle = addedService?.packageName || addedService?.title || packageName || 'Event Service';
  const servicePrice = addedService?.price ?? 4999;
  const imageUri = addedService?.imageUri || 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/wedding.png';
  const features = addedService?.features?.length
    ? addedService.features.map((f) => f.label)
    : ['Full Event Coverage by Verified Professionals', 'Complete Equipment & Venue Setup', 'Dedicated Event Coordinator Support'];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" backgroundColor="#ffffff" hidden={false} translucent={false} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 0) + 22 }]}>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/ServiceDetails'))} style={styles.backButton} accessibilityLabel="Go back">
          <ChevronLeft size={21} color="#1f2937" />
        </Pressable>

        <View style={styles.successWrap}>
          <View style={styles.sparkles}>
            <View style={styles.spark} />
            <View style={[styles.spark, styles.sparkTwo]} />
            <View style={[styles.spark, styles.sparkThree]} />
          </View>
          <View style={styles.successCircle}>
            <CircleCheck size={72} color="#2cc56f" fill="#ffffff" strokeWidth={1.8} />
          </View>
        </View>
        <Text style={styles.successTitle}>Service Added!</Text>
        <Text style={styles.successDescription}>Your service package has been added{`\n`}successfully.</Text>

        <Card style={styles.addedCard} className="border-[#e7eaf0] bg-white shadow-sm shadow-black/5">
          <CardContent style={styles.addedContent}>
            <Text style={styles.cardLabel}>Added Service</Text>
            <View style={styles.serviceRow}>
              <Image source={{ uri: imageUri }} resizeMode="cover" style={styles.serviceImage} />
              <View style={styles.serviceCopy}>
                <Text style={styles.serviceTitle}>{serviceTitle}</Text>
                <View style={styles.rating}>
                  <Star size={11} color="#ffb900" fill="#ffb900" />
                  <Text style={styles.ratingText}>4.8 (1.2k reviews) • 150+ Booked</Text>
                </View>
                <Text style={styles.serviceDescription}>Verified professional setup & full event coverage.</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>♙ Verified Vendor</Text>
              <Text style={styles.metaText}>◷ On-Time Delivery</Text>
              <Text style={styles.metaText}>▣ Draft Saved in DB</Text>
            </View>
            <View style={styles.selectedStrip}>
              <Check size={14} color="#139b53" strokeWidth={3} />
              <Text style={styles.selectedText}>This service has been added to your{`\n`}selection.</Text>
            </View>
          </CardContent>
        </Card>

        <Text style={styles.sectionTitle}>What's Included</Text>
        <View style={styles.included}>
          {features.map((item, idx) => (
            <View key={idx} style={styles.includedRow}>
              <CircleCheck size={13} color="#25b96a" />
              <Text style={styles.includedText}>{item}</Text>
            </View>
          ))}
        </View>

        <Card style={styles.summaryCard} className="border-[#e7eaf0] bg-white shadow-none">
          <CardContent style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Total Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText} numberOfLines={1}>{serviceTitle}</Text>
              <Text style={styles.summaryText}>₹{Number(servicePrice).toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalText}>Total Amount</Text>
              <Text style={styles.totalText}>₹{Number(servicePrice).toLocaleString('en-IN')}</Text>
            </View>
          </CardContent>
        </Card>

        <View style={styles.actions}>
          <Button variant="outline" className="h-12 rounded-md border-[#ff5a2a] bg-white" onPress={() => router.replace('/EventServices')}>
            <Text className="text-[16px] font-bold text-[#ff5a2a]">Add More Services</Text>
          </Button>
          <Button className="mt-3 h-12 rounded-md bg-[#ff8f42]" onPress={() => router.navigate('/Cart')}>
            <ShoppingCart size={18} color="#ffffff" />
            <Text className="text-[16px] font-bold text-white">View Cart</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingHorizontal: 18, paddingTop: 19 },
  backButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  successWrap: { marginTop: 15, height: 178, alignItems: 'center', justifyContent: 'center' },
  successCircle: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5fff8', shadowColor: '#1fbd6b', shadowOpacity: 0.2, shadowRadius: 13, elevation: 4 },
  sparkles: { position: 'absolute', width: 184, height: 154 },
  spark: { position: 'absolute', top: 16, left: 24, width: 4, height: 4, borderRadius: 2, backgroundColor: '#36c978' },
  sparkTwo: { top: 31, left: 151, width: 4, height: 4, backgroundColor: '#ffb900' },
  sparkThree: { top: 126, left: 43, width: 4, height: 4, backgroundColor: '#36c978' },
  successTitle: { marginTop: 17, color: '#ff542e', fontSize: 21, lineHeight: 26, fontWeight: '800', textAlign: 'center' },
  successDescription: { marginTop: 12, color: '#566174', fontSize: 16, lineHeight: 21, textAlign: 'center' },
  addedCard: { marginTop: 18, borderRadius: 8 },
  addedContent: { padding: 15 },
  cardLabel: { color: '#172033', fontSize: 16, lineHeight: 20, fontWeight: '700' },
  serviceRow: { marginTop: 12, flexDirection: 'row' },
  serviceImage: { width: 80, height: 80, borderRadius: 7 },
  serviceCopy: { flex: 1, marginLeft: 14 },
  serviceTitle: { color: '#172033', fontSize: 16, lineHeight: 20, fontWeight: '800' },
  rating: { marginTop: 4, flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 4, color: '#788398', fontSize: 12, lineHeight: 16 },
  serviceDescription: { marginTop: 5, color: '#64748b', fontSize: 13, lineHeight: 17 },
  metaRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { color: '#64748b', fontSize: 10, lineHeight: 13 },
  selectedStrip: { marginTop: 13, flexDirection: 'row', alignItems: 'center', borderRadius: 5, backgroundColor: '#e9fff1', paddingHorizontal: 10, paddingVertical: 8 },
  selectedText: { marginLeft: 7, color: '#16864c', fontSize: 14, lineHeight: 18, fontWeight: '600' },
  sectionTitle: { marginTop: 28, color: '#172033', fontSize: 18, lineHeight: 23, fontWeight: '800' },
  included: { marginTop: 16, gap: 10 },
  includedRow: { flexDirection: 'row', alignItems: 'center' },
  includedText: { marginLeft: 8, color: '#53627a', fontSize: 15, lineHeight: 19 },
  summaryCard: { marginTop: 22, borderRadius: 8 },
  summaryContent: { padding: 15 },
  summaryTitle: { color: '#172033', fontSize: 17, lineHeight: 21, fontWeight: '800' },
  summaryRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  summaryText: { color: '#5d687b', fontSize: 15, lineHeight: 19, flex: 1, paddingRight: 8 },
  summaryDivider: { marginTop: 13, borderTopWidth: 1, borderTopColor: '#eef0f4' },
  totalText: { color: '#172033', fontSize: 17, lineHeight: 21, fontWeight: '800' },
  actions: { marginTop: 30 },
});
