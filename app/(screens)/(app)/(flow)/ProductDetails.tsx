import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';

// UI
import { Text } from '@/components/ui/text';
import ScreenHeader from '@/components/common/ScreenHeader';
import { AppButton } from '@/components/common/AppButton';
import Screen from '@/app/provider/Screen';
import VendorHeaderCard from '@/components/ProductDetails/Header';
import Details from '@/components/ProductDetails/Details';
import VendorDetailsCard from '@/components/ProductDetails/VendorDetails';
import ReviewSection from '@/components/ProductDetails/ReviewSection';
import { getProductsByProductId, fetchProductReview } from '@/api/product';
import { fetchVendorDetail } from '@/api/vendor';
import ProductDetailsSkeleton from '@/app/skeleton/category/ProductDetail';
import { router } from 'expo-router';

const S3_BASE_URL = process.env.EXPO_PUBLIC_AWS_IMAGE_URL;

export default function ProductDetails() {
  const route = useRoute<any>();

  const { productId } = route.params ?? {};
const [selectedProduct, setSelectedProduct] = useState<any>(null)
const [selectedSlabIndex, setSelectedSlabIndex] = useState<number | null>(null)
  const [product, setProduct] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [productRes, vendor] = await Promise.all([
          getProductsByProductId(productId),
          fetchVendorDetail(productId),
        ]);
        console.log(JSON.stringify(productRes, null, 2));
        setProduct(productRes.product);
        setVendor(vendor.data);
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
      <Screen>
        <ScreenHeader title="Product" showBack />
        <ProductDetailsSkeleton />
      </Screen>
    );
  }

  const validSlabs = product?.priceSlabs?.filter(
    (s: any) => s.lowerSlab <= (s.upperSlab ?? Infinity)
  );
  const safeSlabs = Array.isArray(validSlabs) ? validSlabs : [];

  const price =
    safeSlabs.length > 0 ? Number(safeSlabs[selectedIndex]?.salePrice ?? 0) : (product?.price ?? 0);
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
          priceSlabs={product.priceSlabs}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />

        {/* VENDOR */}
        <VendorDetailsCard
          name={vendor?.legalEntityName}
          location={`${vendor?.streetAddressLine1}, ${vendor?.city}, ${vendor?.state}`}
          vendorId={vendor?.vendorId?.toString()}
          serviceId={productId?.toString()}
          email={vendor?.primaryContactEmail}
          logo={vendor?.logoUrl ? { uri: `${S3_BASE_URL}/${vendor.logoUrl}` } : undefined}
          facebook={vendor?.facebookURL}
          instagram={vendor?.instagramURL}
          youtube={vendor?.youtubeURL}
        />

        {/* REVIEWS */}
        <ReviewSection reviews={reviews} loading={reviewsLoading} />

        <View className="py-6">
          <AppButton
            variant="default"
            onPress={() =>
              router.push({
                pathname: '/AddProduct',
                params: {
                  productId: product.productId,
                  title: product.title,
                  vendorName: vendor?.businessName,
                  price: price,
                },
              })
            }>
            <Text className="font-bold text-white">Add To Cart</Text>
          </AppButton>
        </View>
      </Screen>
    </>
  );
}
