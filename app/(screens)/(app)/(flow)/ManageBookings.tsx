import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';

// Components
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import OrderCard from '@/components/common/card/OrderCard';
import OrderCardSkeleton from '@/app/skeleton/OrderCard';
import EmptyState from '@/components/eventProducts/EmptyProductsState';

// API
import { fetchBookings } from '@/api/booking';

// Icons
import { ShoppingBag, Calendar, MapPin, Clock } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

type Booking = {
  id: string;
  price: number;
  title: string;
  venue: string;
  status: string;
  date?: string;
  time?: string;
};

export default function ManageBookings() {
  const [orders, setOrders] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadBookings(1);
  }, []);

  const loadBookings = async (pageNumber = 1, isRefresh = false) => {
    if (loading || loadingMore) return;

    pageNumber === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const res = await fetchBookings(pageNumber);

      const mappedOrders = res.data.map((item: any) => ({
        id: String(item.id),
        price: item.productPrice || item.totalAmount,
        title: item.productName || item.eventName,
        venue: item.contactName || item.venueName,
        status: item.bookingStatus || item.status,
        date: item.eventDate || item.createdAt,
        time: item.eventTime,
      }));

      setOrders((prev) => (pageNumber === 1 ? mappedOrders : [...prev, ...mappedOrders]));

      setHasMore(pageNumber < (res.pagination?.total_pages || 1));
      setPage(pageNumber);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to load bookings',
        text2: 'Please pull down to refresh',
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadBookings(1, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !loading) {
      loadBookings(page + 1);
    }
  };

  const handleOrderPress = (bookingId: string, status: string) => {
    router.push({
      pathname: '/OrderDetailsScreen',
      params: {
        bookingId: bookingId,
        status: status,
      },
    });
  };
  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('confirmed') || statusLower.includes('approved'))
      return 'bg-green-500';
    if (statusLower.includes('pending')) return 'bg-yellow-500';
    if (statusLower.includes('cancelled')) return 'bg-red-500';
    if (statusLower.includes('completed')) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('confirmed')) return 'Confirmed';
    if (statusLower.includes('pending')) return 'Pending';
    if (statusLower.includes('cancelled')) return 'Cancelled';
    if (statusLower.includes('completed')) return 'Completed';
    return status || 'Unknown';
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
        <EmptyState
          // icon={<ShoppingBag size={48} className="text-muted-foreground" />}
          title="No Bookings Yet"
          subtitle="You haven't made any bookings. Start exploring events to book your first one!"
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-2 pb-8"
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
              //date={item.date}
              onPress={() => handleOrderPress(item.id, item.status)}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
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
