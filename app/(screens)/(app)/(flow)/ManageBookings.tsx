import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import OrderCard from '@/components/common/card/OrderCard';
import OrderCardSkeleton from '@/app/skeleton/OrderCard';
import EmptyState from '@/components/eventProducts/EmptyProductsState';

import { fetchBookings } from '@/api/booking';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

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

export default function ManageBookings() {
  const [orders, setOrders] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const mapBookingStatus = (status: string) => {
    const s = String(status).toUpperCase();

    switch (s) {
      case 'CONFIRMED':
      case 'BOOKED':
        return 'confirmed';

      case 'HOLD':
      case 'IN_PROGRESS':
        return 'pending';

      case 'COMPLETED':
        return 'completed';

      case 'CANCLED':
      case 'EXPIRED':
        return 'cancelled';

      default:
        return 'pending';
    }
  };
  useEffect(() => {
    loadBookings();
  }, []);

 const loadBookings = async () => {
  setLoading(true);

  try {
    const res = await fetchBookings(false);

    const list = res?.data || [];
    console.log('Fetched bookings', list);
const mapped = list.map((item: any) => {
  // Pass the raw data directly to OrderCard since it now handles all the fields
  return {
    id: String(item.bookingId),
    ...item, // Spread all the original data
  };
});

    setOrders(mapped);
  } catch (err) {
    console.error('Failed to fetch bookings', err);

    Toast.show({
      type: 'error',
      text1: 'Failed to load bookings',
    });
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const handleRefresh = () => {
    setRefreshing(true);
    loadBookings();
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
      <ScreenHeader title="My Bookings" rightType="menu" showBack />

      {loading ? (
        <View className="gap-3 px-4 pt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <OrderCardSkeleton key={i} variant="default" />
          ))}
        </View>
      ) : orders.length === 0 ? (
        <EmptyState title="No Bookings Yet" subtitle="You haven't made any bookings yet." />
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
