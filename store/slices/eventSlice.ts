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
  selections: Record<string, string[]>;
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
      action: PayloadAction<{ step: string; productId: any }>
    ) {
      const { step, productId } = action.payload;

      if (!state.selections[step]) {
        state.selections[step] = [];
      }

      if (!state.selections[step].includes(productId)) {
        state.selections[step].push(productId);
      }
    },

    removeProduct(
      state,
      action: PayloadAction<{ step: string; productId: string }>
    ) {
      const { step, productId } = action.payload;
      if (!state.selections[step]) return;

      state.selections[step] = state.selections[step].filter(
        id => id !== productId
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
