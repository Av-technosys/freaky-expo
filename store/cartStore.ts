import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CartBookingDetails = {
  fullName: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  guests: string | null;
  vendorNote: string | null;
};

export type CartItem = {
  cartItemId: string;
  bookingDraftId?: number;
  cartId?: number;
  productId?: string;
  title: string;
  vendorName?: string;
  price: number;
  quantity: number;
  bookingDetails: CartBookingDetails;
};

export type CartEventItem = {
  eventId: number;
  eventDetails: {
    contactName: string;
    contactNumber: string;
    startTime: string;
    endTime: string;
    minGuestCount: number;
    maxGuestCount: number;
  };
  services: CartItem[];
};

type CartState = {
  items: CartItem[];
  events: CartEventItem[];
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  setItems: (items: CartItem[]) => void;
  setEvents: (events: CartEventItem[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  getItemById: (cartItemId?: string | string[]) => CartItem | undefined;
};

const toParamValue = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      events: [],
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setItems: (items) => set({ items }),
      setEvents: (events) => set({ events }),
      addToCart: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (cartItem) => cartItem.cartItemId === item.cartItemId
          );

          if (existingIndex === -1) {
            return { items: [...state.items, item] };
          }

          const nextItems = [...state.items];
          nextItems[existingIndex] = item;
          return { items: nextItems };
        }),
      removeFromCart: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        })),
      clearCart: () => set({ items: [] }),
      getItemById: (cartItemId) => {
        const id = toParamValue(cartItemId);
        if (!id) return undefined;
        return get().items.find((item) => item.cartItemId === id);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
