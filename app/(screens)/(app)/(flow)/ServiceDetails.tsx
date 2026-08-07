import { useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Menu, Star, Tag, X } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { getHomeFeaturedProducts } from '@/api/home';
import { getMediaUrl } from '@/utils/image';
import { photographyPackages } from '@/lib/photographyCatalog';
import { useCartStore } from '@/store/cartStore';
import ServiceSkeleton from '@/app/skeleton/ServiceSkeleton';

const truncate30Words = (text?: string): string => {
  if (!text) return '';
  const clean = text.trim();
  const words = clean.split(/\s+/);
  if (words.length > 30) {
    return words.slice(0, 30).join(' ') + '...';
  }
  return clean;
};

function extractActualPrice(p: any): number {
  const raw = p.price || p.priceBookEntry || p.priceSlabs;
  if (Array.isArray(raw) && raw.length > 0) {
    const valid = raw.find((e: any) => e && (e.salePrice || e.regularPrice || e.listPrice || e.price));
    const val = Number(valid?.salePrice ?? valid?.regularPrice ?? valid?.listPrice ?? valid?.price ?? 0);
    if (val > 0) return val;
  }
  if (typeof raw === 'number' && raw > 0) return raw;
  if (typeof raw === 'object' && raw !== null) {
    const val = Number(raw.salePrice ?? raw.regularPrice ?? raw.listPrice ?? raw.price ?? 0);
    if (val > 0) return val;
  }
  return 0;
}

