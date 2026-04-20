/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { Calendar, Clock, Gift, Coffee, Download, ChevronRight, Info, Star } from 'lucide-react-native';
import dayjs from 'dayjs';

// React Native Reusables components
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// Components
import ScreenHeader from '@/components/common/ScreenHeader';
import OrderCardSkeleton from '@/app/skeleton/OrderCard';

// API
import { fetchBookingbyId } from '@/api/booking';

// Toast
import Toast from 'react-native-toast-message';
import Screen from '@/app/provider/Screen';
import { AppButton } from '@/components/common/AppButton';

type OrderStackParamList = {
  OrderDetailsScreen: {
    bookingId: string;
    status: string;
  };
};

type OrderDetailsRouteProp = RouteProp<OrderStackParamList, 'OrderDetailsScreen'>;

type BookingItem = {
  id: string;
  productName: string;
  productPrice: number;
  quantity: number;
  minGuestCount?: number;
  maxGuestCount?: number;
  bookingStatus: string;
  productId: string;
};

type Booking = {
  id: string;
  contactName: string;
  paymentStatus: string;
  startTime: string;
  endTime: string;
  totalAmount?: number;
  subtotal?: number;
  serviceFee?: number;
  tax?: number;
};

export default function OrderDetailsScreen() {
  const route = useRoute<OrderDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const { bookingId, status } = route.params;
  const [loading, setLoading] = useState(true);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const loadBookingDetails = async () => {
      try {
        setLoading(true);
        const res = await fetchBookingbyId(bookingId);
        setBookingItems(res.data);
        setBooking(res.data[0]);
      } catch (err) {
        console.error('Failed to fetch booking details', err);
        Toast.show({
          type: 'error',
          text1: 'Failed to load order details',
          text2: 'Please try again',
        });
      } finally {
        setLoading(false);
      }
    };
    loadBookingDetails();
  }, [bookingId]);

  const isPaid = booking?.paymentStatus === 'PAID';

const totalAmount = Number(
  booking?.totalAmount ??
    bookingItems.reduce(
      (sum, item) => sum + Number(item.productPrice || 0),
      0
    )
);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date TBD';
    return dayjs(dateString).format('dddd, D MMMM YYYY');
  };

  const formatTimeRange = (start: string, end: string) => {
    if (!start || !end) return 'Time TBD';
    return `${dayjs(start).format('hh:mm A')} - ${dayjs(end).format('hh:mm A')}`;
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'paid') return 'bg-green-100';
    if (statusLower === 'pending') return 'bg-amber-100';
    if (statusLower === 'cancelled') return 'bg-red-100';
    return 'bg-gray-100';
  };

  const getStatusTextColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'paid') return 'text-green-700';
    if (statusLower === 'pending') return 'text-amber-700';
    if (statusLower === 'cancelled') return 'text-red-700';
    return 'text-gray-700';
  };

  const getBookingStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'confirmed') return 'bg-green-100 text-green-700';
    if (statusLower === 'pending') return 'bg-amber-100 text-amber-700';
    if (statusLower === 'cancelled') return 'bg-red-100 text-red-700';
    if (statusLower === 'completed') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const handleDownloadInvoice = () => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Invoice download will be available soon',
    });
  };

  const handlePayNow = () => {
    navigation.navigate('PaymentScreen', { bookingId });
  };

