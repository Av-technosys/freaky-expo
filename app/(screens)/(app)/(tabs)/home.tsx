import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import {
  ChevronDown,
  ChevronRight,
  MapPin,
  Search,
  Star,
  UserRound,
} from 'lucide-react-native';
import { router } from 'expo-router';

import { Text } from '@/components/ui/text';
import { useCurrentAddress, useUserDetails } from '@/api/user';
import { type EventCartService, useCartStore } from '@/store/cartStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDE_PADDING = 10;
const SECTION_GAP = 44;
const RAIL_GAP = 16;
const RAIL_TOP_GAP = 14;
const CATEGORY_GAP = 10;
const CATEGORY_SIDE_PADDING = 20;
const CATEGORY_WIDTH = Math.floor((SCREEN_WIDTH - CATEGORY_SIDE_PADDING * 2 - CATEGORY_GAP * 2) / 3);
const PRODUCT_WIDTH = Math.min(173, Math.round((SCREEN_WIDTH - 49) / 2));
const PRODUCT_HEIGHT = Math.round((PRODUCT_WIDTH * 184) / 173);

const ASSETS = {
  eventHeader: require('@/assets/images/home/image 1634.png'),
  offer: require('@/assets/images/home/Frame 1984078343.png'),
  offerAvatar: require('@/assets/images/home/image 1534.png'),
  curatedTent: require('@/assets/images/home/image 1735.png'),
  curatedArtist: require('@/assets/images/home/image 1736.png'),
  curatedBartender: require('@/assets/images/home/image 1737.png'),
  photographyType: require('@/assets/images/home/unsplash_IVaKksEZmZA.png'),
  bartenderType: require('@/assets/images/home/unsplash_xBFTjrMIC0c.png'),
  tentType: require('@/assets/images/home/image 1659.png'),
  photographer: require('@/assets/images/home/image 1532.png'),
  luxuryTent: require('@/assets/images/home/image 1664.png'),
  weddingDecor: require('@/assets/images/home/image 1516.png'),
  decorationStage: require('@/assets/images/home/image 1694.png'),
  floralEntrance: require('@/assets/images/home/image 1698.png'),
  premiumDecoration: require('@/assets/images/home/image 1699.png'),
  liveSinger: require('@/assets/images/home/image 1714.png'),
  liveBand: require('@/assets/images/home/image 1716.png'),
  culturalDance: require('@/assets/images/home/image 1715.png'),
  kidsMagician: require('@/assets/images/home/image 1705.png'),
  kidsDance: require('@/assets/images/home/image 1706.png'),
  kidsParty: require('@/assets/images/home/image 1705.png'),
  weddingDj: require('@/assets/images/home/image 1701.png'),
  liveMusic: require('@/assets/images/home/image 1702.png'),
  partyDj: require('@/assets/images/home/image 1703.png'),
  florist: require('@/assets/images/home/image 1729.png'),
  dj: require('@/assets/images/home/image 1733.png'),
  planner: require('@/assets/images/home/image 1734.png'),
  royalPackage: require('@/assets/images/home/image 1516.png'),
  birthdayPackage: require('@/assets/images/home/image 1534.png'),
  djHero: require('@/assets/images/home/image 1738.png'),
  tentHero: require('@/assets/images/home/image 1739.png'),
  photoHero: require('@/assets/images/home/image 1740.png'),
  weddingPhotography: require('@/assets/images/home/image 1740.png'),
  studioPhoto: require('@/assets/images/home/image 1788.png'),
  weddingTent: require('@/assets/images/home/image 1708.png'),
  haldiTent: require('@/assets/images/home/image 1711.png'),
  cocktailTent: require('@/assets/images/home/image 1659.png'),
  coupon: require('@/assets/images/home/image 1617.png'),
} satisfies Record<string, ImageSourcePropType>;

type Category = {
  id: string;
  name: string;
  image: ImageSourcePropType;
};

type Product = {
  id: string;
  name: string;
  rating: string;
  price: string;
  image: ImageSourcePropType;
};

