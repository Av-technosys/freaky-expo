import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { router } from 'expo-router';
import { toast } from '@/components/common/ToastManager';

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import OrderCard from '@/components/common/card/OrderCard';
import OrderCardSkeleton from '@/app/skeleton/OrderCard';
import EmptyState from '@/components/eventProducts/EmptyProductsState';
import { fetchBookings } from '@/api/booking';

type Booking = {
  id: string;
  bookingId: number;
  vendorName: string | null;
  vendorLogo: string | null;
  contactName: string | null;
  contactNumber: string | null;
  description: string | null;
  bookingStatus: string;
  startTime: string | null;
  endTime: string | null;
  totalAmount: string | null;
  minGuestCount: number | null;
  maxGuestCount: number | null;
  source: string | null;
};

const mapStatus = (status: string) => {
  const s = String(status).toUpperCase();

  if (s === 'CONFIRMED' || s === 'BOOKED') return 'confirmed';
  if (s === 'HOLD' || s === 'IN_PROGRESS') return 'pending';
  if (s === 'COMPLETED') return 'completed';
  if (s === 'CANCLED' || s === 'CANCELLED' || s === 'EXPIRED') return 'cancelled';

  return 'pending';
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);

    try {
      const res = await fetchBookings(true);
      const list = res?.data || [];
      console.log('Fetched bookings', list);

      const mapped = list.map((item: any) => ({
        id: String(item.bookingId),
        ...item, // Spread all the original data like ManageBookings
      }));

      setOrders(mapped);
    } catch (e) {
      console.log('orders error', e);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleOrderPress = (bookingId: string, status: string) => {
    router.navigate({
      pathname: '/OrderDetailsScreen',
      params: {
        bookingId,
        status,
      },
    });
  };

  return (
    <Screen scroll>
      <ScreenHeader title="My Orders" showBack />

      {loading ? (
        <View className="gap-3 px-4 pt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <OrderCardSkeleton key={i} variant="default" />
          ))}
        </View>
      ) : orders.length === 0 ? (
        <EmptyState title="No Orders Yet" subtitle="You haven't placed any orders yet." />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding:0, paddingBottom: 32, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#F97316"
              colors={['#F97316']}
            />
          }
          renderItem={({ item }) => (
            <OrderCard
              vendorName={item.vendorName}
              vendorLogo={item.vendorLogo}
              contactName={item.contactName}
              contactNumber={item.contactNumber}
              description={item.description}
              bookingStatus={item.bookingStatus}
              startTime={item.startTime}
              endTime={item.endTime}
              totalAmount={item.totalAmount}
              minGuestCount={item.minGuestCount}
              maxGuestCount={item.maxGuestCount}
              source={item.source}
              onPress={() => handleOrderPress(item.id, item.bookingStatus)}
            />
          )}
          ListFooterComponent={
            loading ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#F97316" />
              </View>
            ) : null
          }
        />
      )}
    </Screen>
  );
}