const handleAddReview = () => {
  router.push({
    pathname: '/AddReviewsScreen', // Adjust path based on your file structure
    params: {
      eventId: bookingId,
      productIds: JSON.stringify(bookingItems.map(b => b.productId)),
    },
  });
};

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <ScreenHeader title="Order Details" showBack />
        <View className="p-4 gap-4">
          <OrderCardSkeleton variant="default" />
          <OrderCardSkeleton variant="default" />
        </View>
      </SafeAreaView>
    );
  }

  return (
 
    <Screen scroll>
      <ScreenHeader title="Order Details" rightType="notification" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
        className="flex-1"
      >
        {/* HEADER CARD */}
        <Card className="mx-2 mt-4 mb-6">
          <CardContent className="p-5">
            <View className="flex-row items-start">
              <View className="h-20 w-20 items-center justify-center rounded-2xl  bg-orange-400 shadow-md">
                <Gift size={32} color="white" />
              </View>

              <View className="ml-4 flex-1">
                <View className="flex-row flex-wrap justify-between items-start gap-2">
                  <Text className="flex-1 text-2xl font-bold text-foreground" numberOfLines={2}>
                    {booking?.contactName || 'N/A'}
                  </Text>

                  <Badge className={getStatusColor(booking?.paymentStatus || '')}>
                    <Text className={getStatusTextColor(booking?.paymentStatus || '')}>
                      {isPaid ? 'Paid' : 'Pending'}
                    </Text>
                  </Badge>
                </View>

                <Text className="mt-2 text-sm text-muted-foreground">
                  Order #{bookingId}
                </Text>

                {booking?.startTime && (
                  <View className="mt-4 gap-2">
                    <View className="flex-row items-center">
                      <Calendar size={16} className="text-muted-foreground" />
                      <Text className="ml-2 font-medium text-foreground">
                        {formatDate(booking.startTime)}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Clock size={16} className="text-muted-foreground" />
                      <Text className="ml-2 font-medium text-foreground">
                        {formatTimeRange(booking.startTime, booking.endTime)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </CardContent>
        </Card>

        {/* SERVICES SECTION */}
        <View className="mx-2 mb-6">
          <Text className="mb-4 text-xl font-bold text-foreground">
            Services ({bookingItems.length})
          </Text>

          <View className="gap-3">
            {bookingItems.map((item) => {
              const statusStyle = getBookingStatusColor(item.bookingStatus);
              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-row flex-1 items-start">
                        <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                          <Coffee size={20} color="#2563EB" />
                        </View>

                        <View className="flex-1">
                          <Text className="text-lg font-semibold text-foreground">
                            {item.productName}
                          </Text>
                          {item.minGuestCount && (
                            <Text className="mt-1 text-sm text-muted-foreground">
                              Guests: {item.minGuestCount} - {item.maxGuestCount}
                            </Text>
                          )}
                        </View>
                      </View>

                      <Text className="text-lg font-bold text-primary">
                        ₹{item.productPrice || '0'}
                      </Text>
                    </View>

                    <Separator className="my-3" />

                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center">
                        <Badge variant="secondary">
                          <Text className="font-medium">Qty: {item.quantity || 1}</Text>
                        </Badge>
                      </View>

                      <Badge className={statusStyle.split(' ')[0]}>
                        <Text className={statusStyle.split(' ')[1] || ''}>
                          {item.bookingStatus || 'HOLD'}
                        </Text>
                      </Badge>
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        </View>

        {/* PRICING BREAKDOWN */}
        <View className="mx-2 mb-6">
          <Text className="mb-4 text-xl font-bold text-foreground">
            Pricing Breakdown
          </Text>

          <Card>
            <CardContent className="p-5">
              <View className="gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Subtotal</Text>
                  <Text className="text-foreground">$ {Number(totalAmount || 0).toFixed(2)}</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Service Fee</Text>
                  <Text className="text-muted-foreground">Included</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Tax</Text>
                  <Text className="text-muted-foreground">Included</Text>
                </View>
              </View>

              <Separator className="my-4" />

              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-foreground">Total Amount</Text>
                <Text className="text-2xl font-bold text-primary">$ {Number(totalAmount || 0).toFixed(2)}</Text>
              </View>

              <View className="mt-4 flex-row items-center">
                <Info size={16} className="text-muted-foreground" />
                <Text className="ml-2 text-sm text-muted-foreground">
                  Includes all taxes and service charges
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* REVIEWS & FEEDBACK */}
        <View className="mx-2 mb-6">
          <Text className="mb-4 text-xl font-bold text-foreground">
            Reviews & Feedback
          </Text>

          <Pressable onPress={handleAddReview}>
            <Card className="border-orange-300 bg-primary/5">
              <CardContent className="p-5">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="mb-2 flex-row items-center">
                      <Star size={20} className="text-primary" />
                      <Text className="ml-2 text-lg font-bold text-primary">
                        Share Your Experience
                      </Text>
                    </View>
                    <Text className="text-sm text-primary/80">
                      Rate this event and help us improve our services
                    </Text>
                  </View>

                  <View className="h-12 w-12 items-center justify-center rounded-xl bg-white">
                    <ChevronRight size={24} className="text-primary" />
                  </View>
                </View>
              </CardContent>
            </Card>
          </Pressable>
        </View>

        {/* ACTION BUTTONS */}
        <View className="mx-2">
          {isPaid ? (
            <AppButton
              variant="outline"
              onPress={handleDownloadInvoice}
              
            >
              <Download size={20} className="text-foreground mr-2" />
              Download Invoice
            </AppButton>
          ) : (
            <AppButton onPress={handlePayNow}>
              Pay Now
            </AppButton>
          )}
        </View>
        </ScrollView>
      </Screen>
  );
}