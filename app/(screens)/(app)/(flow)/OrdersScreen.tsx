import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Calendar, Clock, MapPin, Building, ChevronRight } from 'lucide-react-native';

// React Native Reusables components
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';

// Types
type Order = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  status: string;
  price?: number;
  image?: string;
};

// Sample data
const ORDERS: Order[] = [
  {
    id: '1',
    title: "Abhash's Birthday",
    date: 'Saturday, August 25, 2025',
    time: '6:00 PM - 11:00 PM',
    venue: 'The Grand Palace',
    location: 'Jaipur, Rajasthan',
    status: 'Paid',
    price: 25000,
  },
  {
    id: '2',
    title: "Corporate Annual Meet",
    date: 'Saturday, September 15, 2025',
    time: '10:00 AM - 6:00 PM',
    venue: 'Business Convention Center',
    location: 'Mumbai, Maharashtra',
    status: 'Confirmed',
    price: 150000,
  },
  {
    id: '3',
    title: "Wedding Reception",
    date: 'Saturday, October 5, 2025',
    time: '7:00 PM - 12:00 AM',
    venue: 'Royal Garden Resort',
    location: 'Udaipur, Rajasthan',
    status: 'Pending',
    price: 500000,
  },
];

// Order Card Component
function OrderCardComponent({ order, onPress }: { order: Order; onPress: () => void }) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const statusStyle = getStatusColor(order.status);

  return (
    <Pressable onPress={onPress}>
      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-0">
          <View className="p-4">
            {/* Header */}
            <View className="flex-row justify-between items-start mb-3">
              <Text className="flex-1 text-lg font-semibold text-foreground" numberOfLines={1}>
                {order.title}
              </Text>
              <Badge variant={getStatusVariant(order.status)} className="ml-2">
                <Text className="text-xs font-medium">{order.status}</Text>
              </Badge>
            </View>

            {/* Event Details */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Calendar size={14} className="text-muted-foreground" />
                <Text className="text-sm text-muted-foreground">{order.date}</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Clock size={14} className="text-muted-foreground" />
                <Text className="text-sm text-muted-foreground">{order.time}</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Building size={14} className="text-muted-foreground" />
                <Text className="text-sm text-muted-foreground">{order.venue}</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <MapPin size={14} className="text-muted-foreground" />
                <Text className="text-sm text-muted-foreground">{order.location}</Text>
              </View>
            </View>

            <Separator className="my-3" />

            {/* Footer */}
            <View className="flex-row justify-between items-center">
              {order.price && (
                <View>
                  <Text className="text-xs text-muted-foreground">Total Amount</Text>
                  <Text className="text-lg font-bold text-primary">₹{order.price.toLocaleString()}</Text>
                </View>
              )}
              
              <Button variant="ghost" size="sm" className="flex-row items-center gap-1">
                <Text className="text-sm text-primary">View Details</Text>
                <ChevronRight size={16} className="text-primary" />
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}

// Empty State Component
function EmptyOrdersState() {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Text className="text-4xl">📦</Text>
      </View>
      <Text className="mt-4 text-center text-2xl font-bold text-foreground">No Orders Yet</Text>
      <Text className="mt-2 text-center text-muted-foreground">
        You haven't placed any orders yet. Start exploring!
      </Text>
    </View>
  );
}

// Main Component
export default function OrdersScreen() {
  const handleOrderPress = (orderId: string, status: string) => {
    router.push({
      pathname: '/OrderDetailsScreen',
      params: {
        bookingId: orderId,
        status: status,
      },
    });
  };

  return (
    <Screen scroll>
      <ScreenHeader title="My Orders" rightType="notification" showBack />

      {ORDERS.length === 0 ? (
        <EmptyOrdersState />
      ) : (
        <View className="px-4 pt-2 pb-8">
          {ORDERS.map((order) => (
            <OrderCardComponent
              key={order.id}
              order={order}
              onPress={() => handleOrderPress(order.id, order.status)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}