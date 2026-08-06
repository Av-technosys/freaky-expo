import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Menu, Search, Star, Tag } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

const heroImage = require('@/public/cameraman.png');
const cameraImage = require('@/public/camera.png');

const GALLERY = [
  'Premium Photography',
  'Wedding Photography',
  'Studio Photoshoot',
  'Pre Wedding Photoshoot',
  'Premium Photography',
  'Wedding Photography',
  'Studio Photoshoot',
  'Pre Wedding Photoshoot',
];

const PACKAGES = [
  { id: 'standard', title: 'Prime Photography', price: 'Rs4,999', time: '2-3 hrs' },
  { id: 'premium', title: 'Prime Photography', price: 'Rs4,999', time: '2-3 hrs' },
  { id: 'elite', title: 'Prime Photography', price: 'Rs7,499', time: '2-3 hrs' },
];

export default function ServiceDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { serviceName } = useLocalSearchParams<{ serviceName?: string }>();
  const [added, setAdded] = useState<string[]>(['standard']);
  const title = serviceName || 'Photography';

  const togglePackage = (id: string) => {
    setAdded((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 0) + 28 }}>
        <View style={styles.hero}>
          <Image source={heroImage} resizeMode="cover" style={styles.heroImage} />
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/EventServices'))} style={styles.heroBack} accessibilityLabel="Go back">
            <ChevronLeft size={26} color="#3f3f3f" strokeWidth={2.4} />
          </Pressable>
          <Pressable style={styles.heroSearch} accessibilityLabel="Search services">
            <Search size={22} color="#555555" strokeWidth={2.1} />
          </Pressable>
          <View style={styles.pager}>
            {[0, 1, 2, 3, 4, 5].map((item) => <View key={item} style={[styles.pagerLine, item === 2 && styles.pagerActive]} />)}
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.titleRating}><Star size={20} color="#ffba00" fill="#ffba00" strokeWidth={1.8} /><Text style={styles.titleRatingText}>4.8 (20K bookings)</Text></View>
        </View>

        <View style={styles.divider} />
        <View style={styles.gallery}>
          {GALLERY.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.galleryItem}>
              <Image source={cameraImage} resizeMode="cover" style={styles.galleryImage} />
              <Text numberOfLines={2} style={styles.galleryLabel}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />
        <View style={styles.menuWrap}><View style={styles.menuPill}><Menu size={20} color="#ffffff" /><Text style={styles.menuText}>Menu</Text></View></View>
        <View style={styles.savingStrip}><Tag size={16} color="#07823d" fill="#07823d" strokeWidth={2} /><Text style={styles.savingText}>Save 10% on every order get Plus now</Text></View>

        <View style={styles.cartRow}>
          <Text style={styles.cartCount}>{added.length} Service{added.length === 1 ? '' : 's'} added</Text>
          <Button className="h-12 w-[148px] rounded-lg bg-[#ff9b46]" onPress={() => undefined}><Text className="text-[15px] font-bold text-white">View cart</Text></Button>
        </View>

        <View style={styles.packageList}>
          {PACKAGES.map((item) => {
            const isAdded = added.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => router.navigate({ pathname: '/PhotographyPackageDetails', params: { packageName: item.title } })}
              >
                <Card style={styles.packageCard} className="border-0 bg-white shadow-none">
                <CardContent style={styles.packageContent}>
                  <View style={styles.packageCopy}>
                    <Text style={styles.packageTitle}>{item.title}</Text>
                    <View style={styles.packageRating}><Star size={17} color="#ffba00" fill="#ffba00" strokeWidth={1.8} /><Text style={styles.packageRatingText}>4.8 (156)</Text></View>
                    <Text style={styles.packagePrice}>Starts at {item.price} <Text style={styles.packageTime}>- {item.time}</Text></Text>
                    <View style={styles.featureDivider} />
                    <Text style={styles.featureText}>• Perfect for small{`\n`}   celebrations.Includes candid..</Text>
                    <Text style={styles.featureText}>• Perfect for small{`\n`}   celebrations.Includes candid..</Text>
                  </View>
                  <View style={styles.packageSide}>
                    <Image source={cameraImage} resizeMode="cover" style={styles.packageImage} />
                    <Button variant="outline" className={`mt-[-1px] h-9 w-[92px] self-center rounded-md border-[#ff5a2a] bg-white ${isAdded ? 'opacity-70' : ''}`} onPress={() => togglePackage(item.id)}>
                      <Text className="text-[15px] font-medium text-[#ff5a2a]">{isAdded ? 'Added' : 'Add'}</Text>
                    </Button>
                  </View>
                </CardContent>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  hero: { height: 216, overflow: 'hidden', position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroBack: { position: 'absolute', left: 18, top: 12, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  heroSearch: { position: 'absolute', right: 18, top: 12, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  pager: { position: 'absolute', bottom: 11, left: 18, right: 18, flexDirection: 'row', gap: 4 },
  pagerLine: { flex: 1, height: 4, borderRadius: 3, backgroundColor: '#505050' },
  pagerActive: { backgroundColor: '#ffffff' },
  titleSection: { paddingHorizontal: 16, paddingVertical: 28 },
  title: { color: '#121212', fontSize: 20, lineHeight: 25, fontWeight: '700' },
  titleRating: { marginTop: 7, flexDirection: 'row', alignItems: 'center' },
  titleRatingText: { marginLeft: 6, color: '#666666', fontSize: 14 },
  divider: { height: 6, backgroundColor: '#f4f4f4' },
  gallery: { paddingHorizontal: 18, paddingVertical: 30, flexDirection: 'row', flexWrap: 'wrap', columnGap: 13, rowGap: 13 },
  galleryItem: { width: '21.5%', alignItems: 'center' },
  galleryImage: { width: '100%', aspectRatio: 1, borderRadius: 8 },
  galleryLabel: { marginTop: 8, color: '#454545', fontSize: 12, lineHeight: 15, textAlign: 'center' },
  menuWrap: { alignItems: 'center', paddingTop: 0 },
  menuPill: { height: 34, minWidth: 96, marginTop: -9, borderRadius: 18, backgroundColor: '#050505', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  menuText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  savingStrip: { marginTop: 6, height: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#edfff4' },
  savingText: { marginLeft: 7, color: '#087238', fontSize: 12, fontWeight: '700' },
  cartRow: { paddingHorizontal: 16, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#efefef' },
  cartCount: { color: '#172033', fontSize: 16, fontWeight: '700' },
  packageList: { paddingHorizontal: 16, paddingTop: 4 },
  packageCard: { marginTop: 14 },
  packageContent: { flexDirection: 'row', padding: 0 },
  packageCopy: { flex: 1, paddingRight: 12 },
  packageTitle: { color: '#172033', fontSize: 18, fontWeight: '700' },
  packageRating: { marginTop: 5, flexDirection: 'row', alignItems: 'center' },
  packageRatingText: { marginLeft: 5, color: '#5d6470', fontSize: 13 },
  packagePrice: { marginTop: 5, color: '#172033', fontSize: 15, fontWeight: '700' },
  packageTime: { color: '#9aa2b1', fontWeight: '400' },
  featureDivider: { marginTop: 11, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  featureText: { marginTop: 9, color: '#556074', fontSize: 14, lineHeight: 20 },
  packageSide: { width: 122 },
  packageImage: { width: 118, height: 118, borderRadius: 8 },
});
