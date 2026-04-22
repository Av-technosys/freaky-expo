import { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { AppButton } from '@/components/common/AppButton';

import { fetchBookingDetailsById } from '@/api/cart';
import CartDetailSkeleton from '@/app/skeleton/cartDetails';

export default function CartProductDetailScreen() {
  const { bookingDraftId } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingDraftId) {
      loadDetails();
    }
  }, [bookingDraftId]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const res = await fetchBookingDetailsById(Number(bookingDraftId));
      setData(res);
    } catch (e) {
      console.log('Detail error', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <Screen>
        <ScreenHeader title="Cart Detail" showBack />
        <CartDetailSkeleton />
      </Screen>
    );
  }

  const booking = data?.booking || {};
  const pricing = data?.pricing || {};
  const items = Array.isArray(data?.items) ? data.items : data?.product ? [data.product] : [];

  return (
    <Screen scroll>
      <ScreenHeader title="Cart Detail" showBack />

      <View className="mx-2 mt-10">
        {/* --- HEADER --- */}
        {booking?.title && (
          <View className="mb-4 flex-row items-start rounded-3xl py-4">
            <View className="h-20 w-24 items-center justify-center rounded-xl bg-[#FFD180]">
              <Text className="text-5xl">🎂</Text>
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-[#1A1C1E]">{booking.title}</Text>

              {booking.city && <Text className="text-sm text-gray-700">📍 {booking.city}</Text>}

              {booking.startTime && (
                <Text className="mt-1 text-sm text-gray-600">
                  {new Date(booking.startTime).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              )}

              {booking.startTime && booking.endTime && (
                <Text className="text-sm text-gray-600">
                  {new Date(booking.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(booking.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* --- ITEMS --- */}
        {items.length > 0 && (
          <View className="gap-4">
            {items.map((item: any, index: number) => (
              <Card
                key={item?.id || index}
                className="rounded-2xl border border-gray-100 bg-white p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 flex-row">
                    <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                      <Text>🍴</Text>
                    </View>

                    <View className="ml-3 flex-1">
                      {item?.title && (
                        <Text className="text-lg font-bold text-gray-900">{item.title}</Text>
                      )}

                      {item?.city && <Text className="text-xs text-gray-400">📍 {item.city}</Text>}

                      {booking?.guestRange && (
                        <Text className="mt-1 text-xs text-gray-500">{booking.guestRange}</Text>
                      )}
                    </View>
                  </View>

                  <View className="items-end">
                    <View className="mb-2 flex-row gap-2">
                      {/* EDIT */}
                      <View className="rounded-lg bg-orange-50 p-2">
                        <Feather name="edit-2" size={14} color="#f97316" />
                      </View>

                      {/* DELETE */}
                      <View className="rounded-lg bg-red-50 p-2">
                        <Feather name="trash-2" size={14} color="#ef4444" />
                      </View>
                    </View>

                    {item?.price && (
                      <Text className="text-xl font-bold text-orange-500">$ {item.price}</Text>
                    )}
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* --- PRICING --- */}
        {pricing && (
          <View className="mt-8">
            <Text className="mb-4 text-xl font-bold text-gray-900">Pricing Breakdown</Text>

            <View className="gap-4 border-b border-gray-100 pb-4">
              {pricing?.subtotal && (
                <View className="flex-row justify-between">
                  <Text className="text-lg text-gray-500">Subtotal</Text>
                  <Text className="text-lg font-bold">$ {pricing.subtotal}</Text>
                </View>
              )}

              {pricing?.serviceFee && (
                <View className="flex-row justify-between">
                  <Text className="text-lg text-gray-500">Service Fee (8%)</Text>
                  <Text className="text-lg font-bold">$ {pricing.serviceFee}</Text>
                </View>
              )}

              {pricing?.tax && (
                <View className="flex-row justify-between">
                  <Text className="text-lg text-gray-500">Tax (10%)</Text>
                  <Text className="text-lg font-bold">$ {pricing.tax}</Text>
                </View>
              )}
            </View>

            {pricing?.total && (
              <View className="mt-4 flex-row justify-between">
                <Text className="text-2xl font-bold">Total</Text>
                <Text className="text-2xl font-bold text-orange-500">$ {pricing.total}</Text>
              </View>
            )}
          </View>
        )}
        <View className="mt-8 gap-3">
          {/* PAYMENT CARD */}
          <TouchableOpacity className="flex-row items-center justify-between rounded-2xl border border-blue-100 bg-white p-4">
            <View className="flex-row items-center">
              <View className="mr-3 h-8 w-12 items-center justify-center rounded-md bg-yellow-500">
                <Text className="text-[10px] font-bold text-white">VISA</Text>
              </View>

              <View>
                <Text className="font-bold text-gray-800">•••• •••• •••• 4242</Text>
                <Text className="text-xs text-gray-400">Expires 12/26</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* ADD PAYMENT BUTTON */}
          <AppButton variant="outline">+ Add Payment Method</AppButton>
        </View>

        {/* CTA BUTTON */}
        <View className="mt-6">
          <AppButton>Pay now</AppButton>
        </View>
      </View>
    </Screen>
  );
}
