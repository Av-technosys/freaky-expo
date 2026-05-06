import { View } from 'react-native';
import { useEffect, useState } from 'react';
import HeaderSection from '@/components/home/HeaderSection';
import BannerCarousel from '@/components/home/BannerCarousel';
import HomeCategoriesSection from '@/components/home/HomeCategoriesSection';
import ServicesBlock from '@/components/home/ServiceBlock';
import Showcase from '@/components/home/ShowCaseList';
import EventCarousel from '@/components/home/EventCarousel';
import WeddingBanner from '@/components/home/WeddingBanner';
import HowItWork from '@/components/home/HowItWork';
import Screen from '@/app/provider/Screen';

import { getBanners } from '@/api/event';

export default function HomeScreen() {
  const [banners, setBanners] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

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
    <Screen scroll>
      <HeaderSection />

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
  );
}
