import { View } from 'react-native';
import { useEffect, useRef, useState, useMemo } from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import HeaderSection from '@/components/home/HeaderSection';
import BannerCarousel from '@/components/home/BannerCarousel';
import HomeCategoriesSection from '@/components/home/HomeCategoriesSection';
import ServicesBlock from '@/components/home/ServiceBlock';
import Showcase from '@/components/home/ShowCaseList';
import EventCarousel from '@/components/home/EventCarousel';
import WeddingBanner from '@/components/home/WeddingBanner';
import AddressSheetContent from '@/components/common/AddressSheetContent';
import HowItWork from '@/components/home/HowItWork';
import Screen from '@/app/provider/Screen';

import { getBanners } from '@/api/event';

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['94%'], []);

  const [banners, setBanners] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);

      const res = await getBanners();

      if (res?.data && Array.isArray(res.data)) {
        const sorted = [...res.data].sort((a, b) => a.priority - b.priority);
        setBanners(sorted);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.log('Banner error', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Screen scroll>
        <HeaderSection bottomSheetRef={bottomSheetRef} />

        <BannerCarousel banners={banners} loading={loading} />

        <HomeCategoriesSection />

        <WeddingBanner />

        <View style={{ marginTop: -60 }}>
          <EventCarousel />
        </View>

        <Showcase />

        <ServicesBlock />

        <HowItWork />
      </Screen>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={(index) => setIsAddressSheetOpen(index >= 0)}>
        <AddressSheetContent
          isOpen={isAddressSheetOpen}
          onClose={() => bottomSheetRef.current?.close()}
        />
      </BottomSheet>
    </>
  );
}
