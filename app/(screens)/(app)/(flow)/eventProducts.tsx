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

type Step = {
  id: number;
  key: string;
  label: string;
};

type StepStatus = 'initial' | 'green' | 'yellow' | 'red';

export default function EventProductSection() {
  const navigation = useNavigation();
  const eventId = useAppSelector(state => state.event.eventId);
  const bookingDetails = useAppSelector(state => state.event.bookingDetails);
  const selections = useAppSelector(state => state.event.selections);
  const eventType = useAppSelector(state => state.event.eventType);
  const event = useAppSelector(state => state.event);
  const dispatch = useAppDispatch();

  const [steps, setSteps] = useState<Step[]>([]);
  const filterSheetRef = useRef<BottomSheet>(null);
  const [activeStep, setActiveStep] = useState<string>('');
  const insets = useSafeAreaInsets();
  const [stepStatus, setStepStatus] = useState<Record<string, StepStatus>>({});
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 10;
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

  const activeProductTypeId = steps.find(step => step.key === activeStep)?.id;

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
    if (!eventId || !selectedProductId) {
      Toast.show({ type: 'error', text1: 'Missing event or product information.' });
      return;
    }
    if (!startTime || !endTime) {
      Toast.show({ type: 'error', text1: 'Please select start and end times.' });
      return;
    }
    try {
      await saveInBookingDraft({
        eventId,
        productId: selectedProductId,
        quantity,
        startTime: startTime?.toISOString(),
        endTime: endTime?.toISOString(),
      });
      dispatch(addProduct({ step: activeStep, productId: selectedProductId }));
      setShowAddProductModal(false);
      Toast.show({ type: 'success', text1: 'Product added successfully' });
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Failed to add product' });
    }
  };

  const fetchProducts = useCallback(async (productTypeId: number, pageNumber: number) => {
    setLoading(true);
    try {
      const res = await getProductsByProductTypeId(productTypeId, pageNumber, PAGE_SIZE);
      const newProducts = res.data ?? [];
      setProducts(prev => pageNumber === 1 ? newProducts : [...prev, ...newProducts]);
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
        const keys = apiSteps.map(s => s.key);
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
    steps.forEach(step => { initialStatus[step.key] = 'initial'; });
    setStepStatus(initialStatus);
  }, [steps]);

  const STEPS = steps.filter(step => enabledSteps.includes(step.key));
  const activeIndex = STEPS.findIndex((s: { key: string }) => s.key === activeStep);
  const isLastStep = activeIndex === STEPS.length - 1;

  const handleContinue = async () => {
    const currentSelections = selections[activeStep] ?? [];
    const hasItems = currentSelections.length > 0;
    setStepStatus(prev => ({ ...prev, [activeStep]: hasItems ? 'green' : 'red' }));
    
    if (!isLastStep) {
      setActiveStep(STEPS[activeIndex + 1].key);
      return;
    }
    
    try {
      if (!bookingDetails) throw new Error('Booking details missing');
      
      const bookingRes = await createBooking({
        eventTypeId: bookingDetails.eventTypeId,
        source: 'EVENT',
        contactName: bookingDetails.contactName,
        contactNumber: bookingDetails.contactNumber,
        description: bookingDetails.description,
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
        minGuestCount: bookingDetails.minGuestCount,
        maxGuestCount: bookingDetails.maxGuestCount,
        latitude: bookingDetails.latitude,
        longitude: bookingDetails.longitude,
      });
      
      const bookingId = bookingRes.data.bookingId;
      const allProductIds = Object.values(selections).flat();
      const bookingItems = allProductIds.map(productId => ({
        productId,
        quantity: 1,
        contactName: bookingDetails.contactName,
        contactNumber: bookingDetails.contactNumber,
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
        minGuestCount: bookingDetails.minGuestCount,
        maxGuestCount: bookingDetails.maxGuestCount,
        latitude: bookingDetails.latitude,
        longitude: bookingDetails.longitude,
      }));
      
      await addItemToBooking({ bookingId, items: bookingItems });
      navigation.getParent()?.navigate('FlowStack', { screen: 'TestingPayment' });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Failed to create booking' });
    }
  };

  const handleSkip = () => {
    const currentSelections = selections[activeStep] ?? [];
    setStepStatus(prev => ({ ...prev, [activeStep]: currentSelections.length > 0 ? 'green' : 'red' }));
    const next = STEPS[activeIndex + 1];
    setActiveStep(next.key);
  };

  return (
    <Screen >
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
            keyExtractor={item => item.productId.toString()}
        contentContainerStyle={{ paddingBottom: 120 }} // 👈 important
            onEndReached={() => { if (products.length > 0) loadMore(); }}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
              <EventProductCard
                id={item?.productId}
                title={item.title}
                guests={`${item.minQuantity ?? 1} - ${item.maxQuantity ?? '∞'}`}
                menu={item.pricingType ?? ''}
                rating={item.rating}
                price={item.currentPriceBook}
                image={item.bannerImage ? { uri: `${process.env.EXPO_PUBLIC_AWS_IMAGE_URL}/${item.bannerImage}` } : require('@/assets/images/image_not_found.jpg')}
                added={(selections[activeStep] ?? []).includes(item.productId)}
                disabled={!item.isAvailable}
                onAdd={() => {
                  setSelectedProductId(item.productId);
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
            ListFooterComponent={loading ? <View className="py-4"><ActivityIndicator size="small" /></View> : null}
          />
        )}

        <View style={{ paddingBottom: insets.bottom + 20 || 16, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e5e5e5' }}>
          <View className="px-4 pt-3">
            <View className="flex-row justify-between items-center gap-8 pb-3">
              {!isLastStep && (
                <Pressable onPress={handleSkip} className="flex-1 h-14 rounded-2xl border-2 bg-white border-yellow-400 justify-center">
                  <Text className="text-center text-base font-semibold text-black">Skip</Text>
                </Pressable>
              )}
              <Pressable onPress={handleContinue} className="flex-1 h-14 rounded-2xl overflow-hidden">
                <LinearGradient colors={['#F97316', '#FACC15']} className="flex-1 justify-center">
                  <Text className="text-white text-center text-lg font-bold">Continue</Text>
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
      />

      <ServiceSelectionModal
        visible={showServiceModal}
        steps={steps}
        tempEnabledSteps={tempEnabledSteps}
        onClose={() => setShowServiceModal(false)}
        onStepToggle={(stepKey) => {
          setTempEnabledSteps(prev =>
            prev.includes(stepKey) ? prev.filter(k => k !== stepKey) : [...prev, stepKey]
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