/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';

// React Native Reusables components
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Components
import ScreenHeader from '@/components/common/ScreenHeader';

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
  id: number;
  bookingId: number;
  productId: number;
  productName: string;
  productImage: string;
  productPrice: string;
  quantity: number;
  contactName: string | null;
  contactNumber: string | null;
  startTime: string;
  endTime: string;
  minGuestCount: number;
  maxGuestCount: number;
  latitude: string | null;
  longitude: string | null;
  bookingStatus: string;
  paymentStatus: string;
  createdAt: string;
  vendorId: number;
};

type Booking = {
  bookingId: number;
  userId: number;
  eventTypeId: number | null;
  source: string;
  contactName: string | null;
  contactNumber: string | null;
  description: string | null;
  startTime: string;
  endTime: string;
  minGuestCount: number;
  maxGuestCount: number;
  latitude: string | null;
  longitude: string | null;
  bookingStatus: string;
  paymentStatus: string;
  totalAmount: string;
  createdAt: string;
  bookedAt: string;
  vendorId: number | null;
  vendorName: string | null;
  vendorLogo: string | null;
  vendorCity: string | null;
  vendorState: string | null;
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
        console.log('Fetched booking details', res);
        setBookingItems(res.data?.items || []);
        setBooking(res.data?.booking || null);
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
  const totalAmount = Number(booking?.totalAmount || 0);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date TBD';
    return dayjs(dateString).format('DD MMM YYYY');
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Time TBD';
    return dayjs(dateString).format('hh:mm A');
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '#10B981';
      case 'completed':
        return '#3B82F6';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      case 'hold':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getGuestCount = (min: number, max: number) => {
    if (min && max && min !== max) {
      return `${min} - ${max} guests`;
    }
    if (max) {
      return `${max} guests`;
    }
    if (min) {
      return `${min} guest${min > 1 ? 's' : ''}`;
    }
    return null;
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
    router.navigate({
      pathname: '/AddReviewsScreen',
      params: {
        eventId: bookingId,
        productIds: JSON.stringify(bookingItems.map(b => b.productId)),
      },
    });
  };

  // Order Card Component for each booking item
  const OrderItemCard = ({ item }: { item: BookingItem }) => {
    const statusColor = getStatusColor(item.bookingStatus);
    const guestCount = getGuestCount(item.minGuestCount, item.maxGuestCount);
    const hasDateTime = item.startTime || item.endTime;

    return (
      <Card className="mt-4 -py-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow">
        <View className="flex-row">
          <View className="w-2" style={{ backgroundColor: statusColor }} />
          
          <View className="flex-1 px-4 py-3">
            <View className="flex-row items-start justify-between gap-3 mb-3">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  {item.productImage ? (
                    <Image 
                      source={{ uri: item.productImage }}
                      className="h-6 w-6 rounded-md"
                      resizeMode="cover"
                    />
                  ) : (
                    <Feather name="coffee" size={16} color="#F97316" />
                  )}
                  <Text className="text-base font-semibold text-black" numberOfLines={1}>
                    {item.productName}
                  </Text>
                </View>
                
                <View className="flex-row items-center gap-2 mt-1.5">
                  <View 
                    className="flex-row items-center gap-1.5 px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: `${statusColor}15`,
                      borderWidth: 0.5,
                      borderColor: `${statusColor}30`
                    }}
                  >
                    <Feather 
                      name={item.bookingStatus?.toLowerCase() === 'confirmed' ? 'check-circle' : 
                            item.bookingStatus?.toLowerCase() === 'completed' ? 'check' :
                            item.bookingStatus?.toLowerCase() === 'pending' ? 'clock' :
                            item.bookingStatus?.toLowerCase() === 'cancelled' ? 'x-circle' : 'info'}
                      size={12} 
                      color={statusColor} 
                    />
                    <Text 
                      className="text-xs font-semibold capitalize"
                      style={{ color: statusColor }}
                    >
                      {item.bookingStatus?.toLowerCase() || 'hold'}
                    </Text>
                  </View>
                  
                  <View className="w-1 h-1 rounded-full bg-gray-300" />
                  <View className="flex-row items-center gap-1">
                    <Feather name="shopping-bag" size={10} color="#9CA3AF" />
                    <Text className="text-xs text-gray-400">
                      Qty {item.quantity}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-lg font-bold text-orange-500">
                  ₹ {Number(item.productPrice).toFixed(2)}
                </Text>
              </View>
            </View>

            <View className="gap-2.5">
              {/* Date & Time */}
              {hasDateTime && (
                <View className="flex-row items-center gap-4">
                  {item.startTime && (
                    <View className="flex-row items-center gap-1.5">
                      <View className="w-5 h-5 rounded-full bg-gray-50 items-center justify-center">
                        <Feather name="calendar" size={11} color="#6B7280" />
                      </View>
                      <Text className="text-xs text-gray-600">{formatDate(item.startTime)}</Text>
                    </View>
                  )}
                  {item.endTime && (
                    <View className="flex-row items-center gap-1.5">
                      <View className="w-5 h-5 rounded-full bg-gray-50 items-center justify-center">
                        <Feather name="clock" size={11} color="#6B7280" />
                      </View>
                      <Text className="text-xs text-gray-600">{formatTime(item.startTime || item.endTime)}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Guest Count */}
              {guestCount && (
                <View className="flex-row items-center gap-1.5">
                  <View className="w-5 h-5 rounded-full bg-gray-50 items-center justify-center">
                    <Feather name="users" size={11} color="#6B7280" />
                  </View>
                  <Text className="text-xs text-gray-600">{guestCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <ScreenHeader title="Order Details" showBack />
        <View className="p-4 gap-4">
          <Card className="mt-4 -py-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow">
            <View className="flex-row p-4">
              <View className="w-16 h-16 bg-gray-200 rounded-xl" />
              <View className="flex-1 ml-3 gap-2">
                <View className="h-5 bg-gray-200 rounded w-3/4" />
                <View className="h-4 bg-gray-200 rounded w-1/2" />
                <View className="h-4 bg-gray-200 rounded w-2/3" />
              </View>
            </View>
          </Card>
          <Card className="mt-4 -py-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow">
            <View className="flex-row p-4">
              <View className="w-16 h-16 bg-gray-200 rounded-xl" />
              <View className="flex-1 ml-3 gap-2">
                <View className="h-5 bg-gray-200 rounded w-3/4" />
                <View className="h-4 bg-gray-200 rounded w-1/2" />
                <View className="h-4 bg-gray-200 rounded w-2/3" />
              </View>
            </View>
          </Card>
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
        {/* MAIN BOOKING CARD */}
        {booking && (
          <Card className="mx-2 -py-6 mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow">
            <View className="flex-row">
              <View className="w-2" style={{ backgroundColor: getStatusColor(booking.bookingStatus) }} />
              
              <View className="flex-1 px-4 py-3">
                <View className="flex-row items-start justify-between gap-3 mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      {booking.vendorLogo ? (
                        <Image 
                          source={{ uri: booking.vendorLogo }}
                          className="h-6 w-6 rounded-md"
                          resizeMode="cover"
                        />
                      ) : (
                        <Feather name="gift" size={16} color="#F97316" />
                      )}
                      <Text className="text-base font-semibold text-black" numberOfLines={1}>
                        {booking.vendorName || 'Booking'}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center gap-2 mt-1.5">
                      <View 
                        className="flex-row items-center gap-1.5 px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: `${getStatusColor(booking.bookingStatus)}15`,
                          borderWidth: 0.5,
                          borderColor: `${getStatusColor(booking.bookingStatus)}30`
                        }}
                      >
                        <Feather 
                          name={booking.bookingStatus?.toLowerCase() === 'confirmed' ? 'check-circle' : 
                                booking.bookingStatus?.toLowerCase() === 'completed' ? 'check' :
                                booking.bookingStatus?.toLowerCase() === 'pending' ? 'clock' :
                                booking.bookingStatus?.toLowerCase() === 'cancelled' ? 'x-circle' : 'info'}
                          size={12} 
                          color={getStatusColor(booking.bookingStatus)} 
                        />
                        <Text 
                          className="text-xs font-semibold capitalize"
                          style={{ color: getStatusColor(booking.bookingStatus) }}
                        >
                          {booking.bookingStatus?.toLowerCase()}
                        </Text>
                      </View>
                      
                      <View className="w-1 h-1 rounded-full bg-gray-300" />
                      <View className="flex-row items-center gap-1">
                        <Feather name={booking.source === 'EVENT' ? 'calendar' : 'shopping-bag'} size={10} color="#9CA3AF" />
                        <Text className="text-xs text-gray-400">
                          {booking.source === 'EVENT' ? 'Event Booking' : 'Regular'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-base text-gray-500">Total</Text>
                    <Text className="text-lg font-bold text-orange-500">
                      ₹ {totalAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View className="gap-2.5">
                  {/* Contact Info */}
                  {(booking.contactName || booking.contactNumber) && (
                    <View className="flex-row items-center gap-3">
                      {booking.contactName && (
                        <View className="flex-row items-center gap-1.5">
                          <View className="w-5 h-5 rounded-full bg-gray-50 items-center justify-center">
                            <Feather name="user" size={11} color="#6B7280" />
                          </View>
                          <Text className="text-xs text-gray-600">{booking.contactName}</Text>
                        </View>
                      )}
                      {booking.contactNumber && (
                        <View className="flex-row items-center gap-1.5">
                          <View className="w-5 h-5 rounded-full bg-gray-50 items-center justify-center">
                            <Feather name="phone" size={11} color="#6B7280" />
                          </View>
                          <Text className="text-xs text-gray-600">{booking.contactNumber}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Date & Time */}
                  {booking.startTime && (
                    <View className="flex-row items-center gap-4">
                      <View className="flex-row items-center gap-1.5">
                        <View className="w-5 h-5 rounded-full bg-gray-50 items-center justify-center">
                          <Feather name="calendar" size={11} color="#6B7280" />
                        </View>
                        <Text className="text-xs text-gray-600">{formatDate(booking.startTime)}</Text>
                      </View>
                      <View className="flex-row items-center gap-1.5">
                        <View className="w-5 h-5 rounded-full bg-gray-50 items-center justify-center">
                          <Feather name="clock" size={11} color="#6B7280" />
                        </View>
                        <Text className="text-xs text-gray-600">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Guest Count */}
                  {getGuestCount(booking.minGuestCount, booking.maxGuestCount) && (
                    <View className="flex-row items-center gap-1.5">
                      <View className="w-5 h-5 rounded-full bg-gray-50 items-center justify-center">
                        <Feather name="users" size={11} color="#6B7280" />
                      </View>
                      <Text className="text-xs text-gray-600">
                        {getGuestCount(booking.minGuestCount, booking.maxGuestCount)}
                      </Text>
                    </View>
                  )}

                  {/* Description */}
                  {booking.description && (
                    <View className="flex-row items-start gap-1.5">
                      <View className="w-5 h-5 rounded-full bg-gray-50 items-center justify-center mt-0.5">
                        <Feather name="file-text" size={11} color="#6B7280" />
                      </View>
                      <Text className="flex-1 text-xs text-gray-600" numberOfLines={2}>
                        {booking.description}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Payment Status Badge */}
                <View className="mt-3 pt-3 border-t border-gray-100">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-500">Payment Status</Text>
                    <View className="flex-row items-center gap-1.5">
                      <View className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-amber-500'}`} />
                      <Text className={`text-xs font-medium ${isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                        {isPaid ? 'PAID' : 'PENDING'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* SERVICES SECTION */}
        {bookingItems.length > 0 && (
          <View className="mx-2 mt-6">
            <Text className="mb-3 text-lg font-bold text-gray-900">
              Services ({bookingItems.length})
            </Text>
            {bookingItems.map((item) => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* REVIEWS & FEEDBACK */}
        <View className="mx-2 mt-6">
          <Pressable onPress={handleAddReview}>
            <Card className="overflow-hidden rounded-xl border border-orange-200 bg-orange-50">
              <View className="flex-row items-center p-4">
                <View className="h-12 w-12 rounded-xl bg-orange-100 items-center justify-center">
                  <Feather name="star" size={22} color="#F97316" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base font-semibold text-orange-600">
                    Share Your Experience
                  </Text>
                  <Text className="text-xs text-orange-500 mt-0.5">
                    Rate this booking and help us improve
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#F97316" />
              </View>
            </Card>
          </Pressable>
        </View>

        {/* ACTION BUTTONS */}
        <View className="mx-2 mt-6 mb-8">
          {isPaid ? (
            <AppButton
              variant="outline"
              onPress={handleDownloadInvoice}
              className="border-orange-200 bg-orange-50"
            >
              <View className="flex-row items-center gap-2">
                <Feather name="download" size={18} color="#F97316" />
                <Text className="text-orange-600 font-semibold">Download Invoice</Text>
              </View>
            </AppButton>
          ) : (
            <AppButton onPress={handlePayNow}>
              <View className="flex-row items-center gap-2">
                <Feather name="credit-card" size={18} color="#fff" />
                <Text className="text-white font-semibold">Pay Now</Text>
              </View>
            </AppButton>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}