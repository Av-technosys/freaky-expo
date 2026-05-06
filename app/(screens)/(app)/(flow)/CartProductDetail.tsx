import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import NotFound from '@/components/common/NotFound';
import CartDetailSkeleton from '@/app/skeleton/cartDetails';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { AppButton } from '@/components/common/AppButton';

import { createPaymentOrder, verifyPayment } from '@/api/payment';
import { useCartStore } from '@/store/cartStore';
import LoadingScreen from '@/components/common/LoadingScreen';

type InfoRowProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
};

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
        <Feather name={icon} size={16} color="#f97316" />
      </View>
      <View className="flex-1">
        <Text className="text-xs text-gray-400">{label}</Text>
        <Text className="text-sm font-medium text-gray-800" numberOfLines={2}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function MoneyRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900">₹ {value}</Text>
    </View>
  );
}

export default function CartProductDetailScreen() {
  const { cartItemId, eventId } = useLocalSearchParams<{ cartItemId?: string; eventId?: string }>();
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  // Single Item
  const selectedCartItem = useCartStore((state) => state.getItemById(cartItemId));

  // Event
  const events = useCartStore((state) => state.events);
  const selectedEvent = events.find((e) => e.eventId.toString() === eventId);

  const [paying, setPaying] = useState(false);

  if (!hasHydrated) {
    return (
      <Screen>
        <ScreenHeader title="Cart Detail" showBack />
        <CartDetailSkeleton />
      </Screen>
    );
  }

  const isEvent = !!eventId && !!selectedEvent;
  const isItem = !!cartItemId && !!selectedCartItem;

  if (!isEvent && !isItem) {
    return (
      <Screen>
        <ScreenHeader title="Cart Detail" showBack />
        <NotFound
          title="Not found"
          description="This item or event is no longer available in your cart."
          ctaLabel="Back to Cart"
          onPress={() => router.replace('/cart')}
        />
      </Screen>
    );
  }

  // Calculate generic values
  let title = '';
  let subTitle = '';
  let subtotal = 0;
  let sourceId = 0;
  let source = 'CART' as 'CART' | 'EVENT';
  let bookingDetails: any = {};
  let totalQuantity = 0;
  let displayProducts: any[] = [];

  if (isItem && selectedCartItem) {
    bookingDetails = selectedCartItem.bookingDetails;
    totalQuantity = selectedCartItem.quantity || 1;
    const itemPrice = Number(selectedCartItem.price || 0);
    subtotal = itemPrice * totalQuantity;
    sourceId = Number(selectedCartItem.bookingDraftId || 0);
    source = 'CART';
    title = selectedCartItem.title || 'Cart Item';
    subTitle = selectedCartItem.vendorName || 'Vendor not specified';
  } else if (isEvent && selectedEvent) {
    bookingDetails = {
      fullName: selectedEvent.eventDetails.contactName,
      phone: selectedEvent.eventDetails.contactNumber,
      date: selectedEvent.eventDetails.startTime,
      time: selectedEvent.eventDetails.startTime
        ? new Date(selectedEvent.eventDetails.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '',
      guests: `${selectedEvent.eventDetails.minGuestCount} - ${selectedEvent.eventDetails.maxGuestCount}`,
    };
    totalQuantity = selectedEvent.services.length;
    subtotal = selectedEvent.services.reduce((sum, s) => sum + (Number(s.price || 0) * (s.quantity || 1)), 0);
    sourceId = selectedEvent.eventId;
    source = 'EVENT';
    title = `Event: ${selectedEvent.eventDetails.contactName}`;
    subTitle = `${totalQuantity} Services included`;
    displayProducts = selectedEvent.services;
  }

  const serviceFee = subtotal * 0.08;
  const tax = subtotal * 0.1;
  const total = subtotal + serviceFee + tax;

  const eventDate = bookingDetails.date ? new Date(bookingDetails.date) : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : 'Date not specified';

  const handlePayment = async () => {
    try {
      setPaying(true)

      if (!sourceId) {
        Toast.show({ type: 'error', text1: 'Invalid booking' })
        return
      }

      const RazorpayCheckout = require('react-native-razorpay').default

      const order = await createPaymentOrder({
        source,
        sourceId
      })

      const paymentData = await RazorpayCheckout.open({
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Freaky Chimp',
        prefill: {
          contact: bookingDetails.phone,
          name: bookingDetails.fullName,
        },
      })

      await verifyPayment({
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        amount: 0,
        source: 'CART',
        sourceId: 0
      })

      Toast.show({ type: 'success', text1: 'Payment successful' })
      router.replace('/ManageBookings')

    } catch (e) {
      console.log('Payment error:', e)
      Toast.show({ type: 'error', text1: 'Payment failed or cancelled' })
    } finally {
      setPaying(false)
    }
  }

  if (paying) return <LoadingScreen />

  return (
    <Screen scroll>
      <ScreenHeader title={isEvent ? "Event Checkout" : "Cart Detail"} showBack />

      <View className=" pb-8 pt-6">
        {/* TOP SUMMARY */}
        <View className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow">
          <View className="flex-row">
            <View className="w-16 items-center justify-center bg-orange-400">
              <Feather name={isEvent ? "calendar" : "shopping-bag"} size={26} color="#fff" />
            </View>

            <View className="flex-1 px-4 py-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-950" numberOfLines={2}>
                    {title}
                  </Text>
                  <Text className="mt-1 text-sm text-gray-500" numberOfLines={1}>
                    {subTitle}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-xs text-gray-400">Total</Text>
                  <Text className="text-xl font-bold text-orange-500">₹ {total.toFixed(2)}</Text>
                </View>
              </View>

              {!isEvent && isItem && selectedCartItem && (
                <View className="mt-4 flex-row gap-2">
                  <View className="flex-1 rounded-xl bg-orange-50 px-3 py-2">
                    <Text className="text-xs text-orange-500">Quantity</Text>
                    <Text className="font-semibold text-gray-900">{totalQuantity}</Text>
                  </View>
                  <View className="flex-1 rounded-xl bg-orange-50 px-3 py-2">
                    <Text className="text-xs text-orange-500">Unit Price</Text>
                    <Text className="font-semibold text-gray-900">₹ {Number(selectedCartItem.price || 0).toFixed(2)}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* IF IT'S AN EVENT, LIST THE PRODUCTS */}
        {isEvent && (
          <Card className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
            <Text className="mb-4 text-base font-bold text-gray-950">Services Included</Text>
            <View className="gap-3">
              {displayProducts.map((p, index) => (
                <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-50">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-800">{p.title || p.productName}</Text>
                    <Text className="text-xs text-gray-500">Qty: {p.quantity || 1}</Text>
                  </View>
                  <Text className="font-semibold text-gray-900">₹ {(Number(p.price) * Number(p.quantity || 1)).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        <Card className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
          <Text className="mb-4 text-base font-bold text-gray-950">Booking Information</Text>
          <View className="gap-4">
            <InfoRow icon="calendar" label="Date" value={formattedDate} />
            <InfoRow
              icon="clock"
              label="Time"
              value={bookingDetails.time || 'Time not specified'}
            />
            <InfoRow
              icon="users"
              label="Guests"
              value={
                bookingDetails.guests ? `${bookingDetails.guests} Guests` : 'Guests not specified'
              }
            />
            <InfoRow
              icon="map-pin"
              label="Address"
              value={bookingDetails.address || 'Address not specified'}
            />
          </View>
        </Card>

        <Card className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
          <Text className="mb-4 text-base font-bold text-gray-950">Customer Details</Text>
          <View className="gap-4">
            <InfoRow
              icon="user"
              label="Name"
              value={bookingDetails.fullName || 'Name not specified'}
            />
            <InfoRow
              icon="phone"
              label="Phone"
              value={bookingDetails.phone || 'Phone not specified'}
            />
            {!isEvent && (
              <InfoRow
                icon="message-square"
                label="Vendor Note"
                value={bookingDetails.vendorNote || 'No note added'}
              />
            )}
          </View>
        </Card>

        <Card className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
          <Text className="mb-4 text-base font-bold text-gray-950">Payment Summary</Text>

          <View className="gap-3 border-b border-gray-100 pb-4">
            <MoneyRow label={isEvent ? "Services Total" : `Item price x ${totalQuantity}`} value={subtotal.toFixed(2)} />
            <MoneyRow label="Service Fee (8%)" value={serviceFee.toFixed(2)} />
            <MoneyRow label="Tax (10%)" value={tax.toFixed(2)} />
          </View>

          <View className="mt-4 flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-gray-400">Amount payable</Text>
              <Text className="text-sm text-gray-500">Secure checkout</Text>
            </View>
            <Text className="text-2xl font-bold text-orange-500">₹ {total.toFixed(2)}</Text>
          </View>
        </Card>

        <View className="mt-6">
          <AppButton onPress={handlePayment} disabled={paying || subtotal <= 0}>
            {paying ? 'Processing...' : 'Pay now'}
          </AppButton>
        </View>
      </View>
    </Screen>
  );
}
