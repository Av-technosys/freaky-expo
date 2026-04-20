import { View, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRef, useMemo } from 'react';
// UI
import { Text } from '@/components/ui/text';
import ScreenHeader from '@/components/common/ScreenHeader';
import { AppButton } from '@/components/common/AppButton';
import Screen from '@/app/provider/Screen';
// Sections (reusable components)
import VendorHeaderCard from '@/components/ProductDetails/Header';
import Details from '@/components/ProductDetails/Details';
import VendorDetailsCard from '@/components/ProductDetails/VendorDetails';
import ReviewSection from '@/components/ProductDetails/ReviewSection';
import AddToCartForm from '@/components/common/form/AddToCartForm';

// APIs
import { getProductsByProductId, fetchProductReview } from '@/api/product';
import { fetchVendorDetail } from '@/api/vendor';

const S3_BASE_URL = process.env.EXPO_PUBLIC_AWS_IMAGE_URL;

export default function ProductDetails() {
  const route = useRoute<any>();
  const navigation = useNavigation();


const bottomSheetRef = useRef<BottomSheet>(null);
const snapPoints = useMemo(() => ['80%'], []);
  const { productId } = route.params ?? {};

  const [product, setProduct] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [productRes, vendorRes] = await Promise.all([
          getProductsByProductId(productId),
          fetchVendorDetail(),
        ]);

        setProduct(productRes.product);
        setVendor(vendorRes.data);
      } catch (err) {
        console.log('PRODUCT FETCH ERROR', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);

        const res = await fetchProductReview(productId);
        setReviews(res.data ?? []);
      } catch (err) {
        console.log('REVIEW ERROR', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading || !product) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScreenHeader title="Loading..." showBack />
        <View className="flex-1 items-center justify-center">
          <Text>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const price = product?.prices?.[0]?.salePrice ?? product?.prices?.[0]?.listPrice ?? 0;

  const vendorLogo = vendor?.logoUrl
    ? { uri: `${S3_BASE_URL}/${vendor.logoUrl}` }
    : require('@/assets/images/vendor-logo.png');

  return (
    <>
      <Screen scroll>
        <ScreenHeader title={product.title} showBack rightType="notification" />

        {/* HEADER */}
        <VendorHeaderCard
          name={vendor?.businessName ?? 'Vendor'}
          location={`${vendor?.city ?? ''} ${vendor?.state ?? ''}`}
          rating={product.rating}
          logo={vendorLogo}
          mediaImages={
            product.media
              ?.filter((m: any) => m.mediaType === 'image')
              ?.map((m: any) => `${S3_BASE_URL}/${m.mediaUrl}`) ?? []
          }
        />

        {/* DETAILS */}
        <Details
          title={product.title}
          subtitle={product.pricingType}
          rating={product.rating}
          ratingCount={`${product.rating}`}
          price={price}
          description={product.description}
        />

        {/* VENDOR */}
        <VendorDetailsCard
          logo={vendorLogo}
          name={vendor?.businessName}
          location={`${vendor?.streetAddressLine1 ?? ''}, ${vendor?.city ?? ''}`}
          vendorId={vendor?.vendorId}
          serviceId={product.productId}
          email={vendor?.primaryContactEmail}
        />

        {/* REVIEWS */}
        <ReviewSection reviews={reviews} loading={reviewsLoading} />

        {/* ADD TO CART BUTTON */}
     <AppButton variant='default' onPress={() => bottomSheetRef.current?.expand()}>
  Add To Cart
</AppButton>


      </Screen>
              {/* ✅ REUSABLE DIALOG (NO BOTTOMSHEET) */}
<BottomSheet
  ref={bottomSheetRef}
  index={-1} // closed by default
  snapPoints={snapPoints}
  enablePanDownToClose
>
  <BottomSheetView style={{ flex: 1 }}>
    <AddToCartForm
      product={{
        ProductId: String(product.productId),
        title: product.title,
        vendorName: vendor?.businessName ?? '',
        price,
      }}
      onSuccess={() => bottomSheetRef.current?.close()}
    />
  </BottomSheetView>
</BottomSheet>
    </>
  );
}