const getCategoryFallbackItems = (catTitle: string) => {
  const norm = (catTitle || '').toLowerCase();
  if (norm.includes('tent') || norm.includes('canopy')) {
    return [
      { id: '67', title: 'Wedding Tent', price: 6999, rating: '4.8 (1.2k)', description: 'Waterproof luxury tent setup with ceiling drape work & lighting.', image: 'https://freaky-files.s3.ap-south-1.amazonaws.com/product-banners/wedding-tent.png' },
      { id: '68', title: 'Haldi & Mehndi Canopy', price: 4999, rating: '4.8 (1.2k)', description: 'Vibrant marigold & yellow canopy setup for Haldi ceremonies.', image: 'https://freaky-files.s3.ap-south-1.amazonaws.com/product-banners/haldi-canopy.png' },
      { id: '69', title: 'Cocktail Party Canopy', price: 5999, rating: '4.8 (1.2k)', description: 'Modern waterproof canopy with ambient LED fairy lights.', image: 'https://freaky-files.s3.ap-south-1.amazonaws.com/product-banners/cocktail-canopy.png' },
    ];
  }
  if (norm.includes('dj') || norm.includes('music') || norm.includes('band')) {
    return [
      { id: '50', title: 'Wedding DJ', price: 11999, rating: '4.8 (1.2k)', description: 'Professional DJ setup with party lights, mixer & JBL sound.', image: 'https://freaky-files.s3.ap-south-1.amazonaws.com/product-banners/wedding-dj.png' },
      { id: '15', title: 'Live Music & Band', price: 8999, rating: '4.8 (1.2k)', description: 'Live musical band with vocal singer, guitar & keyboard setup.', image: 'https://freaky-files.s3.ap-south-1.amazonaws.com/product-banners/live-music.png' },
      { id: '45', title: 'Party DJ', price: 9999, rating: '4.8 (1.2k)', description: 'Top DJ with party lights, sound mixer & fog machine.', image: 'https://freaky-files.s3.ap-south-1.amazonaws.com/product-banners/party-dj.png' },
    ];
  }
  if (norm.includes('decor')) {
    return [
      { id: '20', title: 'Luxury Wedding Stage Decor', price: 25000, rating: '4.8 (1.2k)', description: 'Royal stage backdrop with fresh flowers & chandelier lighting.', image: 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/wedding.png' },
      { id: '21', title: 'Floral Entrance Gate', price: 599, rating: '4.8 (1.2k)', description: 'Grand flower arch entrance with carpet aisle runner.', image: 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/birthday.png' },
      { id: '22', title: 'Premium Reception Setup', price: 15999, rating: '4.8 (1.2k)', description: 'Complete reception venue styling with LED drop lights.', image: 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/house-party.png' },
    ];
  }
  return [
    { id: '11', title: `${catTitle} Package`, price: 4999, rating: '4.8 (1.2k)', description: 'Complete verified professional setup & full event coverage.', image: 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/wedding.png' },
    { id: '12', title: `${catTitle} Premium Setup`, price: 7999, rating: '4.8 (1.2k)', description: 'Full event setup with premium equipment & coordinator.', image: 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/birthday.png' },
  ];
};

export default function ServiceDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { serviceName } = useLocalSearchParams<{ serviceName?: string }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const eventServices = useCartStore((state) => state.eventServices);
  const addEventService = useCartStore((state) => state.addEventService);
  const removeEventService = useCartStore((state) => state.removeEventService);
  const title = serviceName || 'Featured Services';

  // Fetch real featured products & package items from DB
  const { data: featuredData, isLoading, isFetching } = useQuery({
    queryKey: ['service-details-products'],
    queryFn: getHomeFeaturedProducts,
    staleTime: 60_000,
  });

  const dbProducts = useMemo(() => {
    const categories = featuredData?.data;
    if (!Array.isArray(categories) || categories.length === 0) return [];

    const normTitle = (title || '').toLowerCase();
    const matchedProducts: any[] = [];

    const isMatchingCategory = (cTitle: string, pTitle: string) => {
      const cat = cTitle.toLowerCase();
      const prod = pTitle.toLowerCase();

      if (normTitle.includes('tent') || normTitle.includes('canopy')) {
        return cat.includes('tent') || cat.includes('canopy') || prod.includes('tent') || prod.includes('canopy');
      }
      if (normTitle.includes('dj') || normTitle.includes('music') || normTitle.includes('sound')) {
        return cat.includes('dj') || cat.includes('music') || prod.includes('dj') || prod.includes('music') || prod.includes('sound');
      }
      if (normTitle.includes('decor') || normTitle.includes('flower') || normTitle.includes('stage')) {
        return cat.includes('decor') || prod.includes('decor') || prod.includes('flower') || prod.includes('entrance') || prod.includes('stage');
      }
      if (normTitle.includes('photo') || normTitle.includes('camera') || normTitle.includes('shoot')) {
        return cat.includes('photo') || prod.includes('photo') || prod.includes('camera') || prod.includes('shoot');
      }
      if (normTitle.includes('artist') || normTitle.includes('singer') || normTitle.includes('band') || normTitle.includes('performer')) {
        return cat.includes('artist') || cat.includes('performer') || prod.includes('singer') || prod.includes('band') || prod.includes('dance');
      }
      if (normTitle.includes('kid') || normTitle.includes('clown') || normTitle.includes('magic')) {
        return cat.includes('kid') || prod.includes('kid') || prod.includes('magic') || prod.includes('clown');
      }

      return cat.includes(normTitle) || normTitle.includes(cat) || prod.includes(normTitle);
    };

    categories.forEach((cat: any) => {
      const catTitle = cat.title || cat.name || '';
      if (Array.isArray(cat?.products)) {
        cat.products.forEach((p: any) => {
          const prodTitle = p?.title || p?.name || '';
          if (prodTitle && isMatchingCategory(catTitle, prodTitle)) {
            const actualPrice = extractActualPrice(p);
            const titleLower = prodTitle.toLowerCase();
            const fallbackPrice = titleLower.includes('tent') ? 6999 : titleLower.includes('decor') ? 15999 : titleLower.includes('dj') ? 11999 : titleLower.includes('band') || titleLower.includes('singer') ? 8999 : titleLower.includes('magician') || titleLower.includes('dance') ? 4999 : 5999;
            const finalPrice = actualPrice > 0 ? actualPrice : fallbackPrice;

            matchedProducts.push({
              id: String(p.productId || p.id),
              title: prodTitle,
              price: finalPrice,
              rating: p.rating ? `${Number(p.rating).toFixed(1)} (1.2k)` : '4.8 (1.2k)',
              description: p.description || 'Includes complete service setup, verified professionals & quality assurance.',
              image: getMediaUrl(p.bannerImage || p.mediaURL || p.image) || 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/wedding.png',
            });
          }
        });
      }
    });

    const uniqueMap = new Map();
    matchedProducts.forEach((item) => uniqueMap.set(item.id, item));
    return Array.from(uniqueMap.values());
  }, [featuredData, title]);

  const displayItems = useMemo(() => {
    if (dbProducts.length > 0) return dbProducts;
    return getCategoryFallbackItems(title);
  }, [dbProducts, title]);

  // Generate dynamic category shortcuts from actual products
  const galleryShortcuts = useMemo(() => {
    return displayItems.slice(0, 8).map((item) => ({
      id: item.id,
      label: item.title,
      imageUri: item.image,
    }));
  }, [displayItems]);

  const heroImages = useMemo(() => {
    const images = displayItems.map((item) => item.image).filter(Boolean);
    return images.length > 0 ? images.slice(0, 3) : ['https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/wedding.png'];
  }, [displayItems]);

  const togglePackageItem = (item: any) => {
    const cartId = `db-service-${item.id}`;
    if (eventServices.some((service) => service.id === cartId)) {
      removeEventService(cartId);
      return;
    }

    addEventService({
      id: cartId,
      title: item.title,
      packageName: title,
      price: item.price,
      imageUri: item.image,
      features: [
        { icon: 'star', label: 'Verified event professional' },
        { icon: 'clock', label: 'Full event time coverage' },
        { icon: 'sparkles', label: 'Complete equipment setup' },
      ],
    });
  };

  if (isLoading || isFetching) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top']}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#172033', marginBottom: 8 }}>{title}</Text>
          {Array.from({ length: 4 }).map((_, i) => (
            <ServiceSkeleton key={i} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 0) + 28 }}>
        {/* Dynamic Hero Banner Carousel */}
        <View style={styles.hero}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={({ nativeEvent }) => setActiveHeroIndex(Math.round(nativeEvent.contentOffset.x / screenWidth))}
          >
            {heroImages.map((imageUri, index) => (
              <Image key={index} source={{ uri: imageUri }} resizeMode="cover" style={[styles.heroImage, { width: screenWidth }]} />
            ))}
          </ScrollView>
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/EventServices'))} style={styles.heroBack} accessibilityLabel="Go back">
            <ChevronLeft size={26} color="#3f3f3f" strokeWidth={2.4} />
          </Pressable>
          <View style={styles.pager}>
            {heroImages.map((_, index) => (
              <View key={index} style={[styles.pagerLine, index === activeHeroIndex && styles.pagerActive]} />
            ))}
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.titleRating}>
            <Star size={20} color="#ffba00" fill="#ffba00" strokeWidth={1.8} />
            <Text style={styles.titleRatingText}>4.8 (2.4k bookings)</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Dynamic Sub-Category Shortcut Icons */}
        <View style={styles.gallery}>
          {galleryShortcuts.map((item, index) => (
            <Pressable
              key={`${item.id}-${index}`}
              style={styles.galleryItem}
              onPress={() => router.navigate({ pathname: '/PhotographyPackageDetails', params: { packageId: item.id, packageName: item.label } })}
            >
              <Image source={{ uri: item.imageUri }} resizeMode="cover" style={styles.galleryImage} />
              <Text numberOfLines={2} style={styles.galleryLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.menuAnchor}>
          <Pressable accessibilityRole="button" onPress={() => setMenuOpen(true)} style={styles.menuPill}>
            <Menu size={18} color="#ffffff" />
            <Text style={styles.menuText}>Menu</Text>
          </Pressable>
        </View>
        <View style={styles.savingStrip}>
          <Tag size={15} color="#07823d" fill="#07823d" strokeWidth={2} />
          <Text style={styles.savingText}>Save 10% on every order get Plus now</Text>
        </View>

        <View style={styles.cartRow}>
          <Text style={styles.cartCount}>{eventServices.length} Service{eventServices.length === 1 ? '' : 's'} added</Text>
          <Button className="h-12 w-[148px] rounded-lg bg-[#ff9b46]" onPress={() => router.navigate('/Cart')}>
            <Text className="text-[16px] font-bold text-white">View cart</Text>
          </Button>
        </View>

        {/* Product Cards List */}
        <View style={styles.packageList}>
          {displayItems.map((item: any) => {
            const isAdded = eventServices.some((service) => service.id === `db-service-${item.id}`);
            return (
              <View key={item.id}>
                <Card style={styles.packageCard} className="border-0 bg-white shadow-none">
                  <CardContent style={styles.packageContent}>
                    <Pressable style={styles.packageCopy} onPress={() => router.navigate({ pathname: '/PhotographyPackageDetails', params: { packageId: item.id, packageName: item.title } })}>
                      <Text style={styles.packageTitle}>{item.title}</Text>
                      <View style={styles.packageRating}>
                        <Star size={17} color="#ffba00" fill="#ffba00" strokeWidth={1.8} />
                        <Text style={styles.packageRatingText}>{item.rating}</Text>
                      </View>
                      <Text style={styles.packagePrice}>Starts at ₹{Number(item.price).toLocaleString('en-IN')}</Text>
                      <View style={styles.featureDivider} />
                      <Text style={styles.featureText}>{truncate30Words(item.description)}</Text>
                    </Pressable>
                    <View style={styles.packageSide}>
                      <Image source={{ uri: item.image }} resizeMode="cover" style={styles.packageImage} />
                      <Pressable accessibilityRole="button" onPress={() => togglePackageItem(item)} style={[styles.packageAddButton, isAdded && styles.packageAddButtonAdded]}>
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

      {/* Dynamic Menu Modal */}
      {menuOpen && (
        <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={() => setMenuOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.menuModal}>
              <View style={styles.menuGrid}>
                {galleryShortcuts.map((item, index) => (
                  <Pressable
                    key={`${item.id}-${index}`}
                    onPress={() => {
                      setMenuOpen(false);
                      router.navigate({ pathname: '/PhotographyPackageDetails', params: { packageId: item.id, packageName: item.label } });
                    }}
                    style={styles.menuOption}
                  >
                    <Image source={{ uri: item.imageUri }} resizeMode="cover" style={styles.menuOptionImage} />
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
      )}
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
  titleRating: { flexDirection: 'row', alignItems: 'center', marginTop: 7 },
  titleRatingText: { marginLeft: 7, color: '#737373', fontSize: 16, lineHeight: 20, fontWeight: '600' },
  divider: { height: 6, backgroundColor: '#f5f5f7' },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingTop: 16, rowGap: 14, columnGap: 8 },
  galleryItem: { width: '23%', alignItems: 'center' },
  galleryImage: { width: '100%', aspectRatio: 1, borderRadius: 11, backgroundColor: '#e2e8f0' },
  galleryLabel: { marginTop: 6, color: '#27272a', fontSize: 11, lineHeight: 14, fontWeight: '600', textAlign: 'center' },
  menuAnchor: { marginTop: 22, alignItems: 'center' },
  menuPill: { height: 36, paddingHorizontal: 16, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#111111' },
  menuText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  savingStrip: { marginTop: 16, marginHorizontal: 16, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#eafbf1' },
  savingText: { color: '#07823d', fontSize: 13, fontWeight: '600' },
  cartRow: { marginTop: 16, marginHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cartCount: { color: '#172033', fontSize: 16, fontWeight: '700' },
  packageList: { marginTop: 16, paddingHorizontal: 16, gap: 16 },
  packageCard: { padding: 0, marginBottom: 8 },
  packageContent: { flexDirection: 'row', justifyContent: 'space-between', padding: 0 },
  packageCopy: { flex: 1, paddingRight: 12 },
  packageTitle: { color: '#172033', fontSize: 17, lineHeight: 21, fontWeight: '700' },
  packageRating: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  packageRatingText: { marginLeft: 5, color: '#64748b', fontSize: 13 },
  packagePrice: { marginTop: 6, color: '#172033', fontSize: 15, fontWeight: '700' },
  featureDivider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 8 },
  featureText: { color: '#64748b', fontSize: 13, lineHeight: 18 },
  packageSide: { width: 100, alignItems: 'center' },
  packageImage: { width: 100, height: 100, borderRadius: 12, backgroundColor: '#e2e8f0' },
  packageAddButton: { marginTop: 8, height: 32, width: 80, borderRadius: 8, borderWidth: 1, borderColor: '#ff9b46', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  packageAddButtonAdded: { backgroundColor: '#ff9b46' },
  packageAddLabel: { color: '#ff9b46', fontSize: 13, fontWeight: '700' },
  packageAddLabelAdded: { color: '#ffffff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40 },
  menuModal: { width: '90%', borderRadius: 20, backgroundColor: '#ffffff', padding: 16, marginBottom: 16 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 14, columnGap: 8 },
  menuOption: { width: '23%', alignItems: 'center' },
  menuOptionImage: { width: '100%', aspectRatio: 1, borderRadius: 11, backgroundColor: '#e2e8f0' },
  menuOptionText: { marginTop: 4, color: '#27272a', fontSize: 11, lineHeight: 14, fontWeight: '600', textAlign: 'center' },
  closeMenuButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
});
