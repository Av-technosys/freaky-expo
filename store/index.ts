import { configureStore, combineReducers  } from '@reduxjs/toolkit';
import AuthReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import eventReducer from './slices/eventSlice'; 
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};

const cartPersistConfig = {
  key: 'cart',
  storage: AsyncStorage,
};

const eventPersistConfig = {
  key: 'event',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, AuthReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  event: persistReducer(eventPersistConfig, eventReducer),
});


export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // REQUIRED for redux-persist
    }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
