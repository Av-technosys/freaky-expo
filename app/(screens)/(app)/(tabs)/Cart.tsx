// // app/(tabs)/cart.tsx

// import { View } from 'react-native';
// import { useRouter, useFocusEffect } from 'expo-router';
// import { useState, useCallback } from 'react';
// import Toast from 'react-native-toast-message';

// import Screen from '@/app/provider/Screen';
// import ScreenHeader from '@/components/common/ScreenHeader';
// import NotFound from '@/components/common/NotFound';

// import CartProductsScreen from '@/components/cart/CartProuctScreen';

// import { deleteCartItem, fetchCartItems } from '@/api/cart';
// import { useCartStore } from '@/store/cartStore';

// export default function CartScreen() {
//   const router = useRouter();

//   const items = useCartStore((state) => state.items);
//   const events = useCartStore((state) => state.events);
//   const removeFromCart = useCartStore((state) => state.removeFromCart);
//   const setItems = useCartStore((state) => state.setItems);
//   const setEvents = useCartStore((state) => state.setEvents);

//   const [loading, setLoading] = useState(false);

//   useFocusEffect(
//     useCallback(() => {
//       loadCartFromApi();
//     }, [])
//   );

//   const loadCartFromApi = async () => {
//     try {
//       setLoading(true);
//       const res = await fetchCartItems();
//       console.log('res', res);
//       if (res) {
//         const mapItem = (item: any) => ({
//           cartItemId: item.bookingDraftId.toString(),
//           bookingDraftId: item.bookingDraftId,
//           cartId: res.cartId,
//           productId: item.productId?.toString(),
//           title: item.productName || 'Event',
//           vendorName: '',
//           price: Number(item.price || 0),
//           quantity: item.quantity || 1,
//           bookingDetails: {
//             fullName: item.contactName || item.eventContactName || '',
//             phone: item.contactNumber || item.eventContactNumber || '',
//             address: '',
//             date: item.startTime || item.eventStartTime || new Date().toISOString(),
//             time: item.startTime || item.eventStartTime ? new Date(item.startTime || item.eventStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
//             guests: `${item.minGuestCount || item.eventMinGuest || 0} - ${item.maxGuestCount || item.eventMaxGuest || 0}`,
//             vendorNote: null,
//           }
//         });

//         if (res.items) {
//           setItems(res.items.map(mapItem));
//         } else {
//           setItems([]);
//         }

//         if (res.events) {
//           const mappedEvents = res.events.map((eventObj: any) => ({
//             eventId: eventObj.eventId,
//             eventDetails: eventObj.eventDetails,
//             services: eventObj.services.map(mapItem),
//           }));
//           setEvents(mappedEvents);
//         } else {
//           setEvents([]);
//         }
//       }
//     } catch (err) {
//       console.log('Failed to fetch cart', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (cartItemId: string) => {
//     const item = items.find((cartItem) => cartItem.cartItemId === cartItemId);
//     removeFromCart(cartItemId);
//     try {
//       if (item?.bookingDraftId) {
//         await deleteCartItem(item.bookingDraftId);
//       }

//       Toast.show({
//         type: 'success',
//         text1: 'Item removed from cart',
//       });
//     } catch (err) {
//       Toast.show({
//         type: 'error',
//         text1: 'Failed to remove item',
//       });
//     }
//   };

//   const hasItems = items.length > 0 || events.length > 0;

//   return (
//     <Screen>
//       <ScreenHeader title="Cart" rightType="menu" />

//       <View className="flex-1 mb-16">
//         {!hasItems ? (
//           <NotFound
//             title="Oops! No Booking yet"
//             description="It seems that you’ve got a blank state."
//             ctaLabel="Book Now Event"
//             onPress={() => router.push('/event')} // ✅ Expo navigation
//           />
//         ) : (
//           <CartProductsScreen loading={false} items={items} events={events} onDelete={handleDelete} />
//         )}
//       </View>
//     </Screen>
//   );
// }


