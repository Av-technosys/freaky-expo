// components/cart/CartProductsScreen.tsx

import { useState } from 'react';
import {
  View,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
// import SkeletonContent from 'react-native-skeleton-content';

// UI
import { Text } from '@/components/ui/text';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { AppButton } from '@/components/common/AppButton';

// keep your card
import OrderCard from '@/components/common/card/OrderCard';

type Props = {
  orders: any[];
  loading: boolean;
  onDelete: (bookingDraftId: number) => Promise<void>;
};

export default function CartProductsScreen({
  orders,
  loading,
  onDelete,
}: Props) {
  const router = useRouter();

  const [confirmDeleteId, setConfirmDeleteId] =
    useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      setDeleting(true);
      await onDelete(confirmDeleteId);
      setConfirmDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
          paddingTop: 30,
        }}
      >
        <View className="gap-4">

          {/* 🔄 LOADING */}
          {/* {loading && (
            <SkeletonContent
              isLoading
              layout={[1, 2, 3].map((i) => ({
                key: `sk-${i}`,
                height: 90,
                borderRadius: 16,
                marginBottom: 16,
              }))}
            />
          )} */}

          {/* ✅ DATA */}
          {!loading &&
            orders.map((order) => (
              <OrderCard
                key={order.bookingDraftId}
                title={order.contactName}
                venue={`${order.latitude}, ${order.longitude}`}
               // date={new Date(order.startTime).toDateString()}
                variant="compact"
                onPress={() =>
                  router.push('/CartProductDetail') // ✅ Expo routing
                }
                onDelete={() =>
                  setConfirmDeleteId(order.bookingDraftId)
                }
              />
            ))}
        </View>
      </ScrollView>

      {/* 🗑 DELETE MODAL */}
      <Modal
        visible={confirmDeleteId !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View className="flex-1 bg-black/40 justify-center items-center px-4">

          <Card className="w-full max-w-sm">
            <CardContent className="p-5 gap-4">

              <Text className="text-lg font-semibold">
                Delete Booking
              </Text>

              <Text className="text-muted-foreground">
                Are you sure you want to delete this booking?
              </Text>

              <View className="flex-row gap-3 mt-2">

                <AppButton
                  variant="outline"
                  className="flex-1"
                  disabled={deleting}
                  onPress={() => setConfirmDeleteId(null)}
                >
                  <Text>Cancel</Text>
                </AppButton>

                <AppButton
                  className="flex-1 bg-red-500"
                  disabled={deleting}
                  onPress={confirmDelete}
                >
                  <Text className="text-white">
                    {deleting ? 'Deleting…' : 'Delete'}
                  </Text>
                </AppButton>

              </View>

            </CardContent>
          </Card>

        </View>
      </Modal>
    </>
  );
}