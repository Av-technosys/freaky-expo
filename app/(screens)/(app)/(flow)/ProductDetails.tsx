import { View, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
// UI
import { Text } from '@/components/ui/text';
import ScreenHeader from '@/components/common/ScreenHeader';
import { AppButton } from '@/components/common/AppButton';
import { Dialog } from '@/components/ui/dialog';

// Sections (reusable components)
import VendorHeaderCard from '@/components/ProductDetails/Header';
import Details from '@/components/ProductDetails/Details';
import VendorDetailsCard from '@/components/ProductDetails/VendorDetails';
// import ReviewSection from '@/components/ProductDetails/CustomerReviewsSection';
// import AddToCartForm from '@/components/common/AddToCartForm';

// APIs
import { getProductsByProductId, fetchProductReview } from '@/api/product';
import { fetchVendorDetail } from '@/api/vendor';

  const S3_BASE_URL = process.env.EXPO_PUBLIC_AWS_IMAGE_URL;
  
export default function ProductDetails() {
  const route = useRoute<any>();
  const navigation = useNavigation();

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

  const price =
    product?.prices?.[0]?.salePrice ??
    product?.prices?.[0]?.listPrice ??
    0;

  const vendorLogo = vendor?.logoUrl
    ? { uri: `${S3_BASE_URL}/${vendor.logoUrl}` }
    : require('@/assets/images/vendor-logo.png');

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <ScreenHeader
          title={product.title}
          showBack
          rightType="notification"
        />

        <ScrollView showsVerticalScrollIndicator={false}>
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
            location={`${vendor?.streetAddressLine1 ?? ''}, ${
              vendor?.city ?? ''
            }`}
            vendorId={vendor?.vendorId}
            serviceId={product.productId}
            email={vendor?.primaryContactEmail}
          />

          {/* REVIEWS */}
          {/* <ReviewSection
            reviews={reviews}
            loading={reviewsLoading}
          /> */}

          {/* ADD TO CART BUTTON */}
          <Pressable
            className="mt-6 items-center"
            onPress={() => setCartOpen(true)}
          >
            <View className="w-[92%] rounded-xl overflow-hidden">
              <LinearGradient
                colors={['#F97316', '#FACC15']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                  height: 64,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text className="text-white text-xl font-bold">
                  Add to Cart
                </Text>
              </LinearGradient>
            </View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>

      {/* ✅ REUSABLE DIALOG (NO BOTTOMSHEET) */}
      <Dialog
        open={cartOpen}
        onOpenChange={setCartOpen}
        //title="Add to Cart"
      >
        {/* <AddToCartForm
          product={{
            productId: product.productId,
            title: product.title,
            price,
          }}
          onSuccess={() => setCartOpen(false)}
        /> */}
      </Dialog>
    </>
  );
}