const CATEGORIES: Category[] = [
  { id: 'wedding', name: 'Wedding', image: require('@/assets/images/home/category-icons/wedding.png') },
  { id: 'birthday', name: 'Birthday', image: require('@/assets/images/home/category-icons/birthday.png') },
  { id: 'house-party', name: 'House Party', image: require('@/assets/images/home/category-icons/house-party.png') },
  { id: 'baby-shower', name: 'Baby Shower', image: require('@/assets/images/home/category-icons/baby-shower.png') },
  { id: 'festive-celebration', name: 'Festive Celebration', image: require('@/assets/images/home/category-icons/festive-celebration.png') },
  { id: 'engagement', name: 'Engagement', image: require('@/assets/images/home/category-icons/engagement.png') },
];

const MOST_BOOKED: Product[] = [
  { id: 'premium-photographer', name: 'Premium Photographer', rating: '4.76 (2.8M)', price: '₹25,000', image: ASSETS.photographer },
  { id: 'luxury-tent-works', name: 'Luxury Tent Works', rating: '4.76 (2.8M)', price: '₹75,000', image: ASSETS.luxuryTent },
  { id: 'wedding-decor', name: 'Wedding Decor', rating: '4.76 (2.8M)', price: '₹35,000', image: ASSETS.weddingDecor },
];

const FEATURED_PACKAGES: Product[] = [
  { id: 'royal-wedding-package', name: 'Royal Wedding Package', rating: '4.76 (2.8M)', price: '₹1,50,000', image: ASSETS.royalPackage },
  { id: 'birthday-package', name: 'Birthday Celebration Package', rating: '4.76 (2.8M)', price: '₹1,25,000', image: ASSETS.birthdayPackage },
  { id: 'decor-package', name: 'Premium Decor Package', rating: '4.76 (2.8M)', price: '₹95,000', image: ASSETS.weddingDecor },
];

const PHOTOGRAPHY_PRODUCTS: Product[] = [
  { id: 'wedding-photography', name: 'Wedding Photography', rating: '4.76 (2.8M)', price: '₹25,000', image: ASSETS.weddingPhotography },
  { id: 'studio-photoshoot', name: 'Studio Photoshoot', rating: '4.76 (2.8M)', price: '₹599', image: ASSETS.studioPhoto },
  { id: 'portrait-photography', name: 'Portrait Photography', rating: '4.76 (2.8M)', price: '₹4,999', image: ASSETS.photographer },
];

const TENT_PRODUCTS: Product[] = [
  { id: 'wedding-tent', name: 'Wedding Tent', rating: '4.76 (2.8M)', price: '₹6,999', image: ASSETS.weddingTent },
  { id: 'haldi-mehndi-canopy', name: 'Haldi/Mehndi Canopy', rating: '4.76 (2.8M)', price: '₹2,499', image: ASSETS.haldiTent },
  { id: 'cocktail-canopy', name: 'Cocktail Canopy', rating: '4.76 (2.8M)', price: '₹4,999', image: ASSETS.cocktailTent },
];

const DECORATION_PACKAGES: Product[] = [
  { id: 'luxury-wedding-stage', name: 'Luxury Wedding Stage', rating: '4.76 (2.8M)', price: '₹25,000', image: ASSETS.decorationStage },
  { id: 'floral-entrance-decoration', name: 'Floral Entrance Decoration', rating: '4.76 (2.8M)', price: '₹599', image: ASSETS.floralEntrance },
  { id: 'premium-decoration', name: 'Premium Decoration', rating: '4.76 (2.8M)', price: '₹15,999', image: ASSETS.premiumDecoration },
];

const ARTIST_PRODUCTS: Product[] = [
  { id: 'live-singer', name: 'Live Singer', rating: '4.76 (2.8M)', price: '₹5,999', image: ASSETS.liveSinger },
  { id: 'live-band', name: 'Live Band', rating: '4.76 (2.8M)', price: '₹12,999', image: ASSETS.liveBand },
  { id: 'cultural-dance', name: 'Cultural Dance', rating: '4.76 (2.8M)', price: '₹7,999', image: ASSETS.culturalDance },
];

