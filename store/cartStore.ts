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

export type EventCartFeature = {
  icon: 'person' | 'clock' | 'camera' | 'balloon' | 'link' | 'sparkles' | 'dj' | 'music' | 'sound' | 'star' | 'fun' | 'anchor';
  label: string;
};

export type EventCartService = {
  id: string;
  title: string;
  packageName: string;
  price: number;
  imageUri: string;
  features: EventCartFeature[];
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
  eventServices: EventCartService[];
  lastAddedEventServiceId: string | null;
  addEventService: (service: EventCartService) => void;
  removeEventService: (serviceId: string) => void;
  clearEventServices: () => void;
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
      eventServices: [],
      lastAddedEventServiceId: null,
      addEventService: (service) =>
        set((state) =>
          state.eventServices.some((item) => item.id === service.id)
            ? {
                eventServices: state.eventServices.map((item) =>
                  item.id === service.id ? service : item
                ),
                lastAddedEventServiceId: service.id,
              }
            : {
                eventServices: [...state.eventServices, service],
                lastAddedEventServiceId: service.id,
              }
        ),
      removeEventService: (serviceId) =>
        set((state) => {
          const eventServices = state.eventServices.filter((service) => service.id !== serviceId);
          return {
            eventServices,
            lastAddedEventServiceId:
              state.lastAddedEventServiceId === serviceId
                ? eventServices[eventServices.length - 1]?.id ?? null
                : state.lastAddedEventServiceId,
          };
        }),
      clearEventServices: () => set({ eventServices: [], lastAddedEventServiceId: null }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState, version) => {
        if (version < 1) {
          return {
            ...(persistedState as Partial<CartState>),
            eventServices: [],
            lastAddedEventServiceId: null,
          };
        }

        return persistedState as CartState;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
