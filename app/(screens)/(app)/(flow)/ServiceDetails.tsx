import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Menu, Star, Tag, X } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import {
  formatPhotographyPrice,
  photographyCartServiceFromPackage,
  photographyGallery,
  photographyHeroImages,
  photographyPackages,
} from '@/lib/photographyCatalog';
import { useCartStore } from '@/store/cartStore';

export default function ServiceDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { serviceName } = useLocalSearchParams<{ serviceName?: string }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const eventServices = useCartStore((state) => state.eventServices);
  const addEventService = useCartStore((state) => state.addEventService);
  const removeEventService = useCartStore((state) => state.removeEventService);
  const title = serviceName || 'Photography';

  const togglePackage = (item: (typeof photographyPackages)[number]) => {
    const serviceId = `photography-${item.id}`;
    if (eventServices.some((service) => service.id === serviceId)) {
      removeEventService(serviceId);
      return;
    }

    addEventService(photographyCartServiceFromPackage(item));
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 0) + 28 }}>
        <View style={styles.hero}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={({ nativeEvent }) => setActiveHeroIndex(Math.round(nativeEvent.contentOffset.x / screenWidth))}
          >
            {photographyHeroImages.map((image, index) => <Image key={index} source={image} resizeMode="cover" style={[styles.heroImage, { width: screenWidth }]} />)}
          </ScrollView>
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/EventServices'))} style={styles.heroBack} accessibilityLabel="Go back">
            <ChevronLeft size={26} color="#3f3f3f" strokeWidth={2.4} />
          </Pressable>
          <View style={styles.pager}>
            {photographyHeroImages.map((_, index) => <View key={index} style={[styles.pagerLine, index === activeHeroIndex && styles.pagerActive]} />)}
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.titleRating}><Star size={20} color="#ffba00" fill="#ffba00" strokeWidth={1.8} /><Text style={styles.titleRatingText}>4.8 (20K bookings)</Text></View>
        </View>

        <View style={styles.divider} />
        <View style={styles.gallery}>
          {photographyGallery.map((item, index) => (
            <View key={`${item.label}-${index}`} style={styles.galleryItem}>
              <Image source={item.image} resizeMode="cover" style={styles.galleryImage} />
              <Text numberOfLines={2} style={styles.galleryLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.menuAnchor}>
          <Pressable accessibilityRole="button" onPress={() => setMenuOpen(true)} style={styles.menuPill}><Menu size={18} color="#ffffff" /><Text style={styles.menuText}>Menu</Text></Pressable>
        </View>
        <View style={styles.savingStrip}><Tag size={15} color="#07823d" fill="#07823d" strokeWidth={2} /><Text style={styles.savingText}>Save 10% on every order get Plus now</Text></View>

        <View style={styles.cartRow}>
          <Text style={styles.cartCount}>{eventServices.length} Service{eventServices.length === 1 ? '' : 's'} added</Text>
          <Button className="h-12 w-[148px] rounded-lg bg-[#ff9b46]" onPress={() => router.navigate('/Cart')}><Text className="text-[16px] font-bold text-white">View cart</Text></Button>
        </View>

        <View style={styles.packageList}>
          {photographyPackages.map((item) => {
            const isAdded = eventServices.some((service) => service.id === `photography-${item.id}`);
            return (
              <View key={item.id}>
                <Card style={styles.packageCard} className="border-0 bg-white shadow-none">
                <CardContent style={styles.packageContent}>
                  <Pressable style={styles.packageCopy} onPress={() => router.navigate({ pathname: '/PhotographyPackageDetails', params: { packageId: item.id, packageName: item.title } })}>
                    <Text style={styles.packageTitle}>{item.title}</Text>
                    <View style={styles.packageRating}><Star size={17} color="#ffba00" fill="#ffba00" strokeWidth={1.8} /><Text style={styles.packageRatingText}>4.8 (156)</Text></View>
                    <Text style={styles.packagePrice}>Starts at {formatPhotographyPrice(item.price)} <Text style={styles.packageTime}>- {item.time}</Text></Text>
                    <View style={styles.featureDivider} />
                    <Text style={styles.featureText}>• Perfect for small{`\n`}   celebrations.Includes candid..</Text>
                    <Text style={styles.featureText}>• Perfect for small{`\n`}   celebrations.Includes candid..</Text>
                  </Pressable>
                  <View style={styles.packageSide}>
                    <Image source={item.image} resizeMode="cover" style={styles.packageImage} />
                    <Pressable accessibilityRole="button" onPress={() => togglePackage(item)} style={[styles.packageAddButton, isAdded && styles.packageAddButtonAdded]}>
                      <Text style={[styles.packageAddLabel, isAdded && styles.packageAddLabelAdded]}>{isAdded ? 'Added' : 'Add'}</Text>
                    </Pressable>
                  </View>
                </CardContent>
                </Card>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.menuModal}>
            <View style={styles.menuGrid}>
              {photographyGallery.concat([photographyGallery[0]]).map((item, index) => (
                <Pressable key={`${item.label}-${index}`} onPress={() => setMenuOpen(false)} style={styles.menuOption}>
                  <Image source={item.image} resizeMode="cover" style={styles.menuOptionImage} />
                  <Text numberOfLines={2} style={styles.menuOptionText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Close menu" onPress={() => setMenuOpen(false)} style={styles.closeMenuButton}>
            <X size={25} color="#111111" strokeWidth={2.6} />
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  hero: { height: 216, overflow: 'hidden', position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroBack: { position: 'absolute', left: 18, top: 12, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  pager: { position: 'absolute', bottom: 11, left: 18, right: 18, flexDirection: 'row', gap: 4 },
  pagerLine: { flex: 1, height: 4, borderRadius: 3, backgroundColor: '#505050' },
  pagerActive: { backgroundColor: '#ffffff' },
  titleSection: { paddingHorizontal: 16, paddingVertical: 28 },
  title: { color: '#121212', fontSize: 20, lineHeight: 25, fontWeight: '700' },
  titleRating: { marginTop: 7, flexDirection: 'row', alignItems: 'center' },
  titleRatingText: { marginLeft: 6, color: '#666666', fontSize: 14, lineHeight: 18 },
  divider: { height: 6, backgroundColor: '#f4f4f4' },
  gallery: { paddingHorizontal: 18, paddingTop: 28, paddingBottom: 25, flexDirection: 'row', flexWrap: 'wrap', columnGap: 13, rowGap: 13 },
  galleryItem: { width: '21.5%', alignItems: 'center' },
  galleryImage: { width: '100%', aspectRatio: 1, borderRadius: 8 },
  galleryLabel: { marginTop: 8, color: '#454545', fontSize: 12, lineHeight: 15, textAlign: 'center' },
  menuAnchor: { height: 28, alignItems: 'center', borderTopWidth: 6, borderTopColor: '#f4f4f4' },
  menuPill: { position: 'absolute', top: -12, alignSelf: 'center', height: 34, minWidth: 96, borderRadius: 18, backgroundColor: '#050505', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, zIndex: 1 },
  menuText: { color: '#ffffff', fontSize: 14, lineHeight: 18, fontWeight: '700' },
  savingStrip: { height: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#edfff4' },
  savingText: { marginLeft: 7, color: '#087238', fontSize: 12, lineHeight: 16, fontWeight: '700' },
  cartRow: { paddingHorizontal: 16, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#efefef' },
  cartCount: { color: '#172033', fontSize: 16, lineHeight: 20, fontWeight: '700' },
  packageList: { gap: 22, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  packageCard: { marginTop: 0 },
  packageContent: { flexDirection: 'row', padding: 0 },
  packageCopy: { flex: 1, paddingRight: 12 },
  packageTitle: { color: '#172033', fontSize: 18, lineHeight: 22, fontWeight: '700' },
  packageRating: { marginTop: 5, flexDirection: 'row', alignItems: 'center' },
  packageRatingText: { marginLeft: 5, color: '#5d6470', fontSize: 13, lineHeight: 17 },
  packagePrice: { marginTop: 5, color: '#172033', fontSize: 15, lineHeight: 19, fontWeight: '700' },
  packageTime: { color: '#9aa2b1', fontWeight: '400' },
  featureDivider: { marginTop: 11, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  featureText: { marginTop: 9, color: '#556074', fontSize: 14, lineHeight: 20 },
  packageSide: { width: 122 },
  packageImage: { width: 118, height: 118, borderRadius: 8 },
  packageAddButton: { width: 92, height: 36, alignSelf: 'center', marginTop: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ff5a2a', borderRadius: 4, backgroundColor: '#ffffff' },
  packageAddButtonAdded: { backgroundColor: '#ff553a' },
  packageAddLabel: { color: '#ff5a2a', fontSize: 15, lineHeight: 19, fontWeight: '500' },
  packageAddLabelAdded: { color: '#ffffff' },
  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  menuModal: { width: '83%', padding: 20, borderRadius: 8, backgroundColor: '#ffffff' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 22 },
  menuOption: { width: '28%', alignItems: 'center' },
  menuOptionImage: { width: 80, height: 80, borderRadius: 8 },
  menuOptionText: { color: '#3f4653', fontSize: 13, lineHeight: 16, textAlign: 'center', marginTop: 9 },
  closeMenuButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18, marginTop: 12, backgroundColor: '#ffffff' },
});
