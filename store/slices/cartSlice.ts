import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CartItem = {
  ProductId: string; 
  title: string;
  vendorName: string;
  price: number;
  quantity: number;

  bookingDetails: {
    fullName: string;
    phone: string;
    address: string;
    date: string;
    time: string;
    guests: string | null;
  };
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
 
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push({
        ...action.payload,
        quantity: 1,
      });
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item.ProductId !== action.payload
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
