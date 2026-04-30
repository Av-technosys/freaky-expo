import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BookingDetails = {
  eventTypeId: number;

  contactName: string;
  contactNumber: string;
  description: string;

  startTime: string;
  endTime: string;

  minGuestCount: number;
  maxGuestCount: number;

  latitude: number;
  longitude: number;
};


type EventTypeInfo = {
  id: number;
  name: string;
  image: string | null;
};


type EventState = {
  eventId: number | null;
  eventType: EventTypeInfo | null;
  bookingDetails: BookingDetails | null;
  selections: Record<string, {
  productId: number;
  slabIndex?: number;
  price?: number;
  quantity?: number;
}[]>;
};

const initialState: EventState = {
  eventId: null,
  eventType: null,
  bookingDetails: null,
  selections: {},
};
const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {

    setEventType(
      state,
      action: PayloadAction<{
        id: number;
        name: string;
        image: string | null;
      }>
    ) {
      state.eventType = action.payload;
    },

    setBookingDetails(state, action: PayloadAction<BookingDetails>) {
      state.bookingDetails = action.payload;
    },
    setEventId(state, action: PayloadAction<number>) {
      state.eventId = action.payload;
    },

    addProduct(
  state,
  action: PayloadAction<{
    step: string;
    productId: number;
    slabIndex?: number;
    price?: number;
    quantity?: number;
  }>
) {
  const { step, productId, slabIndex, price } = action.payload;

  if (!state.selections[step]) {
    state.selections[step] = [];
  }

  const exists = state.selections[step].find(p => p.productId === productId);

  if (!exists) {
    state.selections[step].push({ productId, slabIndex, price, quantity: action.payload.quantity || 1 });
  }
},

    removeProduct(
      state,
      action: PayloadAction<{ step: string; productId: number }>
    ) {
      const { step, productId } = action.payload;
      if (!state.selections[step]) return;

      state.selections[step] = state.selections[step].filter(
        p => p.productId !== productId
      );
    },

    resetEvent() {
      return initialState;
    },
  },
});

export const {
  setEventType,
  setBookingDetails,
  addProduct,
  removeProduct,
  resetEvent,
  setEventId
} = eventSlice.actions;

export default eventSlice.reducer;
