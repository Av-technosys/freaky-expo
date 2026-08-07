import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronLeft, ChevronRight, CircleCheck, ImageIcon, Share2, Star, Video, Sparkles, Plus } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import {
  formatPhotographyPrice,
  photographyHeroImages,
  photographyPackages,
  photographySampleImages,
} from '@/lib/photographyCatalog';
import { useCartStore } from '@/store/cartStore';
import { getProductsByProductId } from '@/api/product';
import { getMediaUrl } from '@/utils/image';
import { createEventItem } from '@/api/event';

const FALLBACK_ADD_ONS = [
  { id: 'video', title: 'Cinematic Highlight Video', price: 2499, description: '30-60 sec cinematic highlight video of your event.', icon: Video },
  { id: 'album', title: 'Premium Photo Album', price: 3499, description: '12x18 inch premium photo album with 40 pages.', icon: ImageIcon },
  { id: 'drone', title: 'Drone Photography', price: 4999, description: 'Aerial drone shots & videos of your event.', icon: Share2 },
];

function getDynamicInclusions(title: string): string[] {
  const lower = title.toLowerCase();
  if (lower.includes('dj') || lower.includes('music')) {
    return [
      '4 Hours High-Energy DJ Set',
      'Dual 15" JBL Powered Speakers & Subwoofer',
      'Intelligent Moving Head Stage Lights & Fog Machine',
      'Wireless Mikes for Event Host / Anchor',
      'Complete Delivery & Sound Check Included',
    ];
  }
  if (lower.includes('tent') || lower.includes('canopy')) {
    return [
      'Waterproof Luxury Tent & Weatherproof Canopy',
      'Fairy Light & Warm Ambient Chandelier Lighting',
      'Complete Delivery, On-Site Setup & Teardown',
      'Heavy-Duty Aluminum Truss Support Poles',
    ];
  }
  if (lower.includes('decor') || lower.includes('stage') || lower.includes('entrance')) {
    return [
      'Fresh Seasonal Floral Arch & Stage Setup',
      'VIP Entrance Red Carpet & Backdrop Lighting',
      'Custom Color Theme Matching & Drapes',
      'On-Site Professional Floral Stylist Team',
    ];
  }
  if (lower.includes('singer') || lower.includes('band') || lower.includes('artist') || lower.includes('dance')) {
    return [
      '3 Hours Live Vocal & Band Performance',
      'Professional Sound Mixer & Wireless Mikes',
      'Acoustic Accompanist & Custom Playlist Requests',
    ];
  }
  if (lower.includes('kid') || lower.includes('magician') || lower.includes('clown')) {
    return [
      'Interactive Kids Magician & Clown Show',
      'Fun Party Games, Dance Props & Balloons',
      'Kid-Friendly Pop Music & Speaker System',
    ];
  }
  return [
    'Full Event Coverage by Verified Professionals',
    'High-Resolution Digital Media Album',
    'Complete Delivery, On-Site Setup & Teardown',
  ];
}

import ProductDetailsSkeleton from '@/app/skeleton/category/ProductDetail';

