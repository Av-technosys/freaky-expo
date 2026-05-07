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
import { AppButton } from '@/components/common/AppButton';
import CartItemCard from '../common/card/CartItemCard';

import type { CartItem, CartEventItem } from '@/store/cartStore';
import { toast } from '@/components/common/ToastManager';

type Props = {
  items: CartItem[];
  events: CartEventItem[];
  loading: boolean;
  onDelete: (cartItemId: string) => Promise<void> | void;
};

export default function CartProductsScreen({ items, events, loading, onDelete }: Props) {
  const router = useRouter();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
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
          paddingTop: 4,
        }}>
        <View>
          {/* INDIVIDUAL SERVICES */}
          {!loading && items && items.length > 0 && (
            <View className="mb-6">
              {items.map((item) => {
                const dateObj = new Date(item.bookingDetails.date);

                const formattedDate = dateObj.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });

                const guestRange = item.bookingDetails.guests
                  ? `${item.bookingDetails.guests} Guests`
                  : 'Guests not specified';

                return (
                  <CartItemCard
                    key={`item-${item.cartItemId}`}
                    title={item.title || 'Service'}
                    vendorName={item.vendorName}
                    guestRange={guestRange}
                    date={formattedDate}
                    time={item.bookingDetails.time}
                    phone={item.bookingDetails.phone}
                    address={item.bookingDetails.address}
                    price={item.price}
                    quantity={item.quantity}
                    onPress={() =>
                      router.navigate({
                        pathname: '/CartProductDetail',
                        params: {
                          cartItemId: item.cartItemId,
                          bookingDraftId: item.bookingDraftId,
                        },
                      })
                    }
                    onDelete={() => setConfirmDeleteId(item.cartItemId)}
                  />
                );
              })}
            </View>
          )}

          {/* EVENTS */}
          {!loading && events && events.length > 0 && (
            <View className="mb-6">
              {events.map((event) => {
                const dateObj = new Date(event.eventDetails.startTime || new Date());

                const formattedDate = dateObj.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });

                const timeString = event.eventDetails.startTime
                  ? new Date(event.eventDetails.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';

                const guestRange = `${event.eventDetails.minGuestCount || 0} - ${event.eventDetails.maxGuestCount || 0} Guests`;

                // Calculate total price of all services in this event
                const totalPrice = event.services.reduce((sum, service) => {
                  return sum + (Number(service.price) * Number(service.quantity || 1));
                }, 0);

                return (
                  <CartItemCard
                    key={`event-${event.eventId}`}
                    title={`Event: ${event.eventDetails.contactName || 'New Event'}`}
                    vendorName={`${event.services.length} Services`}
                    guestRange={guestRange}
                    date={formattedDate}
                    time={timeString}
                    phone={event.eventDetails.contactNumber}
                    address=""
                    price={totalPrice}
                    quantity={1} // Representing 1 event package
                    onPress={() =>
                      router.navigate({
                        pathname: '/CartProductDetail',
                        params: {
                          eventId: event.eventId,
                        },
                      })
                    }
                    onDelete={() => {
                      // Optionally set delete for the whole event or show a different modal
                      // For now, we omit onDelete so they have to delete services individually inside the event details
                      // If you want them to delete the whole event, we'd pass event.eventId.
                      toast.info('Delete event services inside the event details screen');
                    }}
                  />
                );
              })}
            </View>
          )}
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
