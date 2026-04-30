import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { AppButton } from '@/components/common/AppButton';

import { fetchBookingDetailsById } from '@/api/cart';
import { createPaymentOrder, verifyPayment } from '@/api/payment';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import CartDetailSkeleton from '@/app/skeleton/cartDetails';


export default function CartProductDetailScreen() {
  const { bookingDraftId } = useLocalSearchParams();
  const cartItems = useSelector((state: any) => state.cart.items);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (bookingDraftId) loadDetails();
  }, [bookingDraftId]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const res = await fetchBookingDetailsById(Number(bookingDraftId));
      setData(res);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <Screen>
        <ScreenHeader title="Cart Detail" showBack />
        <CartDetailSkeleton/>
      </Screen>
    );
  }

  const booking = data?.booking || {};
  const pricing = data?.pricing || {};
  const items = data?.items || [];

  const getFinalPrice = (item: any) => {
    const reduxItem = cartItems.find((i: any) => i.ProductId == item?.id);
    return Number(reduxItem?.price ?? item?.price ?? 0);
  };

  const totalPrice = items.reduce((sum: number, item: any) => {
    return sum + getFinalPrice(item);
  }, 0);

  const handlePayment = async () => {
    try {
      setPaying(true);

      const RazorpayCheckout = require('react-native-razorpay').default;

      const order = await createPaymentOrder({ amount: totalPrice });

      const paymentData = await RazorpayCheckout.open({
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Freaky Chimp',
      });

      const verifyRes = await verifyPayment({
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        amount: order.amount,
        source: 'CART',
        sourceId: data.cartId,
      });

      if (!verifyRes?.success) return;

      Toast.show({ type: 'success', text1: 'Payment successful 🎉' });

      router.replace('/OrdersScreen');
    } catch (e) {
      console.log('Payment error:', e);
    } finally {
      setPaying(false);
    }
  };

  return (
    <Screen scroll>
      <ScreenHeader title="Cart Detail" showBack />

      <View className="mx-2 mt-10">
        {booking?.title && (
          <View className="mb-4 flex-row items-start rounded-3xl py-4">
            <View className="h-20 w-24 items-center justify-center rounded-xl bg-[#FFD180]">
              <Text className="text-5xl">🎂</Text>
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-[#1A1C1E]">{booking?.title ?? 'NA'}</Text>

              <Text className="text-sm text-gray-700">📍 {booking?.city ?? 'NA'}</Text>

              <Text className="mt-1 text-sm text-gray-600">
                {booking?.startTime
                  ? new Date(booking.startTime).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'NA'}
              </Text>

              <Text className="text-sm text-gray-600">
                {booking?.startTime && booking?.endTime
                  ? `${new Date(booking.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} - ${new Date(booking.endTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`
                  : 'NA'}
              </Text>
            </View>
          </View>
        )}
        {/* ITEMS */}

        {items.length > 0 && (
          <View className="gap-4">
            {items.map((item: any, index: number) => {
              const finalPrice = getFinalPrice(item);
              return (
                <Card
                  key={item?.id || index}
                  className="rounded-2xl border border-gray-100 bg-white p-4">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 flex-row">
                      <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                        <Text>🍴</Text>
                      </View>

                      <View className="ml-3 flex-1">
                        <Text className="text-lg font-bold text-gray-900">
                          {item?.title ?? 'NA'}
                        </Text>

                        <Text className="text-xs text-gray-400">📍 {item?.city ?? 'NA'}</Text>

                        <Text className="mt-1 text-xs text-gray-500">
                          {booking?.guestRange ?? 'NA'}
                        </Text>
                      </View>
                    </View>

                    <View className="items-end">
                      {/* ACTION BUTTONS (unchanged) */}
                      <View className="mb-2 flex-row gap-2">
                        <View className="rounded-lg bg-orange-50 p-2">
                          <Feather name="edit-2" size={14} color="#f97316" />
                        </View>

                        <View className="rounded-lg bg-red-50 p-2">
                          <Feather name="trash-2" size={14} color="#ef4444" />
                        </View>
                      </View>

                      {/* PRICE FIX */}
                      <Text className="text-xl font-bold text-orange-500">$ {finalPrice}</Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {/* PRICING */}
        <View className="mt-8">
          <Text className="mb-4 text-xl font-bold">Pricing Breakdown</Text>

          <View className="gap-4 border-b pb-4">
            <View className="flex-row justify-between">
              <Text>Subtotal</Text>
              <Text>$ {totalPrice.toFixed(2)}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text>Service Fee (8%)</Text>
              <Text>$ {(totalPrice * 0.08).toFixed(2)}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text>Tax (10%)</Text>
              <Text>$ {(totalPrice * 0.1).toFixed(2)}</Text>
            </View>
          </View>

          <View className="mt-4 flex-row justify-between">
            <Text className="text-2xl font-bold">Total</Text>
            <Text className="text-2xl font-bold text-orange-500">
              $ {(totalPrice * 1.18).toFixed(2)}
            </Text>
          </View>
        </View>

        <View className="mt-10">
        <View className=" items-center py-4 ">
           <Text className="text-md text-gray-400">🔒 100% secure payments</Text>
        </View>
          <AppButton onPress={handlePayment} disabled={paying}>
            {paying ? 'Processing...' : 'Pay now'}
          </AppButton>
        </View>
      </View>
    </Screen>
  );
}
