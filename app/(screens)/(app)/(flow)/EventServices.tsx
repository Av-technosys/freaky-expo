import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Star } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { getAllFeaturedProducts } from '@/api/product';
import { getMediaUrl } from '@/utils/image';
import ServiceSkeleton from '@/app/skeleton/ServiceSkeleton';

function extractStartingPrice(p: any): number {
  const raw = p.price || p.priceBookEntry || p.priceSlabs;
  if (Array.isArray(raw) && raw.length > 0) {
    const validPrices = raw
      .map((e: any) => Number(e.salePrice ?? e.regularPrice ?? e.listPrice ?? e.price ?? 0))
      .filter((v) => v > 0);
    if (validPrices.length > 0) return Math.min(...validPrices);
  }
  if (typeof raw === 'number' && raw > 0) return raw;
  if (typeof raw === 'object' && raw !== null) {
    const val = Number(raw.salePrice ?? raw.regularPrice ?? raw.listPrice ?? raw.price ?? 0);
    if (val > 0) return val;
  }
  if (typeof raw === 'string' && raw.trim()) {
    const cleaned = Number(raw.replace(/[^0-9]/g, ''));
    if (cleaned > 0) return cleaned;
  }
  return 0;
}

export default function EventServicesScreen() {
  const insets = useSafeAreaInsets();
  const { eventName } = useLocalSearchParams<{ eventName?: string }>();
  const serviceCardHeight = 96;
  const serviceImageSize = 84;
  const title = eventName || 'Event';

  const { data: featuredResponse, isLoading, isFetching } = useQuery({
    queryKey: ['event-services-featured-products'],
    queryFn: getAllFeaturedProducts,
    staleTime: 60_000,
  });

  const servicesList = useMemo(() => {
    const categories = featuredResponse?.data;
    if (!Array.isArray(categories) || categories.length === 0) {
      return [
        { id: '13', title: 'Decoration', price: 'Starting from ₹4,999', rating: '4.8 (156)', imageUri: 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/wedding.png' },
        { id: '11', title: 'Photography', price: 'Starting from ₹2,999', rating: '4.8 (156)', imageUri: 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/birthday.png' },
        { id: '12', title: 'Tent & Canopy', price: 'Starting from ₹1,999', rating: '4.8 (156)', imageUri: 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/house-party.png' },
        { id: '15', title: "Kid's Entertainment", price: 'Starting from ₹3,499', rating: '4.8 (156)', imageUri: 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/baby-shower.png' },
        { id: '14', title: 'Artist & Performer', price: 'Starting from ₹149', rating: '4.8 (156)', imageUri: 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/engagement.png' },
        { id: '16', title: 'DJ & Music', price: 'Starting from ₹7,299', rating: '4.8 (156)', imageUri: 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/festive.png' },
      ];
    }

    const items: any[] = [];
    categories.forEach((cat: any) => {
      const catTitle = cat.title || cat.name || 'Featured Service';
      const normTitle = catTitle.toLowerCase();
      // Strict whitelist for actual service categories
      const isValidServiceCategory =
        normTitle.includes('photo') ||
        normTitle.includes('tent') ||
        normTitle.includes('canopy') ||
        normTitle.includes('decor') ||
        normTitle.includes('artist') ||
        normTitle.includes('performer') ||
        normTitle.includes('kid') ||
        normTitle.includes('dj') ||
        normTitle.includes('music') ||
        normTitle.includes('bar') ||
        normTitle.includes('cater') ||
        normTitle.includes('baker');

      if (!isValidServiceCategory) {
        return;
      }

      const catProducts = Array.isArray(cat.products) ? cat.products : [];
      let minCatPrice = 0;
      let topImage = '';

      if (catProducts.length > 0) {
        const prices = catProducts.map((p: any) => extractStartingPrice(p)).filter((val: number) => val > 0);
        if (prices.length > 0) minCatPrice = Math.min(...prices);
        topImage = getMediaUrl(catProducts[0]?.bannerImage || catProducts[0]?.mediaURL || catProducts[0]?.image);
      }

      const displayPrice = minCatPrice > 0 ? `Starting from ₹${minCatPrice.toLocaleString('en-IN')}` : 'Starting from ₹2,999';

      items.push({
        id: String(cat.categoryId || cat.id || items.length),
        title: catTitle,
        price: displayPrice,
        rating: '4.8 (1.2k)',
        imageUri: topImage || 'https://freaky-files.s3.ap-south-1.amazonaws.com/category-icons/wedding.png',
      });
    });

    return items;
  }, [featuredResponse]);

  if (isLoading || isFetching) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          <Text style={{ fontSize: 19, fontWeight: '800', color: '#111111', marginBottom: 4 }}>{title} Services</Text>
          {Array.from({ length: 5 }).map((_, i) => (
            <ServiceSkeleton key={i} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 0) + 32 }]}>
        <View style={styles.header}>
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} style={styles.backButton} accessibilityLabel="Go back">
            <ChevronLeft size={23} color="#111111" strokeWidth={2.3} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{title} Services</Text>
            <Text style={styles.headerSubtitle}>Choose the services you need</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.list}>
          {servicesList.map((service) => (
            <Pressable
              key={service.id}
              onPress={() => {
                const norm = (service.title || '').toLowerCase();
                const isCategoryGroup =
                  norm.includes('services') ||
                  norm.includes('packages') ||
                  norm.includes('curated') ||
                  norm.includes('experience') ||
                  norm.includes('royal');

                if (isCategoryGroup) {
                  router.push({ pathname: '/ServiceDetails', params: { serviceName: service.title } });
                } else {
                  router.push({ pathname: '/PhotographyPackageDetails', params: { packageId: service.id, packageName: service.title } });
                }
              }}
            >
              <Card style={[styles.serviceCard, { height: serviceCardHeight }]} className="border-[#e8e8e8] bg-white shadow-sm shadow-black/10">
                <CardContent style={styles.serviceContent}>
                  <Image source={{ uri: service.imageUri }} resizeMode="cover" style={[styles.serviceImage, { width: serviceImageSize, height: serviceImageSize }]} />
                  <View style={styles.serviceCopy}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                    <View style={styles.ratingRow}>
                      <Star size={14} color="#f7be16" fill="#f7be16" strokeWidth={1.8} />
                      <Text style={styles.rating}>{service.rating}</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingHorizontal: 16, paddingTop: 21 },
  header: { flexDirection: 'row', alignItems: 'center' },
  backButton: { width: 32, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerCopy: { flex: 1, alignItems: 'center' },
  headerSpacer: { width: 32 },
  headerTitle: { color: '#111111', fontSize: 19, lineHeight: 24, fontWeight: '800' },
  headerSubtitle: { marginTop: 4, color: '#727272', fontSize: 15, lineHeight: 19 },
  list: { marginTop: 27, gap: 14 },
  serviceCard: { overflow: 'hidden', borderRadius: 8 },
  serviceContent: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 6 },
  serviceImage: { borderRadius: 7 },
  serviceCopy: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  serviceTitle: { color: '#202124', fontSize: 18, lineHeight: 22, fontWeight: '800' },
  servicePrice: { marginTop: 3, color: '#777777', fontSize: 15, lineHeight: 19, fontWeight: '500' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 9 },
  rating: { marginLeft: 6, color: '#525252', fontSize: 14, lineHeight: 18 },
});
