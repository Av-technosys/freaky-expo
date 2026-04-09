import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';

type AuthState = {
  isLoggedIn: boolean;
  user: any | null;
};

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<any>) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(REHYDRATE, (state, action: any) => {
      if (action.payload?.auth) {
        return action.payload.auth;
      }
    });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
