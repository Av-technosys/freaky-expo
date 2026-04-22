// app/(tabs)/cart.tsx

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import NotFound from '@/components/common/NotFound';

// keep your existing component
import CartProductsScreen from '@/components/cart/CartProuctScreen';

// API
import { fetchCartItems, deleteCartItem } from '@/api/cart';
import CartSkeleton from '@/app/skeleton/cartList';

export default function CartScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);

      const res = await fetchCartItems();

      console.log('cart', res);

      setCart(res); // ✅ keep full cart object
      setItems(res?.items ?? []); // ✅ safe fallback
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load cart',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingDraftId: number) => {
    try {
      setItems((prev) => prev.filter((i) => i.bookingDraftId !== bookingDraftId));

      await deleteCartItem(bookingDraftId);

      Toast.show({
        type: 'success',
        text1: 'Item removed from cart',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Failed to remove item',
      });

      loadCart();
    }
  };

  const hasItems = items.length > 0;

  return (
    <Screen>
      <ScreenHeader title="Cart" rightType="menu" />

      <View className="flex-1">
        {loading && <CartSkeleton />}
        {!loading && !hasItems ? (
          <NotFound
            title="Oops! No Booking yet"
            description="It seems that you’ve got a blank state."
            ctaLabel="Book Now Event"
            onPress={() => router.push('/event')} // ✅ Expo navigation
          />
        ) : (
          <CartProductsScreen loading={loading} orders={items} onDelete={handleDelete} />
        )}
      </View>
    </Screen>
  );
}