const KIDS_PRODUCTS: Product[] = [
  { id: 'kids-magician', name: 'Kids Magician & Clown', rating: '4.76 (2.8M)', price: '₹3,999', image: ASSETS.kidsMagician },
  { id: 'kids-dance-party', name: 'Kids Dance Party', rating: '4.76 (2.8M)', price: '₹5,499', image: ASSETS.kidsDance },
  { id: 'kids-party', name: 'Kids Party Fun', rating: '4.76 (2.8M)', price: '₹4,999', image: ASSETS.kidsParty },
];

const DJ_PRODUCTS: Product[] = [
  { id: 'wedding-dj', name: 'Wedding DJ', rating: '4.76 (2.8M)', price: '₹11,999', image: ASSETS.weddingDj },
  { id: 'live-music-band', name: 'Live Music & Band', rating: '4.76 (2.8M)', price: '₹8,999', image: ASSETS.liveMusic },
  { id: 'party-dj', name: 'Party DJ', rating: '4.76 (2.8M)', price: '₹9,999', image: ASSETS.partyDj },
];

function SearchBar({ sticky = false }: { sticky?: boolean }) {
  return (
    <Pressable style={[styles.searchAction, sticky && styles.stickySearchAction]}>
      <Search size={22} color="#77797e" strokeWidth={1.7} />
      <Text style={styles.searchCopy}>Search for ‘photography’</Text>
    </Pressable>
  );
}

function Header({ address, searchStyle }: { address?: any; searchStyle?: any }) {
  const city = address?.city ? `${address.city}, ${address.state || 'Rajasthan'}` : 'Jaipur, Rajasthan';
  const street = address?.addressLineOne || '333, Street 8, Sector 8, Mansarovar';

  return (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <Pressable
          onPress={() => router.navigate('/AddressManagementScreen' as never)}
          style={styles.locationAction}
        >
          <MapPin size={22} color="#ffffff" strokeWidth={1.9} />
          <View style={styles.locationText}>
            <View style={styles.cityRow}>
              <Text style={styles.city} numberOfLines={1}>{city}</Text>
              <ChevronDown size={16} color="#e9e9e9" strokeWidth={2.5} />
            </View>
            <Text style={styles.street} numberOfLines={1}>{street}</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => router.navigate('/Profile' as never)} style={styles.profileAction}>
          <UserRound size={25} color="#ffffff" strokeWidth={1.9} />
        </Pressable>
      </View>
      <Animated.View style={searchStyle}>
        <SearchBar />
      </Animated.View>
    </View>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: '/EventServices' as never,
          params: { eventTypeId: category.id, eventName: category.name },
        })
      }
      style={styles.categoryCard}
    >
      <View style={styles.categoryIconFrame}>
        <Image source={category.image} resizeMode="contain" style={styles.categoryIcon} />
      </View>
      <Text style={styles.categoryLabel} numberOfLines={1}>{category.name}</Text>
      <View style={styles.categoryUnderline} />
    </Pressable>
  );
}

function SectionHeader({ title, description, viewAll = false }: { title: string; description?: string; viewAll?: boolean }) {
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {description ? <Text style={styles.sectionDescription}>{description}</Text> : null}
      </View>
      {viewAll ? <Text style={styles.viewAll}>View All</Text> : null}
    </View>
  );
}

function Offer() {
  return (
    <View style={styles.offerWrapper}>
      <Image source={ASSETS.offer} resizeMode="cover" style={styles.offerImage} />
    </View>
  );
}