export default function PhotographyPackageDetails() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { packageName, packageId } = useLocalSearchParams<{ packageName?: string; packageId?: string }>();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const addEventService = useCartStore((state) => state.addEventService);
  const removeEventService = useCartStore((state) => state.removeEventService);
  const eventServices = useCartStore((state) => state.eventServices);

  const [selectedSlabIndex, setSelectedSlabIndex] = useState(0);

  // DB API Query for Product Details, Inclusions & Addons
  const numericProductId = Number(packageId) || (packageId ? Number(String(packageId).replace(/[^0-9]/g, '')) : NaN);
  const productQuery = useQuery({
    queryKey: ['productDetailInfo', numericProductId],
    queryFn: () => getProductsByProductId(numericProductId),
    enabled: Boolean(numericProductId && !isNaN(numericProductId)),
  });

  if (productQuery.isLoading || productQuery.isFetching) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <StatusBar style="dark" />
        <ProductDetailsSkeleton />
      </SafeAreaView>
    );
  }

  const apiProduct = productQuery.data?.product || productQuery.data;

  const title = apiProduct?.title || apiProduct?.name || packageName || 'Event Service';
  const description = apiProduct?.description || 'Includes complete verified professional setup & full event coverage.';
  const rawPrice = apiProduct?.price || 4999;
  const basePrice = typeof rawPrice === 'number' ? rawPrice : Number(String(rawPrice).replace(/[^0-9]/g, '')) || 4999;

  // DB Price Slabs
  const rawSlabs = Array.isArray(apiProduct?.priceSlabs) ? apiProduct.priceSlabs : [];
  const slabs = rawSlabs
    .map((s: any) => ({
      lower: s.lowerSlab ?? 0,
      upper: s.upperSlab ?? Infinity,
      price: Number(s.salePrice || s.regularPrice || s.listPrice || s.price || 0),
    }))
    .filter((s: any) => s.price > 0);

  const selectedSlab = slabs[selectedSlabIndex] || slabs[0];
  const price = selectedSlab ? selectedSlab.price : basePrice;
  const rating = apiProduct?.rating ? `${Number(apiProduct.rating).toFixed(1)} (1.2k)` : '4.8 (1.2k)';

  // DB Inclusions & Addons
  const dbInclusions: string[] = Array.isArray(apiProduct?.inclusions) && apiProduct.inclusions.length > 0
    ? apiProduct.inclusions.map((inc: any) => typeof inc === 'string' ? inc : inc.title || inc.name)
    : ['Full Event Coverage by Verified Professionals', 'Complete Equipment Setup & Sound Check', 'Dedicated Event Coordinator Support'];

  const dbAddons = Array.isArray(apiProduct?.addons) && apiProduct.addons.length > 0
    ? apiProduct.addons.map((add: any, idx: number) => ({
        id: String(add.productId || add.id || idx),
        title: add.title || add.name || 'Addon Service',
        price: add.price ? Number(add.price) : 2499,
        description: add.description || 'Verified addon service.',
        image: getMediaUrl(add.bannerImage || add.mediaURL || add.image),
      }))
    : [];

  // Banner Images from DB
  const heroImageUri = getMediaUrl(apiProduct?.bannerImage || apiProduct?.mediaURL);
  const heroImages = heroImageUri ? [{ uri: heroImageUri }] : [{ uri: 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/wedding.png' }];

  const serviceId = `package-${numericProductId || packageId || selectedPackage.id}`;
  const isAdded = eventServices.some((service) => service.id === serviceId);
  const heroWidth = screenWidth - 28;

  // Aggregate selected add-on prices from DB
  const selectedAddOnsTotal = dbAddons
    .filter((addOn: any) => selectedAddOns.includes(addOn.id))
    .reduce((sum: number, addOn: any) => sum + (Number(addOn.price) || 0), 0);

  const totalPrice = price + selectedAddOnsTotal;

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const toggleService = async () => {
    if (isAdded) {
      removeEventService(serviceId);
      return;
    }

    const selectedAddonObjList = dbAddons.filter((a: any) => selectedAddOns.includes(a.id));

    addEventService({
      id: serviceId,
      title: selectedAddonObjList.length > 0 ? `${title} (+ ${selectedAddonObjList.length} Add-ons)` : title,
      packageName: title,
      price: totalPrice,
      imageUri: heroImages[0] ? (typeof heroImages[0] === 'number' ? Image.resolveAssetSource(heroImages[0]).uri : heroImages[0].uri) : '',
      features: [
        ...dbInclusions.slice(0, 2).map((lbl) => ({ icon: 'star', label: lbl })),
        ...selectedAddonObjList.map((a: any) => ({ icon: 'sparkles', label: `Addon: ${a.title}` })),
      ],
    });

    // Persist Main Product + Selected Add-ons to DB
    try {
      if (numericProductId && !isNaN(numericProductId)) {
        await createEventItem({
          targetCategoryId: numericProductId,
          minGuestCount: selectedSlab?.lower || 10,
          maxGuestCount: selectedSlab?.upper && isFinite(selectedSlab.upper) ? selectedSlab.upper : 100,
          contactName: 'User Booking',
          contactNumber: '9999999999',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 86400000).toISOString(),
        });

        // Persist drafts for each checked add-on product in DB
        for (const addOn of selectedAddonObjList) {
          const addOnNumId = Number(addOn.id);
          if (addOnNumId && !isNaN(addOnNumId)) {
            await createEventItem({
              targetCategoryId: addOnNumId,
              minGuestCount: 10,
              maxGuestCount: 100,
              contactName: 'Addon Booking',
              contactNumber: '9999999999',
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 86400000).toISOString(),
            });
          }
        }
      }
    } catch (e) {
      console.log('Backend draft save error:', e);
    }

    router.navigate({ pathname: '/ServiceAddedConfirmation', params: { packageId: String(numericProductId || packageId), packageName: title } });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 0) + 16 }}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/ServiceDetails'))} style={styles.iconButton} accessibilityLabel="Go back">
            <ChevronLeft size={24} color="#111111" />
          </Pressable>
          <Pressable style={styles.shareButton} accessibilityLabel="Share package">
            <Share2 size={18} color="#344054" />
          </Pressable>
        </View>

        {/* Compact Hero Banner Slider */}
        <View style={styles.heroWrap}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={({ nativeEvent }) => setActiveImageIndex(Math.round(nativeEvent.contentOffset.x / heroWidth))}
          >
            {heroImages.map((imageSource: any, index: number) => (
              <Image key={index} source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource} resizeMode="cover" style={[styles.heroImage, { width: heroWidth }]} />
            ))}
          </ScrollView>
          <View style={styles.photoCount}>
            <Text style={styles.photoCountText}>{activeImageIndex + 1} / {heroImages.length}</Text>
          </View>
        </View>
        <View style={styles.dots}>
          {heroImages.map((_: any, index: number) => (
            <View key={index} style={[styles.dot, index === activeImageIndex && styles.dotActive]} />
          ))}
        </View>

        {/* Compact Main Details */}
        <View style={styles.details}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.meta}>
            <Star size={16} color="#ffba00" fill="#ffba00" />
            <Text style={styles.metaText}>{rating}</Text>
            <View style={styles.metaDivider} />
            <Text style={styles.metaText}>◷ 150+ Booked</Text>
          </View>

          <Text style={styles.description}>{description}</Text>

          {slabs.length > 0 ? (
            <View style={{ marginTop: 14 }}>
              <Text style={styles.sectionTitle}>Select Guest Capacity Tier</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 8 }}>
                {slabs.map((slab: any, idx: number) => {
                  const isSelected = selectedSlabIndex === idx;
                  const label = slab.upper && isFinite(slab.upper) ? `${slab.lower} - ${slab.upper} Guests` : `${slab.lower}+ Guests`;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => setSelectedSlabIndex(idx)}
                      style={[
                        { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#f8fafc' },
                        isSelected && { borderColor: '#ff5a2a', backgroundColor: '#fff0ea' },
                      ]}
                    >
                      <Text style={[{ fontSize: 13, fontWeight: '600', color: '#334155' }, isSelected && { color: '#ff5a2a' }]}>{label}</Text>
                      <Text style={[{ fontSize: 12, fontWeight: '700', color: '#64748b', marginTop: 2 }, isSelected && { color: '#ff5a2a' }]}>₹{slab.price.toLocaleString('en-IN')}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>What's Included</Text>
          {dbInclusions.map((item: string, idx: number) => (
            <View key={idx} style={styles.includedRow}>
              <CircleCheck size={16} color="#16b364" />
              <Text style={styles.includedText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Sticky Action Bar */}
        <View style={styles.selectionBar}>
          <View>
            <Text style={styles.selectionCount}>
              {selectedAddOns.length > 0 ? `Base + ${selectedAddOns.length} Add-on${selectedAddOns.length === 1 ? '' : 's'}` : (isAdded ? '1 Service Added' : 'Total Package Price')}
            </Text>
            <Text style={styles.selectionPrice}>₹{totalPrice.toLocaleString('en-IN')}</Text>
          </View>
          <Button className={`h-11 w-[120px] rounded-lg ${isAdded ? 'bg-[#ff6d4a]' : 'bg-[#ff9b46]'}`} onPress={toggleService}>
            <Text className="text-[15px] font-bold text-white">{isAdded ? 'Added ✓' : 'Add to Cart'}</Text>
          </Button>
        </View>

        {/* Sample Work Photos */}
        <View style={styles.sampleHeader}>
          <Text style={styles.sectionTitle}>Sample Photos</Text>
          <Pressable style={styles.viewAll}>
            <Text style={styles.viewAllText}>View all</Text>
            <ChevronRight size={16} color="#44546b" />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.samples}>
          {photographySampleImages.map((image, index) => (
            <Image key={index} source={image} resizeMode="cover" style={styles.sampleImage} />
          ))}
        </ScrollView>

        {/* DB Add-ons Section */}
        <View style={styles.addOns}>
          <Text style={styles.sectionTitle}>Add-ons (Optional)</Text>
          {dbAddons.map((addOn: any) => {
            const selected = selectedAddOns.includes(addOn.id);
            return (
              <Pressable key={addOn.id} onPress={() => toggleAddOn(addOn.id)}>
                <Card style={styles.addOnCard} className="border-[#e5e7eb] bg-white shadow-none">
                  <CardContent style={styles.addOnContent}>
                    {addOn.image ? (
                      <Image source={{ uri: addOn.image }} style={styles.addOnImage} resizeMode="cover" />
                    ) : (
                      <View style={styles.addOnIcon}>
                        <Sparkles size={20} color="#ff5a2a" strokeWidth={1.8} />
                      </View>
                    )}
                    <View style={styles.addOnCopy}>
                      <View style={styles.addOnTitleRow}>
                        <Text style={styles.addOnTitle}>{addOn.title}</Text>
                        <Text style={styles.addOnPrice}>+ ₹{Number(addOn.price).toLocaleString('en-IN')}</Text>
                      </View>
                      <Text style={styles.addOnDescription} numberOfLines={2}>{addOn.description}</Text>
                    </View>
                    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                      {selected ? <Check size={14} color="#ffffff" strokeWidth={3} /> : <Plus size={14} color="#94a3b8" />}
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
  topBar: { height: 48, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  shareButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  heroWrap: { marginHorizontal: 14, height: 245, overflow: 'hidden', borderRadius: 14 },
  heroImage: { height: 245 },
  photoCount: { position: 'absolute', right: 8, bottom: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 7, paddingVertical: 4 },
  photoCountText: { color: '#ffffff', fontSize: 11, fontWeight: '600' },
  dots: { marginTop: 10, flexDirection: 'row', justifyContent: 'center', gap: 4 },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#dbe2eb' },
  dotActive: { backgroundColor: '#263449', width: 14 },
  details: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 2 },
  title: { color: '#172033', fontSize: 22, lineHeight: 26, fontWeight: '700' },
  meta: { marginTop: 6, flexDirection: 'row', alignItems: 'center' },
  metaText: { marginLeft: 4, color: '#344054', fontSize: 13, fontWeight: '600' },
  metaDivider: { width: 1, height: 14, marginHorizontal: 10, backgroundColor: '#cbd5e1' },
  description: { marginTop: 12, color: '#475569', fontSize: 14, lineHeight: 20 },
  sectionTitle: { marginTop: 16, color: '#172033', fontSize: 17, lineHeight: 21, fontWeight: '700' },
  includedRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center' },
  includedText: { marginLeft: 7, color: '#334155', fontSize: 14, lineHeight: 18 },
  selectionBar: { marginTop: 14, minHeight: 62, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fafafa' },
  selectionCount: { color: '#64748b', fontSize: 13, fontWeight: '500' },
  selectionPrice: { marginTop: 2, color: '#0f172a', fontSize: 18, fontWeight: '700' },
  sampleHeader: { marginTop: 16, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  viewAll: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { color: '#44546b', fontSize: 13 },
  samples: { gap: 8, paddingHorizontal: 14, paddingTop: 10, paddingRight: 24 },
  sampleImage: { width: 110, height: 150, borderRadius: 6 },
  addOns: { paddingHorizontal: 14, paddingTop: 16, gap: 10 },
  addOnCard: { borderRadius: 8 },
  addOnContent: { minHeight: 76, padding: 12, flexDirection: 'row', alignItems: 'center' },
  addOnImage: { width: 44, height: 44, borderRadius: 6 },
  addOnIcon: { width: 44, height: 44, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0ea' },
  addOnCopy: { flex: 1, marginLeft: 10, paddingRight: 6 },
  addOnTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addOnTitle: { flex: 1, color: '#172033', fontSize: 15, fontWeight: '700' },
  addOnPrice: { marginLeft: 6, color: '#ff5a2a', fontSize: 14, fontWeight: '700' },
  addOnDescription: { marginTop: 2, color: '#64748b', fontSize: 12, lineHeight: 16 },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  checkboxSelected: { backgroundColor: '#ff5a2a', borderColor: '#ff5a2a' },
});
