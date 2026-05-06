import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import OrderCard from '@/components/common/card/OrderCard';
import OrderCardSkeleton from '@/app/skeleton/OrderCard';
import EmptyState from '@/components/eventProducts/EmptyProductsState';
import { fetchBookings } from '@/api/booking';

type Order = {
  id: string;
  price: number;
  title: string;
  venue: string;
  status: string;
  date?: string;
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
  const [orders, setOrders] = useState<Order[]>([]);
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
        price: Number(item.totalAmount || 0),

        title: item.contactName || 'Booking',

        // 🔥 FIXED
        venue: item.description || '',

        status: mapStatus(item.bookingStatus || 'pending'),

        // 🔥 USE REAL EVENT TIME
        date: item.startTime,

        phone: item.contactNumber || '',
        guestRange: `${item.minGuestCount || 0}-${item.maxGuestCount || 0}`,
      }));

      setOrders(mapped);
    } catch (e) {
      console.log('orders error', e);
      Toast.show({
        type: 'error',
        text1: 'Failed to load orders',
      });
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
    router.push({
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
          contentContainerStyle={{ padding: 8, paddingBottom: 32 }}
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
              title={item.title}
              price={item.price}
              venue={item.venue}
              status={item.status}
              date={item.date}
              onPress={() => handleOrderPress(item.id, item.status)}
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
