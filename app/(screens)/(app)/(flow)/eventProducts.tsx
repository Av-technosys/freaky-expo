/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useNavigation } from '@react-navigation/native';
import { getProductsByProductTypeId, getProductTypes } from '@/api/product';
import { deleteEventItem, saveInBookingDraft } from '@/api/event';
import { addItemToBooking, createBooking } from '@/api/booking';
import Toast from 'react-native-toast-message';

// Components
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '@/app/provider/Screen';
import StepsHeader from '@/components/eventProducts/StepsHeader';
import EventTopHeader from '@/components/eventProducts/EventTopHeader';
import EventProductCard from '@/components/common/card/EventProductCard';
import AddProductModal from '@/components/eventProducts/AddProductModal';
import ServiceSelectionModal from '@/components/eventProducts/ServiceSelectionModal';
import ProductSkeleton from '@/app/skeleton/ProductSkeleton';
import EmptyProductsState from '@/components/eventProducts/EmptyProductsState';
import FilterBottomSheet from '@/components/common/form/FilterForm';

import { addProduct, removeProduct } from '@/store/slices/eventSlice';
import { PAGE_SIZE } from '@/const/global';
import { router } from 'expo-router';
import { createPaymentOrder, verifyPayment } from '@/api/payment';
import ScreenHeader from '@/components/common/ScreenHeader';

type Step = {
  id: number;
  key: string;
  label: string;
};

type StepStatus = 'initial' | 'green' | 'yellow' | 'red';

