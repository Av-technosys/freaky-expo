import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Check, ChevronLeft, CircleCheck, ShoppingCart, Star } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

const cameraImage = require('@/public/camera.png');

const INCLUDED = [
  'Full day event coverage (Up to 8 Hours)',
  '1 Professional Photographer',
  '500+ Edited High Resolution Photos',
  'Candid & Posed Photography',
  'Online Digital Gallery',
  'All Photos Color Graded & Retouched',
  'Delivery in 3-5 Working Days',
];

export default function ServiceAddedConfirmation() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 0) + 22 }]}>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/ServiceDetails'))} style={styles.backButton} accessibilityLabel="Go back"><ChevronLeft size={21} color="#1f2937" /></Pressable>

        <View style={styles.successWrap}>
          <View style={styles.sparkles}><View style={styles.spark} /><View style={[styles.spark, styles.sparkTwo]} /><View style={[styles.spark, styles.sparkThree]} /></View>
          <View style={styles.successCircle}><CircleCheck size={49} color="#2cc56f" fill="#ffffff" strokeWidth={1.8} /></View>
        </View>
        <Text style={styles.successTitle}>Service Added!</Text>
        <Text style={styles.successDescription}>Your photography package has been added{`\n`}successfully.</Text>

        <Card style={styles.addedCard} className="border-[#e7eaf0] bg-white shadow-sm shadow-black/5">
          <CardContent style={styles.addedContent}>
            <Text style={styles.cardLabel}>Added Service</Text>
            <View style={styles.serviceRow}>
              <Image source={cameraImage} resizeMode="cover" style={styles.serviceImage} />
              <View style={styles.serviceCopy}><Text style={styles.serviceTitle}>Premium Photography</Text><View style={styles.rating}><Star size={11} color="#ffb900" fill="#ffb900" /><Text style={styles.ratingText}>4.8 (128 reviews) • 150+ Booked</Text></View><Text style={styles.serviceDescription}>Full day coverage with candid,{`\n`}posed shots and premium editing.</Text></View>
            </View>
            <View style={styles.metaRow}><Text style={styles.metaText}>♙ 2 Photographers</Text><Text style={styles.metaText}>◷ 10:00 - 16:00</Text><Text style={styles.metaText}>▣ Online Gallery</Text></View>
            <View style={styles.selectedStrip}><Check size={14} color="#139b53" strokeWidth={3} /><Text style={styles.selectedText}>This service has been added to your{`\n`}selection.</Text></View>
          </CardContent>
        </Card>

        <Text style={styles.sectionTitle}>What's Included</Text>
        <View style={styles.included}>{INCLUDED.map((item) => <View key={item} style={styles.includedRow}><CircleCheck size={13} color="#25b96a" /><Text style={styles.includedText}>{item}</Text></View>)}</View>

        <Card style={styles.summaryCard} className="border-[#e7eaf0] bg-white shadow-none"><CardContent style={styles.summaryContent}><Text style={styles.summaryTitle}>Total Summary</Text><View style={styles.summaryRow}><Text style={styles.summaryText}>Premium Photography</Text><Text style={styles.summaryText}>Rs11,999</Text></View><View style={styles.summaryRow}><Text style={styles.summaryText}>Add-ons (2)</Text><Text style={styles.summaryText}>Rs5,998</Text></View><View style={styles.summaryDivider} /><View style={styles.summaryRow}><Text style={styles.totalText}>Total Amount</Text><Text style={styles.totalText}>Rs17,997</Text></View></CardContent></Card>

        <View style={styles.actions}><Button variant="outline" className="h-11 rounded-md border-[#ff5a2a] bg-white" onPress={() => router.replace('/EventServices')}><Text className="text-[13px] font-medium text-[#ff5a2a]">Add More Services</Text></Button><Button className="mt-3 h-11 rounded-md bg-[#ff8f42]" onPress={() => router.navigate('/Cart')}><ShoppingCart size={15} color="#ffffff" /><Text className="text-[14px] font-bold text-white">View Cart</Text></Button></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingHorizontal: 11, paddingTop: 19 },
  backButton: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  successWrap: { marginTop: 18, height: 92, alignItems: 'center', justifyContent: 'center' },
  successCircle: { width: 67, height: 67, borderRadius: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5fff8', shadowColor: '#1fbd6b', shadowOpacity: 0.18, shadowRadius: 10, elevation: 3 },
  sparkles: { position: 'absolute', width: 110, height: 88 },
  spark: { position: 'absolute', top: 12, left: 17, width: 3, height: 3, borderRadius: 2, backgroundColor: '#36c978' },
  sparkTwo: { top: 20, left: 91, backgroundColor: '#ffb900' },
  sparkThree: { top: 72, left: 27, backgroundColor: '#36c978' },
  successTitle: { marginTop: 13, color: '#ff542e', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  successDescription: { marginTop: 9, color: '#687386', fontSize: 11, lineHeight: 15, textAlign: 'center' },
  addedCard: { marginTop: 14, borderRadius: 6 },
  addedContent: { padding: 10 },
  cardLabel: { color: '#172033', fontSize: 11, fontWeight: '600' },
  serviceRow: { marginTop: 8, flexDirection: 'row' },
  serviceImage: { width: 47, height: 47, borderRadius: 4 },
  serviceCopy: { flex: 1, marginLeft: 8 },
  serviceTitle: { color: '#172033', fontSize: 11, fontWeight: '700' },
  rating: { marginTop: 2, flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 3, color: '#788398', fontSize: 8 },
  serviceDescription: { marginTop: 3, color: '#64748b', fontSize: 8, lineHeight: 10 },
  metaRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { color: '#64748b', fontSize: 7 },
  selectedStrip: { marginTop: 9, flexDirection: 'row', alignItems: 'center', borderRadius: 3, backgroundColor: '#e9fff1', paddingHorizontal: 8, paddingVertical: 5 },
  selectedText: { marginLeft: 5, color: '#16864c', fontSize: 8, lineHeight: 10, fontWeight: '600' },
  sectionTitle: { marginTop: 17, color: '#172033', fontSize: 12, fontWeight: '700' },
  included: { marginTop: 8, gap: 5 },
  includedRow: { flexDirection: 'row', alignItems: 'center' },
  includedText: { marginLeft: 5, color: '#53627a', fontSize: 8, lineHeight: 10 },
  summaryCard: { marginTop: 14, borderRadius: 6 },
  summaryContent: { padding: 10 },
  summaryTitle: { color: '#172033', fontSize: 11, fontWeight: '700' },
  summaryRow: { marginTop: 7, flexDirection: 'row', justifyContent: 'space-between' },
  summaryText: { color: '#5d687b', fontSize: 8 },
  summaryDivider: { marginTop: 9, borderTopWidth: 1, borderTopColor: '#eef0f4' },
  totalText: { color: '#172033', fontSize: 9, fontWeight: '700' },
  actions: { marginTop: 15 },
});
