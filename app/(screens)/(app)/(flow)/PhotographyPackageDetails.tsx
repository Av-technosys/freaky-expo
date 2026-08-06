import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, ChevronLeft, ChevronRight, CircleCheck, ImageIcon, Share2, Star, Video } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

const heroImage = require('@/public/cameraman.png');
const cameraImage = require('@/public/camera.png');

const INCLUDED = [
  'Full day event coverage (Up to 8 Hours)',
  '1 Professional Photographer',
  '500+ Edited High Resolution Photos',
  'Candid & Posed Photography',
  'Online Digital Gallery',
];

const ADD_ONS = [
  { id: 'video', title: 'Cinematic Highlight Video', price: 'Rs2,499', description: '30-60 sec cinematic highlight video of your event.', icon: Video },
  { id: 'album', title: 'Premium Photo Album', price: 'Rs3,499', description: '12x18 inch premium photo album with 40 pages.', icon: ImageIcon },
  { id: 'drone', title: 'Drone Photography', price: 'Rs4,999', description: 'Aerial drone shots & videos of your event.', icon: Share2 },
];

export default function PhotographyPackageDetails() {
  const insets = useSafeAreaInsets();
  const { packageName } = useLocalSearchParams<{ packageName?: string }>();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const title = packageName || 'Premium Photography';

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 0) + 22 }}>
        <View style={styles.topBar}>
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/ServiceDetails'))} style={styles.iconButton} accessibilityLabel="Go back"><ChevronLeft size={25} color="#111111" /></Pressable>
          <Pressable style={styles.shareButton} accessibilityLabel="Share package"><Share2 size={19} color="#344054" /></Pressable>
        </View>

        <View style={styles.heroWrap}>
          <Image source={heroImage} resizeMode="cover" style={styles.heroImage} />
          <View style={styles.photoCount}><Text style={styles.photoCountText}>1 / 12</Text></View>
        </View>
        <View style={styles.dots}>{[0, 1, 2, 3, 4, 5].map((dot) => <View key={dot} style={[styles.dot, dot === 0 && styles.dotActive]} />)}</View>

        <View style={styles.details}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.meta}><Star size={18} color="#1d2939" fill="#1d2939" /><Text style={styles.metaText}>4.8 <Text style={styles.metaMuted}>(128 reviews)</Text></Text><View style={styles.metaDivider} /><Text style={styles.metaText}>◷ 150+ Booked</Text></View>
          <Text style={styles.description}>Full day coverage with candid, posed shots and premium editing to capture every special moment beautifully.</Text>
          <Text style={styles.sectionTitle}>What's Included</Text>
          {INCLUDED.map((item) => <View key={item} style={styles.includedRow}><CircleCheck size={17} color="#16b364" /><Text style={styles.includedText}>{item}</Text></View>)}
        </View>

        <View style={styles.selectionBar}>
          <View><Text style={styles.selectionCount}>{added ? 1 : 0} Services Selected</Text><Text style={styles.selectionPrice}>{added ? 'Rs4,999' : 'Rs0'}</Text></View>
          <Button className="h-12 w-[109px] rounded-lg bg-[#ff9b46]" onPress={() => { setAdded(true); router.navigate('/ServiceAddedConfirmation'); }}><Text className="text-[16px] font-bold text-white">{added ? 'Added' : 'Add'}</Text></Button>
        </View>

        <View style={styles.sampleHeader}><Text style={styles.sectionTitle}>Sample Photos</Text><Pressable style={styles.viewAll}><Text style={styles.viewAllText}>View all</Text><ChevronRight size={17} color="#44546b" /></Pressable></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.samples}>{[0, 1, 2].map((item) => <Image key={item} source={cameraImage} resizeMode="cover" style={styles.sampleImage} />)}</ScrollView>

        <View style={styles.addOns}><Text style={styles.sectionTitle}>Add-ons (Optional)</Text>{ADD_ONS.map((addOn) => {
          const selected = selectedAddOns.includes(addOn.id);
          const Icon = addOn.icon;
          return <Pressable key={addOn.id} onPress={() => toggleAddOn(addOn.id)}><Card style={styles.addOnCard} className="border-[#dce4ef] bg-white shadow-none"><CardContent style={styles.addOnContent}><View style={styles.addOnIcon}><Icon size={22} color="#ff5a2a" strokeWidth={1.8} /></View><View style={styles.addOnCopy}><View style={styles.addOnTitleRow}><Text style={styles.addOnTitle}>{addOn.title}</Text><Text style={styles.addOnPrice}>+ {addOn.price}</Text></View><Text style={styles.addOnDescription}>{addOn.description}</Text></View><View style={[styles.checkbox, selected && styles.checkboxSelected]}>{selected ? <Check size={15} color="#ffffff" strokeWidth={3} /> : null}</View></CardContent></Card></Pressable>;
        })}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  topBar: { height: 68, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  shareButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 17, borderWidth: 1, borderColor: '#e5e7eb' },
  heroWrap: { marginHorizontal: 17, height: 240, overflow: 'hidden', borderRadius: 14 },
  heroImage: { width: '100%', height: '100%' },
  photoCount: { position: 'absolute', right: 10, bottom: 10, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 8, paddingVertical: 5 },
  photoCountText: { color: '#ffffff', fontSize: 12 },
  dots: { marginTop: 14, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#dbe2eb' },
  dotActive: { backgroundColor: '#263449' },
  details: { paddingHorizontal: 20, paddingTop: 26 },
  title: { color: '#172033', fontSize: 24, lineHeight: 29, fontWeight: '700' },
  meta: { marginTop: 9, flexDirection: 'row', alignItems: 'center' },
  metaText: { marginLeft: 5, color: '#344054', fontSize: 14 },
  metaMuted: { color: '#718096' },
  metaDivider: { width: 1, height: 17, marginHorizontal: 12, backgroundColor: '#cbd5e1' },
  description: { marginTop: 28, color: '#53627a', fontSize: 16, lineHeight: 24 },
  sectionTitle: { color: '#172033', fontSize: 17, lineHeight: 21, fontWeight: '700' },
  includedRow: { marginTop: 11, flexDirection: 'row', alignItems: 'center' },
  includedText: { marginLeft: 8, color: '#45536a', fontSize: 16, lineHeight: 20 },
  selectionBar: { marginTop: 18, minHeight: 71, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#d8e0ea', backgroundColor: '#ffffff' },
  selectionCount: { color: '#172033', fontSize: 15, fontWeight: '600' },
  selectionPrice: { marginTop: 6, color: '#172033', fontSize: 16, fontWeight: '700' },
  sampleHeader: { marginTop: 20, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  viewAll: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { color: '#44546b', fontSize: 14 },
  samples: { gap: 10, paddingHorizontal: 17, paddingTop: 17, paddingRight: 28 },
  sampleImage: { width: 120, height: 176, borderRadius: 7 },
  addOns: { paddingHorizontal: 17, paddingTop: 28, gap: 12 },
  addOnCard: { borderRadius: 8 },
  addOnContent: { minHeight: 96, padding: 16, flexDirection: 'row', alignItems: 'center' },
  addOnIcon: { width: 48, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0ea' },
  addOnCopy: { flex: 1, marginLeft: 12, paddingRight: 6 },
  addOnTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addOnTitle: { flex: 1, color: '#172033', fontSize: 16, fontWeight: '700' },
  addOnPrice: { color: '#172033', fontSize: 14, fontWeight: '600' },
  addOnDescription: { marginTop: 4, color: '#718096', fontSize: 14, lineHeight: 19 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#c8d3e0', alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { borderColor: '#ff5a2a', backgroundColor: '#ff5a2a' },
});
