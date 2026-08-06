import { Image, Pressable, ScrollView, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Star } from 'lucide-react-native';

import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

type Service = { id: string; title: string; price: string; image: ImageSourcePropType };

const SERVICES: Service[] = [
  { id: 'decoration', title: 'Decoration', price: 'Starting from ₹4,999', image: require('@/assets/images/home/image 1694.png') },
  { id: 'photography', title: 'Photography', price: 'Starting from ₹2,999', image: require('@/public/camera.png') },
  { id: 'tent-canopy', title: 'Tent & Canopy', price: 'Starting from ₹1,999', image: require('@/assets/images/home/image 1664.png') },
  { id: 'kids-entertainment', title: "Kid's Entertainment", price: 'Starting from ₹3,499', image: require('@/assets/images/home/image 1705.png') },
  { id: 'artist-performer', title: 'Artist & Performer', price: 'Starting from ₹149', image: require('@/assets/images/home/image 1714.png') },
  { id: 'dj-music', title: 'DJ & Music', price: 'Starting from ₹7,299', image: require('@/assets/images/home/image 1701.png') },
];

export default function EventServicesScreen() {
  const insets = useSafeAreaInsets();
  const { eventName } = useLocalSearchParams<{ eventName?: string }>();
  const serviceCardHeight = 96;
  const serviceImageSize = 84;
  const title = eventName || 'Birthday';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 0) + 32 }]}>
        <View style={styles.header}>
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/Event'))} style={styles.backButton} accessibilityLabel="Go back">
            <ChevronLeft size={23} color="#111111" strokeWidth={2.3} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{title} Services</Text>
            <Text style={styles.headerSubtitle}>Choose the services you need</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.list}>
          {SERVICES.map((service) => (
            <Pressable
              key={service.id}
              onPress={() => router.navigate({ pathname: '/ServiceDetails', params: { serviceName: service.title } })}
            >
              <Card style={[styles.serviceCard, { height: serviceCardHeight }]} className="border-[#e8e8e8] bg-white shadow-sm shadow-black/10">
                <CardContent style={styles.serviceContent}>
                  <Image source={service.image} resizeMode="cover" style={[styles.serviceImage, { width: serviceImageSize, height: serviceImageSize }]} />
                  <View style={styles.serviceCopy}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                    <View style={styles.ratingRow}>
                      <Star size={14} color="#f7be16" fill="#f7be16" strokeWidth={1.8} />
                      <Text style={styles.rating}>4.8 (156)</Text>
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
