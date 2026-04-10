import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import HeaderSection  from '@/components/home/HeaderSection';
import BannerCarousel from '@/components/home/BannerCarousel';
import HomeCategoriesSection from '@/components/home/HomeCategoriesSection';
import ServicesBlock from '@/components/home/ServiceBlock';
import Showcase from '@/components/home/ShowCaseList';
import EventCarousel from '@/components/home/EventCarousel';
import WeddingBanner from '@/components/home/WeddingBanner';
import BaseBottomSheet from '@/components/common/BaseBottomSheet';
import AddressSheetContent from '@/components/common/AddressSheetContent';
import HowItWork from '@/components/home/HowItWork';
import Screen from '@/app/provider/Screen';
import { getBanners } from '@/api/event';

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

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
        const sorted = [...res.data].sort(
          (a, b) => a.priority - b.priority
        );
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
 <Screen>
      {/* STATUS BAR */}
  
        {/* HEADER */}
        <HeaderSection bottomSheetRef={bottomSheetRef} />

        {/* BANNERS */}
        <BannerCarousel banners={banners} loading={loading} />

        {/* CATEGORIES */}
        <HomeCategoriesSection />

        {/* WEDDING / SPECIAL */}
        <WeddingBanner
          banner={banners?.find((b) => b?.type === 'wedding')}
        />

        {/* EVENT CAROUSEL */}
        <View style={{ marginTop: -40 }}>
          <EventCarousel />
        </View>

        {/* SHOWCASE */}
        <Showcase />

        {/* SERVICES */}
        <ServicesBlock />

        {/* HOW IT WORKS */}
        <HowItWork />

      {/* BOTTOM SHEET */}
      <BaseBottomSheet
        ref={bottomSheetRef}
        onChange={(index: number) => {
          setIsAddressSheetOpen(index >= 0);
        }}
      >
        <AddressSheetContent
          isOpen={isAddressSheetOpen}
          onClose={() => bottomSheetRef.current?.close()}
        />
      </BaseBottomSheet>

    </Screen>
  );
}