import React, { useEffect, useState } from 'react'
import { View, Pressable } from 'react-native'
import { router } from 'expo-router'
import { Calendar, Clock, MapPin, Building, ChevronRight } from 'lucide-react-native'

import { Text } from '@/components/ui/text'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Screen from '@/app/provider/Screen'
import ScreenHeader from '@/components/common/ScreenHeader'
import OrderCardSkeleton from '@/app/skeleton/OrderCard'
import { privateApi } from '@/api/axios'

const fetchMyBookings = async () => {
  const res = await privateApi.get('/booking/my-bookings')
  return res.data
}

const mapStatus = (status: string) => {
  const s = String(status).toUpperCase()

  if (s === 'CONFIRMED' || s === 'BOOKED') return 'confirmed'
  if (s === 'HOLD' || s === 'IN_PROGRESS') return 'pending'
  if (s === 'COMPLETED') return 'completed'
  if (s === 'CANCLED' || s === 'EXPIRED') return 'cancelled'

  return 'pending'
}

function OrderCardComponent({ order, onPress }: any) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      case 'completed':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <Pressable onPress={onPress}>
      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-0">
          <View className="p-4">

            <View className="flex-row justify-between items-start mb-3">
              <Text className="flex-1 text-lg font-semibold" numberOfLines={1}>
                {order.title}
              </Text>

              <Badge variant={getStatusVariant(order.status)}>
                <Text className="text-xs font-medium">{order.status}</Text>
              </Badge>
            </View>

            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Calendar size={14} />
                <Text className="text-sm">{order.date}</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Clock size={14} />
                <Text className="text-sm">{order.time}</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Building size={14} />
                <Text className="text-sm">{order.venue}</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <MapPin size={14} />
                <Text className="text-sm">{order.location}</Text>
              </View>
            </View>

            <Separator className="my-3" />

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-xs">Total Amount</Text>
                <Text className="text-lg font-bold">
                  ₹ {order.price}
                </Text>
              </View>

              <Button variant="ghost" size="sm">
                <Text>View Details</Text>
                <ChevronRight size={16} />
              </Button>
            </View>

          </View>
        </CardContent>
      </Card>
    </Pressable>
  )
}

function EmptyOrdersState() {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-4xl">📦</Text>
      <Text className="mt-4 text-2xl font-bold">No Orders Yet</Text>
      <Text className="mt-2 text-gray-500">
        You haven't placed any orders yet
      </Text>
    </View>
  )
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await fetchMyBookings()
      setOrders(res?.data || [])
    } catch (e) {
      console.log('orders error', e)
    } finally {
      setLoading(false)
    }
  }

  const mappedOrders = orders.map((b: any) => ({
    id: b.bookingId?.toString(),

    title: b.contactName || 'Booking',

    date: b.startTime
      ? new Date(b.startTime).toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'Date TBD',

    time:
      b.startTime && b.endTime
        ? `${new Date(b.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })} - ${new Date(b.endTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}`
        : 'Time TBD',

    venue: b.contactName || 'N/A',
    location: b.latitude && b.longitude ? 'Location Available' : 'N/A',

    status: mapStatus(b.bookingStatus),

    price: Number(b.totalAmount || 0).toFixed(2),
  }))

  const handleOrderPress = (id: string, status: string) => {
    router.push({
      pathname: '/OrderDetailsScreen',
      params: {
        bookingId: id,
        status: status,
      },
    })
  }

  return (
    <Screen scroll>
      <ScreenHeader title="My Orders" showBack />

      {loading ? (
        <View className="px-4 pt-4">
          <OrderCardSkeleton/>
        </View>
      ) : !mappedOrders.length ? (
        <EmptyOrdersState />
      ) : (
        <View className="px-4 pt-2 pb-8">
          {mappedOrders.map((order) => (
            <OrderCardComponent
              key={order.id}
              order={order}
              onPress={() => handleOrderPress(order.id, order.status)}
            />
          ))}
        </View>
      )}
    </Screen>
  )
}