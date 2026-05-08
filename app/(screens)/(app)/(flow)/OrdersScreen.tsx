import React from 'react'
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { toast } from '@/components/common/ToastManager'

import Screen from '@/app/provider/Screen'
import ScreenHeader from '@/components/common/ScreenHeader'
import OrderCard from '@/components/common/card/OrderCard'
import OrderCardSkeleton from '@/app/skeleton/OrderCard'
import EmptyState from '@/components/eventProducts/EmptyProductsState'

// ✅ React Query
import { useBookings } from '@/api/booking'

export default function OrdersScreen() {
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useBookings(true)

  const orders = data?.data || []

  const handleRefresh = async () => {
    try {
      await refetch()
    } catch {
      toast.error('Failed to refresh orders')
    }
  }

  const handleOrderPress = (bookingId: string, status: string) => {
    router.navigate({
      pathname: '/OrderDetailsScreen',
      params: { bookingId, status },
    })
  }

  return (
    <Screen scroll>
      <ScreenHeader title="My Orders" showBack />

      {/* LOADING */}
      {isLoading ? (
        <View className="gap-3 px-4 pt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <OrderCardSkeleton key={i} variant="default" />
          ))}
        </View>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No Orders Yet"
          subtitle="You haven't placed any orders yet."
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.bookingId)}
          contentContainerStyle={{
            paddingBottom: 32,
            paddingTop: 20,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
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
              onPress={() =>
                handleOrderPress(String(item.bookingId), item.bookingStatus)
              }
            />
          )}
          ListFooterComponent={
            isFetching ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#F97316" />
              </View>
            ) : null
          }
        />
      )}
    </Screen>
  )
}