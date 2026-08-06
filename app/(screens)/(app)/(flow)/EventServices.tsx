import { Image, Pressable, ScrollView, StyleSheet, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Star } from 'lucide-react-native';

import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

type Service = { id: string; title: string; price: string; image: ImageSourcePropType };

const SERVICES: Service[] = [
  { id: 'decoration', title: 'Decoration', price: 'Starting from Rs4,999', image: require('@/assets/images/service1.png') },
  { id: 'photography', title: 'Photography', price: 'Starting from Rs2,999', image: require('@/assets/images/event2.png') },
  { id: 'tent-canopy', title: 'Tent & Canopy', price: 'Starting from Rs1,999', image: require('@/assets/images/service2.png') },
  { id: 'kids-entertainment', title: "Kid's Entertainment", price: 'Starting from Rs3,499', image: require('@/assets/images/party.png') },
  { id: 'artist-performer', title: 'Artist & Performer', price: 'Starting from Rs149', image: require('@/assets/images/eventType1.jpg') },
  { id: 'dj-music', title: 'DJ & Music', price: 'Starting from Rs7299', image: require('@/assets/images/eventType3.jpg') },
];

export default function EventServicesScreen() {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const { eventName } = useLocalSearchParams<{ eventName?: string }>();
  const serviceCardHeight = Math.min(78, Math.max(66, (screenHeight - insets.top - insets.bottom - 146) / 6));
  const serviceImageSize = serviceCardHeight - 12;
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
  content: { paddingHorizontal: 16, paddingTop: 22 },
  header: { flexDirection: 'row', alignItems: 'center' },
  backButton: { width: 32, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerCopy: { flex: 1, alignItems: 'center' },
  headerSpacer: { width: 32 },
  headerTitle: { color: '#111111', fontSize: 17, lineHeight: 21, fontWeight: '700' },
  headerSubtitle: { marginTop: 3, color: '#727272', fontSize: 12, lineHeight: 15 },
  list: { marginTop: 22, gap: 9 },
  serviceCard: { overflow: 'hidden', borderRadius: 8 },
  serviceContent: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 6 },
  serviceImage: { borderRadius: 6 },
  serviceCopy: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  serviceTitle: { color: '#202124', fontSize: 14, lineHeight: 17, fontWeight: '700' },
  servicePrice: { marginTop: 2, color: '#777777', fontSize: 10, lineHeight: 13 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  rating: { marginLeft: 5, color: '#525252', fontSize: 10, lineHeight: 13 },
});