export default function EventProductSection() {
  const navigation = useNavigation();
  const eventId = useAppSelector((state) => state.event.eventId);
  const bookingDetails = useAppSelector((state) => state.event.bookingDetails);
  const selections = useAppSelector((state) => state.event.selections);
  console.log('Current selections from Redux:', selections);
  const eventType = useAppSelector((state) => state.event.eventType);
  const event = useAppSelector((state) => state.event);
  const dispatch = useAppDispatch();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSlabIndex, setSelectedSlabIndex] = useState<number | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const filterSheetRef = useRef<BottomSheet>(null);
  const [activeStep, setActiveStep] = useState<string>('');
  const insets = useSafeAreaInsets();
  const [stepStatus, setStepStatus] = useState<Record<string, StepStatus>>({});
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [enabledSteps, setEnabledSteps] = useState<string[]>([]);
  const [tempEnabledSteps, setTempEnabledSteps] = useState<string[]>([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<any | null>(null);
  const [endTime, setEndTime] = useState<any | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const activeProductTypeId = steps.find((step) => step.key === activeStep)?.id;

  // Helper functions
  const formatDate = (isoDate?: string) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPossessiveName = (fullName?: string) => {
    if (!fullName) return 'User’s';
    return `${fullName.trim().split(' ')[0]}’s`;
  };

  const eventName = eventType?.name || 'Event';
  const eventImage = eventType?.image
    ? { uri: eventType.image }
    : require('@/assets/images/image_not_found.jpg');
  const customerName = getPossessiveName(event?.bookingDetails?.contactName);
  const formattedDate = formatDate(event?.bookingDetails?.startTime);

  const removeProductFromDraft = async (eventItemId: number) => {
    if (!eventItemId) {
      console.warn('eventItemId missing, skipping draft delete');
      return;
    }
    try {
      await deleteEventItem(eventItemId);
    } catch (error) {
      console.error('Failed to remove booking draft', error);
    }
  };

  const handleConfirmAddProduct = async () => {
    console.log('Adding product with details:', {
      eventId,
      selectedProductId,
    });
    if (!eventId || !selectedProductId) {
      Toast.show({ type: 'error', text1: 'Missing event or product information.' });
      return;
    }

    if (!startTime || !endTime) {
      Toast.show({ type: 'error', text1: 'Please select start and end times.' });
      return;
    }

    if (selectedProduct?.pricingType === 'TIER' && selectedSlabIndex === null) {
      Toast.show({ type: 'error', text1: 'Please select a price slab.' });
      return;
    }

    const slabIndex = selectedSlabIndex ?? undefined;

    let price;

    if (selectedProduct?.pricingType === 'TIER') {
      price =
        slabIndex !== undefined
          ? Number(selectedProduct?.priceSlabs?.[slabIndex]?.salePrice)
          : undefined;
    } else {
      price = Number(selectedProduct?.price);
    }
    try {
      await saveInBookingDraft({
        eventId,
        productId: selectedProductId,
        quantity,
        slabIndex,
        price,
        startTime: startTime?.toISOString(),
        endTime: endTime?.toISOString(),
      });

      dispatch(
        addProduct({
          step: activeStep,
          productId: selectedProductId,
          slabIndex,
          price,
          quantity,
        })
      );

      setShowAddProductModal(false);

      Toast.show({ type: 'success', text1: 'Product added successfully' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to add product' });
    }
  };

  const fetchProducts = useCallback(async (productTypeId: number, pageNumber: number) => {
    setLoading(true);
    try {
      const res = await getProductsByProductTypeId(productTypeId, pageNumber, PAGE_SIZE);
      const newProducts = res.data ?? [];
      setProducts((prev) => (pageNumber === 1 ? newProducts : [...prev, ...newProducts]));
      setHasMore(pageNumber < res.pagination.total_pages);
      setPage(pageNumber);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!activeProductTypeId) return;
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(activeProductTypeId, 1);
  }, [activeProductTypeId, fetchProducts]);

  const loadMore = () => {
    if (!hasMore || loading || !activeProductTypeId) return;
    fetchProducts(activeProductTypeId, page + 1);
  };

  useEffect(() => {
    const loadProductTypes = async () => {
      try {
        const res = await getProductTypes();
        const apiSteps: Step[] = res.data.map((item: any) => ({
          id: item.id,
          key: item.name,
          label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
        }));
        setSteps(apiSteps);
        const keys = apiSteps.map((s) => s.key);
        const initialEnabled = keys.slice(0, 4);
        setEnabledSteps(initialEnabled);
        setTempEnabledSteps(initialEnabled);
        setActiveStep(initialEnabled[0]);
      } catch (error) {
        console.error('Failed to fetch product types', error);
      }
    };
    loadProductTypes();
  }, []);

  useEffect(() => {
    if (!steps.length) return;
    const initialStatus: Record<string, StepStatus> = {};
    steps.forEach((step) => {
      initialStatus[step.key] = 'initial';
    });
    setStepStatus(initialStatus);
  }, [steps]);

  const STEPS = steps.filter((step) => enabledSteps.includes(step.key));
  const activeIndex = STEPS.findIndex((s: { key: string }) => s.key === activeStep);
  const isLastStep = activeIndex === STEPS.length - 1;

  const handleContinue = async () => {
    const currentSelections = selections[activeStep] ?? [];
    const hasItems = currentSelections.length > 0;

    setStepStatus((prev) => ({
      ...prev,
      [activeStep]: hasItems ? 'green' : 'red',
    }));

    if (!isLastStep) {
      setActiveStep(STEPS[activeIndex + 1].key);
      return;
    }

    try {
      if (!bookingDetails) throw new Error('Booking details missing');
      const allItems = Object.values(selections).flat();

      const totalAmount = allItems.reduce((sum, item) => {
        const price = Number(item.price || 0);
        const qty = Number(item.quantity || 1);
        return sum + price * qty;
      }, 0);

      const RazorpayCheckout = require('react-native-razorpay').default;

      const order = await createPaymentOrder({
        amount: totalAmount,
      });
      const paymentData = await RazorpayCheckout.open({
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY || '',
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Freaky Chimp',
        prefill: {
          contact: bookingDetails.contactNumber,
          name: bookingDetails.contactName,
        },
        theme: { color: '#F97316' },
      });

      setLoading(true);

      await verifyPayment({
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        amount: order.amount,
        source: 'EVENT',
        sourceId: eventId || 0,
        bookingDetails,
      });

      // if (!verifyRes?.success) {
      //   throw new Error('Payment verification failed')
      // }

      setLoading(false);

      router.push('/ManageBookings');
    } catch (error) {
      setLoading(false);

      Toast.show({
        type: 'error',
        text1: 'Payment failed or cancelled',
      });
    }
  };
  const handleSkip = () => {
    const currentSelections = selections[activeStep] ?? [];
    setStepStatus((prev) => ({
      ...prev,
      [activeStep]: currentSelections.length > 0 ? 'green' : 'red',
    }));
    const next = STEPS[activeIndex + 1];
    setActiveStep(next.key);
  };

  {
    loading && (
      <View className="absolute inset-0 z-50 items-center justify-center bg-white">
        <View className="h-12 w-3/4 overflow-hidden rounded-xl">
          <LinearGradient
            colors={['#F97316', '#FACC15']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="absolute inset-0"
          />
          <View className="flex-1 items-center justify-center">
            <Text className="font-bold text-white">Processing Payment...</Text>
          </View>
        </View>
      </View>
    );
  }
  return (
    <Screen>
      <ScreenHeader title="Events" showBack rightType="menu" />
      <EventTopHeader
        title={customerName}
        subtitle={eventName}
        date={formattedDate}
        image={eventImage}
        onPress={() => {}}
      />

      <StepsHeader
        steps={STEPS}
        activeStep={activeStep}
        stepStatus={stepStatus}
        enabledSteps={enabledSteps}
        tempEnabledSteps={tempEnabledSteps}
        onStepPress={setActiveStep}
        onFilterPress={() => filterSheetRef.current?.expand()}
        onPlusPress={() => {
          setTempEnabledSteps(enabledSteps);
          setShowServiceModal(true);
        }}
      />

      {loading && products.length === 0 ? (
        <ProductSkeleton />
      ) : products.length === 0 ? (
        <EmptyProductsState />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.productId.toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
          onEndReached={() => {
            if (products.length > 0) loadMore();
          }}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <EventProductCard
              id={item?.productId}
              title={item.title}
              guests={`${item.minQuantity ?? 1} - ${item.maxQuantity ?? '∞'}`}
              menu={item.pricingType ?? ''}
              rating={item.rating}
              price={item.price}
              pricingType={item.pricingType}
              priceSlabs={item.priceSlabs}
              image={
                item.bannerImage
                  ? { uri: `${process.env.EXPO_PUBLIC_AWS_IMAGE_URL}/${item.bannerImage}` }
                  : require('@/assets/images/image_not_found.jpg')
              }
              added={(selections[activeStep] ?? []).some((p) => p.productId === item.productId)}
              disabled={!item.isAvailable}
              onAdd={() => {
                setSelectedProductId(item.productId);
                setSelectedProduct(item);
                setSelectedSlabIndex(null);
                setStartTime(null);
                setEndTime(null);
                setQuantity(1);
                setShowAddProductModal(true);
              }}
              onRemove={() => {
                removeProductFromDraft(item.eventItemId);
                dispatch(removeProduct({ step: activeStep, productId: item.productId }));
              }}
            />
          )}
          ListFooterComponent={
            loading ? (
              <View className="py-4">
                <ActivityIndicator size="small" />
              </View>
            ) : null
          }
        />
      )}

      <View
        style={{
          paddingBottom: insets.bottom,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
        }}>
        <View className="px-2 pt-3">
          <View className="flex-row items-center justify-between gap-8 pb-3">
            {!isLastStep && (
              <Pressable
                onPress={handleSkip}
                className="h-14 flex-1 justify-center rounded-2xl border-2 border-yellow-400 bg-white">
                <Text className="text-center text-base font-semibold text-black">Skip</Text>
              </Pressable>
            )}
            <Pressable onPress={handleContinue} className="h-14 flex-1 overflow-hidden rounded-2xl">
              <LinearGradient colors={['#F97316', '#FACC15']} className="flex-1 justify-center">
                <Text className="text-center text-lg font-bold text-white">Continue</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>

      <AddProductModal
        visible={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        startTime={startTime}
        endTime={endTime}
        quantity={quantity}
        showStartPicker={showStartPicker}
        showEndPicker={showEndPicker}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onQuantityChange={setQuantity}
        onShowStartPickerChange={setShowStartPicker}
        onShowEndPickerChange={setShowEndPicker}
        onConfirm={handleConfirmAddProduct}
        product={selectedProduct}
        selectedSlabIndex={selectedSlabIndex}
        setSelectedSlabIndex={setSelectedSlabIndex}
      />

      <ServiceSelectionModal
        visible={showServiceModal}
        steps={steps}
        tempEnabledSteps={tempEnabledSteps}
        onClose={() => setShowServiceModal(false)}
        onStepToggle={(stepKey) => {
          setTempEnabledSteps((prev) =>
            prev.includes(stepKey) ? prev.filter((k) => k !== stepKey) : [...prev, stepKey]
          );
        }}
        onConfirm={() => {
          setEnabledSteps(tempEnabledSteps);
          if (!tempEnabledSteps.includes(activeStep)) {
            setActiveStep(tempEnabledSteps[0]);
          }
          setShowServiceModal(false);
        }}
      />

      <FilterBottomSheet ref={filterSheetRef} />
    </Screen>
  );
}
