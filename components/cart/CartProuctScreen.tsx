import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { AppButton } from '@/components/common/AppButton';
import CartItemCard from '../common/card/CartItemCard';

type Props = {
  orders: any[];
  loading: boolean;
  onDelete: (bookingDraftId: number) => Promise<void>;
};

export default function CartProductsScreen({ orders, loading, onDelete }: Props) {
  const router = useRouter();

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
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
        }}>
        <View className="gap-0">
          {!loading &&
            orders.map((order) => {
              const dateObj = new Date(order.startTime || order.createdAt);

              const formattedDate = dateObj.toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });

              const guestRange =
                order.minGuestCount && order.maxGuestCount
                  ? `${order.minGuestCount} - ${order.maxGuestCount} Guests`
                  : 'Guests not specified';

              return (
                <CartItemCard
                  key={order.bookingDraftId}
                  title={order.contactName || 'Event'}
                  guestRange={guestRange}
                  date={formattedDate}
                  onPress={() =>
                    router.push({
                      pathname: '/CartProductDetail',
                      params: { bookingDraftId: order.bookingDraftId },
                    })
                  }
                  onDelete={() => setConfirmDeleteId(order.bookingDraftId)}
                />
              );
            })}
        </View>
      </ScrollView>

      {/* DELETE MODAL */}
      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteId(null);
        }}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Item from Cart?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex-wrap gap-3">
            <AppButton
              variant="outline"
              className="flex-1"
              disabled={deleting}
              onPress={() => setConfirmDeleteId(null)}>
              <Text>Cancel</Text>
            </AppButton>

            <AppButton className="flex-1" disabled={deleting} onPress={confirmDelete}>
              <Text className="text-white">{deleting ? 'Deleting…' : 'Delete'}</Text>
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