import { View } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { useState, useCallback } from 'react'
import Toast from 'react-native-toast-message'
import { Text } from '@/components/ui/text'
import Screen from '@/app/provider/Screen'
import ScreenHeader from '@/components/common/ScreenHeader'
import NotFound from '@/components/common/NotFound'
import { useLocalSearchParams } from 'expo-router'
import CartProductsScreen from '@/components/cart/CartProuctScreen'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { deleteCartItem, fetchCartItems } from '@/api/cart'
import { useCartStore } from '@/store/cartStore'
import CartSkeleton from '@/app/skeleton/cartList'

type TabType = 'services' | 'events'

export default function CartScreen() {
  const router = useRouter()
  const { event } = useLocalSearchParams<{ event?: string }>()

  const items = useCartStore((state) => state.items)
  const events = useCartStore((state) => state.events)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const setItems = useCartStore((state) => state.setItems)
  const setEvents = useCartStore((state) => state.setEvents)

  const [loading, setLoading] = useState(true)
  const initialTab: TabType = event === 'true' ? 'events' : 'services'
  const [tab, setTab] = useState<TabType>(initialTab)

  const handleTabChange = (value: string) => {
    if (value === 'services' || value === 'events') {
      setTab(value)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadCartFromApi()
    }, [])
  )

  const loadCartFromApi = async () => {
    try {
      setLoading(true)
      const res = await fetchCartItems()

      const mapItem = (item: any) => ({
        cartItemId: item.bookingDraftId.toString(),
        bookingDraftId: item.bookingDraftId,
        cartId: res.cartId,
        productId: item.productId?.toString(),
        title: item.productName || 'Event',
        vendorName: '',
        price: Number(item.price || 0),
        quantity: item.quantity || 1,
        bookingDetails: {
          fullName: item.contactName || item.eventContactName || '',
          phone: item.contactNumber || item.eventContactNumber || '',
          address: '',
          date: item.startTime || item.eventStartTime || new Date().toISOString(),
          time:
            item.startTime || item.eventStartTime
              ? new Date(item.startTime || item.eventStartTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
              : '',
          guests: `${item.minGuestCount || item.eventMinGuest || 0} - ${item.maxGuestCount || item.eventMaxGuest || 0}`,
          vendorNote: null,
        },
      })

      setItems(res.items ? res.items.map(mapItem) : [])

      const mappedEvents = res.events
        ? res.events.map((eventObj: any) => ({
          eventId: eventObj.eventId,
          eventDetails: eventObj.eventDetails,
          services: eventObj.services.map(mapItem),
        }))
        : []

      setEvents(mappedEvents)
    } catch (err) {
      console.log('Failed to fetch cart', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cartItemId: string) => {
    const item = items.find((cartItem) => cartItem.cartItemId === cartItemId)
    removeFromCart(cartItemId)

    try {
      if (item?.bookingDraftId) {
        await deleteCartItem(item.bookingDraftId)
      }

      Toast.show({
        type: 'success',
        text1: 'Item removed from cart',
      })
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Failed to remove item',
      })
    }
  }

  const hasItems = items.length > 0 || events.length > 0

  return (
    <Screen>
      <ScreenHeader title="Cart" rightType="menu" />

      <View className="flex-1 mb-16">

        {loading ? (
          <CartSkeleton />
        ) : !hasItems ? (
          <NotFound
            title="Oops! No Booking yet"
            description="It seems that you’ve got a blank state."
            ctaLabel="Book Now Event"
            onPress={() => router.push('/event')}
          />
        ) : (
          <View className="flex-1 mb-16">
            <Tabs className="pt-8" value={tab} onValueChange={handleTabChange}>
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="services" className="flex-1">
                  <Text>Services ({items.length})</Text>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex-1">
                  <Text>Events ({events.length})</Text>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="services">
                <CartProductsScreen
                  loading={false}
                  items={items}
                  events={[]}
                  onDelete={handleDelete}
                />
              </TabsContent>

              <TabsContent value="events">
                <CartProductsScreen
                  loading={false}
                  items={[]}
                  events={[...events].reverse()}
                  onDelete={handleDelete}
                />
              </TabsContent>
            </Tabs>
          </View>
        )}

      </View>
    </Screen>
  )
}