function FloatingEventPill({
  bottom,
  service,
  services,
  serviceCount,
}: {
  bottom: number;
  service: EventCartService;
  services: EventCartService[];
  serviceCount: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="View selected services"
      onPress={() => router.push('/Cart' as never)}
      style={[styles.floatingEventPill, { bottom }]}
    >
      <BlurView
        pointerEvents="none"
        tint="light"
        intensity={30}
        blurReductionFactor={3}
        experimentalBlurMethod="dimezisBlurView"
        style={styles.eventPillBlur}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.26)', 'rgba(255,255,255,0.06)', 'rgba(122,43,22,0.12)']}
        locations={[0, 0.48, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.eventPillGlass}
      >
        <EventAvatarStack services={services} />
        <View style={styles.eventPillBody}>
          <Text style={styles.eventPillTitle} numberOfLines={1}>{service.title}</Text>
          <Text style={styles.eventPillSubtitle} numberOfLines={1}>
            {serviceCount === 1 ? '1 service added' : `${serviceCount} services in your cart`}
          </Text>
        </View>
        <View style={styles.eventPillNext}>
          <ChevronRight size={22} color="#fff" strokeWidth={2.5} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function EventAvatarStack({ services }: { services: EventCartService[] }) {
  const visibleServices = services.slice(-3).reverse();
  const stackWidth = 46 + Math.max(0, visibleServices.length - 1) * 16;

  return (
    <View style={[styles.eventPillAvatarStack, { width: stackWidth }]}>
      {visibleServices.map((item, index) => (
        <Image
          key={item.id}
          source={{ uri: item.imageUri }}
          style={[styles.eventPillImage, { left: index * 16, zIndex: visibleServices.length - index }]}
        />
      ))}
    </View>
  );
}

function cartDetailsForProduct(product: Product): Pick<EventCartService, 'packageName' | 'features'> {
  const searchValue = `${product.id} ${product.name}`.toLowerCase();

  if (searchValue.includes('photo')) {
    return {
      packageName: 'Photography Service',
      features: [
        { icon: 'person', label: 'Verified Photographer' },
        { icon: 'clock', label: 'Flexible hours' },
        { icon: 'camera', label: 'High-resolution photos' },
      ],
    };
  }

  if (searchValue.includes('tent') || searchValue.includes('canopy') || searchValue.includes('decor')) {
    return {
      packageName: 'Decoration & Setup',
      features: [
        { icon: 'balloon', label: 'Premium setup' },
        { icon: 'sparkles', label: 'Custom styling' },
        { icon: 'clock', label: 'Professional installation' },
      ],
    };
  }

  if (searchValue.includes('dj') || searchValue.includes('music') || searchValue.includes('band') || searchValue.includes('singer')) {
    return {
      packageName: 'Artist & Performer',
      features: [
        { icon: 'dj', label: 'Professional performer' },
        { icon: 'music', label: 'Curated music set' },
        { icon: 'sound', label: 'Sound system included' },
      ],
    };
  }

  return {
    packageName: 'Event Entertainment Service',
    features: [
      { icon: 'star', label: 'Top-rated experience' },
      { icon: 'fun', label: 'Tailored for your event' },
      { icon: 'anchor', label: 'Expert event support' },
    ],
  };
}

function eventCartServiceFromProduct(product: Product): EventCartService {
  return {
    id: product.id,
    title: product.name,
    price: Number(product.price.replace(/[^0-9]/g, '')),
    imageUri: Image.resolveAssetSource(product.image).uri,
    ...cartDetailsForProduct(product),
  };
}

function PortraitCard({ image, title }: { image: ImageSourcePropType; title: string }) {
  return (
    <Pressable style={styles.portraitCard}>
      <Image source={image} resizeMode="cover" style={styles.portraitImage} />
      <View style={styles.portraitShade} />
      <Text style={styles.portraitLabel} numberOfLines={1}>{title}</Text>
    </Pressable>
  );
}

function ServiceTypeCard({ image, title }: { image: ImageSourcePropType; title: string }) {
  return (
    <Pressable style={styles.typeCard}>
      <Image source={image} resizeMode="cover" style={styles.typeImage} />
      <View style={styles.typeShade} />
      <Text style={styles.typeLabel} numberOfLines={1}>{title}</Text>
    </Pressable>
  );
}

function ProductCard({ product }: { product: Product }) {
  const addEventService = useCartStore((state) => state.addEventService);
  const removeEventService = useCartStore((state) => state.removeEventService);
  const isAdded = useCartStore((state) => state.eventServices.some((service) => service.id === product.id));

  return (
    <Pressable style={styles.productCard}>
      <Image source={product.image} resizeMode="cover" style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
      <View style={styles.ratingRow}>
        <Star size={14} color="#ffbd00" fill="#ffbd00" strokeWidth={1.6} />
        <Text style={styles.rating}>{product.rating}</Text>
      </View>
      <View style={styles.productFooter}>
        <View>
          <Text style={styles.startsAt}>Starts at</Text>
          <Text style={styles.price}>{product.price}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.name} to cart`}
          onPress={() => {
            if (isAdded) {
              removeEventService(product.id);
              return;
            }

            addEventService(eventCartServiceFromProduct(product));
          }}
          style={[styles.addButton, isAdded && styles.addButtonAdded]}
        >
          <Text style={[styles.addLabel, isAdded && styles.addLabelAdded]}>{isAdded ? 'Added' : 'Add'}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

function ProductRail({ products }: { products: Product[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productRail}>
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </ScrollView>
  );
}

function ContentSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} description={description} />
      {children}
    </View>
  );
}

function ProductSection({ title, products, viewAll = false }: { title: string; products: Product[]; viewAll?: boolean }) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} viewAll={viewAll} />
      <ProductRail products={products} />
    </View>
  );
}

function PromoBanner({ kind }: { kind: 'photo' | 'tent' | 'dj' }) {
  const photography = kind === 'photo';
  const dj = kind === 'dj';
  const title = photography ? 'Photography\nServices' : dj ? 'DJ\n& Music\nServices' : 'Tent &\nCanopy\nServices';
  const hero = photography ? ASSETS.photoHero : dj ? ASSETS.djHero : ASSETS.tentHero;

  return (
    <View style={styles.promoBanner}>
      <Image source={hero} resizeMode="cover" style={styles.promoImage} />
      <View style={styles.promoCopy}>
        <Text style={[styles.promoTitle, dj && styles.promoTitleOnDark]}>{title}</Text>
        <Text style={[styles.promoStarts, dj && styles.promoStartsOnDark]}>Starting at</Text>
        <View style={styles.promoPriceRow}>
          <Text style={[styles.promoPrice, dj && styles.promoPriceOnDark]}>₹4,999</Text>
          <Text style={[styles.promoCrossedPrice, dj && styles.promoCrossedPriceOnDark]}>₹7,499</Text>
        </View>
      </View>
      <Pressable style={styles.bookNow}><Text style={styles.bookNowLabel}>Book Now</Text></Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const { data: userResponse, refetch: refetchUser } = useUserDetails();
  const { data: addressResponse, refetch: refetchAddress } = useCurrentAddress(userResponse?.data?.currentAddressId);
  const eventServices = useCartStore((state) => state.eventServices);
  const lastAddedEventServiceId = useCartStore((state) => state.lastAddedEventServiceId);
  const latestEventService = eventServices.find((service) => service.id === lastAddedEventServiceId) ?? eventServices[eventServices.length - 1];
  const curatedExperiences = useMemo(
    () => [
      { title: 'Tent & Canopy', image: ASSETS.curatedTent },
      { title: 'Artist & Performer', image: ASSETS.curatedArtist },
      { title: 'Bartender', image: ASSETS.curatedBartender },
    ],
    [],
  );
  const experts = useMemo(
    () => [
      { title: 'Florist', image: ASSETS.florist },
      { title: 'DJ', image: ASSETS.dj },
      { title: 'Photographer', image: ASSETS.planner },
    ],
    [],
  );
  const stickySearchOpacity = scrollY.interpolate({
    inputRange: [24, 72, 116],
    outputRange: [0, 0.72, 1],
    extrapolate: 'clamp',
  });
  const stickySearchTranslateY = scrollY.interpolate({
    inputRange: [24, 72, 116],
    outputRange: [-11, -3, 0],
    extrapolate: 'clamp',
  });
  const stickySearchScale = scrollY.interpolate({
    inputRange: [24, 72, 116],
    outputRange: [0.96, 0.987, 1],
    extrapolate: 'clamp',
  });
  const headerSearchOpacity = scrollY.interpolate({
    inputRange: [0, 34, 86, 120],
    outputRange: [1, 1, 0.45, 0],
    extrapolate: 'clamp',
  });
  const headerSearchScale = scrollY.interpolate({
    inputRange: [0, 34, 86, 120],
    outputRange: [1, 1, 0.993, 0.98],
    extrapolate: 'clamp',
  });
  const headerSearchTranslateY = scrollY.interpolate({
    inputRange: [0, 34, 86, 120],
    outputRange: [0, 0, -4, -8],
    extrapolate: 'clamp',
  });

  useFocusEffect(
    useCallback(() => {
      NativeStatusBar.setHidden(false, 'fade');
      NativeStatusBar.setBarStyle('light-content', true);

      if (Platform.OS === 'android') {
        NativeStatusBar.setBackgroundColor('#050505', true);
      }

      return () => {
        NativeStatusBar.setHidden(false, 'fade');
        NativeStatusBar.setBarStyle('dark-content', true);

        if (Platform.OS === 'android') {
          NativeStatusBar.setBackgroundColor('#ffffff', true);
        }
      };
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchUser(), refetchAddress()]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" backgroundColor="#050505" hidden={false} translucent={false} />
      <Animated.ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
            colors={['#ffffff']}
            progressBackgroundColor="#050505"
            progressViewOffset={14}
          />
        }
      >
        <View style={styles.topStack}>
          <Header
            address={addressResponse?.data}
            searchStyle={{
              opacity: headerSearchOpacity,
              transform: [{ translateY: headerSearchTranslateY }, { scale: headerSearchScale }],
            }}
          />
          <View style={styles.eventHeaderWrapper}>
            <Image source={ASSETS.eventHeader} resizeMode="cover" style={styles.eventHeaderImage} />
          </View>
        </View>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((category) => <CategoryCard key={category.id} category={category} />)}
        </View>

        <View style={styles.firstSection}>
          <SectionHeader title="Offers & Discounts" />
          <Offer />
        </View>

        <ContentSection title="Curated Experiences" description="of our finest experiences">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.portraitRail}>
            {curatedExperiences.map((item) => <PortraitCard key={item.title} {...item} />)}
          </ScrollView>
        </ContentSection>

        <ContentSection title="Explore Our Services">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRail}>
            <ServiceTypeCard image={ASSETS.photographyType} title="Photography" />
            <ServiceTypeCard image={ASSETS.bartenderType} title="Bar Tender" />
            <ServiceTypeCard image={ASSETS.tentType} title="Tent & Canopy" />
          </ScrollView>
        </ContentSection>

        <ProductSection title="Most Booked Services" products={MOST_BOOKED} />

        <ContentSection title="Meet Our Event Experts" description="Verified professionals who make every celebration">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.portraitRail}>
            {experts.map((item) => <PortraitCard key={item.title} {...item} />)}
          </ScrollView>
        </ContentSection>

        <ProductSection title="Featured Packages" products={FEATURED_PACKAGES} />

        <View style={styles.promoSection}><PromoBanner kind="photo" /></View>
        <ProductSection title="Photography Services" products={PHOTOGRAPHY_PRODUCTS} viewAll />

        <View style={styles.promoSection}><PromoBanner kind="tent" /></View>
        <ProductSection title="Tent & Canopy Services" products={TENT_PRODUCTS} viewAll />

        <ProductSection title="Decoration Packages" products={DECORATION_PACKAGES} viewAll />

        <ProductSection title="Artist & Performer" products={ARTIST_PRODUCTS} viewAll />

        <ProductSection title="Kid's Entertainment Services" products={KIDS_PRODUCTS} viewAll />

        <View style={styles.promoSection}><PromoBanner kind="dj" /></View>
        <ProductSection title="DJ & Music Services" products={DJ_PRODUCTS} viewAll />

        <View style={styles.couponSection}>
          <Image source={ASSETS.coupon} resizeMode="cover" style={styles.coupon} />
        </View>
        <View style={styles.navClearance} />
      </Animated.ScrollView>
      <Animated.View
        pointerEvents="auto"
        style={[
          styles.stickySearch,
          {
            top: insets.top,
            opacity: stickySearchOpacity,
            transform: [{ translateY: stickySearchTranslateY }, { scale: stickySearchScale }],
          },
        ]}
      >
        <BlurView
          pointerEvents="none"
          tint="light"
          intensity={28}
          blurReductionFactor={3}
          experimentalBlurMethod="dimezisBlurView"
          style={styles.stickySearchBlur}
        />
        <SearchBar sticky />
      </Animated.View>
      {latestEventService ? (
        <FloatingEventPill
          bottom={insets.bottom + 81}
          service={latestEventService}
          services={eventServices}
          serviceCount={eventServices.length}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#050505' },
  topStack: { backgroundColor: '#050505' },
  header: { backgroundColor: '#050505', paddingHorizontal: 20, paddingTop: 7, paddingBottom: 14 },
  headerTopRow: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationAction: { flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  locationText: { flex: 1, marginLeft: 10 },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  city: { color: '#fff', fontSize: 19, lineHeight: 23, fontWeight: '700' },
  street: { color: '#a4a4a4', fontSize: 15, lineHeight: 18, marginTop: 2 },
  profileAction: { width: 34, height: 36, alignItems: 'center', justifyContent: 'center' },
  searchAction: { height: 46, marginTop: 12, borderRadius: 10, backgroundColor: '#fff', paddingHorizontal: 15, alignItems: 'center', flexDirection: 'row' },
  stickySearchAction: { marginTop: 0, borderWidth: 1, borderColor: 'rgba(218,222,229,0.8)', backgroundColor: 'rgba(255,255,255,0.64)', borderRadius: 12 },
  searchCopy: { marginLeft: 12, color: '#65656a', fontSize: 14 },
  screen: { flex: 1, backgroundColor: '#050505' },
  scrollContent: { paddingBottom: 10, backgroundColor: '#fff' },
  eventHeaderWrapper: { position: 'relative' },
  eventHeaderImage: { width: '100%', height: Math.round((SCREEN_WIDTH * 124) / 394) },
  stickySearch: { position: 'absolute', zIndex: 15, elevation: 10, left: 0, right: 0, overflow: 'hidden', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.74)', borderBottomWidth: 1, borderBottomColor: 'rgba(221,224,229,0.72)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 3 },
  stickySearchBlur: { ...StyleSheet.absoluteFillObject },
  categoryGrid: { paddingTop: 32, paddingHorizontal: CATEGORY_SIDE_PADDING, gap: CATEGORY_GAP, flexDirection: 'row', flexWrap: 'wrap' },
  categoryCard: { width: CATEGORY_WIDTH, height: 114, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e8e8e8', borderRadius: 8, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 2.5, elevation: 3 },
  categoryIconFrame: { height: 65, alignItems: 'center', justifyContent: 'center' },
  categoryIcon: { width: 78, height: 65 },
  categoryLabel: { color: '#242424', fontSize: 16, lineHeight: 19, fontWeight: '600', paddingHorizontal: 3, textAlign: 'center' },
  categoryUnderline: { width: 24, height: 3, borderRadius: 2, marginTop: 5, backgroundColor: '#ff5b42' },
  firstSection: { marginTop: SECTION_GAP },
  section: { marginTop: SECTION_GAP },
  sectionHeader: { minHeight: 18, paddingHorizontal: SIDE_PADDING, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: '#161617', fontSize: 18, lineHeight: 22, fontWeight: '700' },
  sectionDescription: { color: '#787878', fontSize: 14, lineHeight: 17, marginTop: 1 },
  viewAll: { color: '#ff5037', fontSize: 14, lineHeight: 18, fontWeight: '500' },
  offerWrapper: { height: Math.round((SCREEN_WIDTH - 32) * (186 / 348)), marginHorizontal: 16, marginTop: 11, borderRadius: 6, overflow: 'hidden' },
  offerImage: { width: '100%', height: '100%' },
  floatingEventPill: { position: 'absolute', zIndex: 20, elevation: 12, width: Math.min(294, SCREEN_WIDTH - 64), alignSelf: 'center', height: 58, overflow: 'hidden', backgroundColor: 'rgba(244,119,76,0.78)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.48)', borderRadius: 29, shadowColor: '#3b160d', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.22, shadowRadius: 10 },
  eventPillBlur: { ...StyleSheet.absoluteFillObject, borderRadius: 29 },
  eventPillGlass: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 6 },
  eventPillAvatarStack: { height: 46, position: 'relative' },
  eventPillImage: { position: 'absolute', top: 0, width: 46, height: 46, borderRadius: 23, borderWidth: 2, borderColor: '#f4774c' },
  eventPillBody: { flex: 1, marginLeft: 10 },
  eventPillTitle: { color: '#fff', fontSize: 15, lineHeight: 18, fontWeight: '700' },
  eventPillSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 11, lineHeight: 14, marginTop: 1 },
  eventPillNext: { width: 36, height: 36, marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(151,66,39,0.31)' },
  portraitRail: { gap: RAIL_GAP, paddingHorizontal: SIDE_PADDING, marginTop: RAIL_TOP_GAP },
  portraitCard: { width: 151, height: 266, overflow: 'hidden', borderRadius: 6, justifyContent: 'flex-end' },
  portraitImage: { width: '100%', height: '100%' },
  portraitShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.12)' },
  portraitLabel: { position: 'absolute', left: 5, right: 5, bottom: 9, color: '#fff', fontSize: 14, lineHeight: 16, fontWeight: '600', textAlign: 'center' },
  typeRail: { gap: RAIL_GAP, paddingHorizontal: SIDE_PADDING, marginTop: RAIL_TOP_GAP },
  typeCard: { width: 114, height: 124, overflow: 'hidden', borderRadius: 6, justifyContent: 'flex-end' },
  typeImage: { width: '100%', height: '100%' },
  typeShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  typeLabel: { position: 'absolute', left: 3, right: 3, bottom: 7, color: '#fff', fontSize: 12, lineHeight: 14, fontWeight: '600', textAlign: 'center' },
  productRail: { gap: RAIL_GAP, paddingHorizontal: SIDE_PADDING, marginTop: RAIL_TOP_GAP },
  productCard: { width: PRODUCT_WIDTH },
  productImage: { width: PRODUCT_WIDTH, height: PRODUCT_HEIGHT, borderRadius: 6, backgroundColor: '#f0f0f0' },
  productName: { marginTop: 8, color: '#242424', fontSize: 16, lineHeight: 19, fontWeight: '600' },
  ratingRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center' },
  rating: { marginLeft: 4, color: '#707070', fontSize: 13, lineHeight: 16 },
  productFooter: { minHeight: 40, marginTop: 12, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  startsAt: { color: '#696969', fontSize: 12, lineHeight: 14 },
  price: { color: '#131313', fontSize: 16, lineHeight: 19, fontWeight: '700' },
  addButton: { width: 67, height: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ff553a', borderRadius: 4 },
  addLabel: { color: '#ff553a', fontSize: 14, fontWeight: '600' },
  addButtonAdded: { backgroundColor: '#ff553a' },
  addLabelAdded: { color: '#ffffff' },
  promoSection: { marginTop: SECTION_GAP, paddingHorizontal: 16 },
  promoBanner: { width: '100%', aspectRatio: 1, borderRadius: 9, overflow: 'hidden' },
  promoImage: { width: '100%', height: '100%' },
  promoCopy: { position: 'absolute', top: 16, left: 16, width: '61%' },
  promoTitle: { color: '#202025', fontSize: 34, lineHeight: 35, fontWeight: '800' },
  promoTitleOnDark: { color: '#fff' },
  promoStarts: { color: '#25252a', fontSize: 14, lineHeight: 17, marginTop: 8 },
  promoStartsOnDark: { color: '#d0cbd6' },
  promoPriceRow: { marginTop: 1, flexDirection: 'row', alignItems: 'baseline' },
  promoPrice: { color: '#62321f', fontSize: 34, lineHeight: 39, fontWeight: '800' },
  promoPriceOnDark: { color: '#edb4ff' },
  promoCrossedPrice: { marginLeft: 8, color: '#352621', fontSize: 13, textDecorationLine: 'line-through' },
  promoCrossedPriceOnDark: { color: '#bd91c9' },
  bookNow: { position: 'absolute', left: 16, bottom: 16, width: 109, height: 36, borderRadius: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  bookNowLabel: { color: '#161619', fontSize: 16, fontWeight: '700' },
  navClearance: { height: 92 },
  couponSection: { marginTop: SECTION_GAP },
  coupon: { width: SCREEN_WIDTH - 28, height: Math.round((SCREEN_WIDTH - 28) * (157 / 364)), marginHorizontal: 14, borderRadius: 9 },
});
