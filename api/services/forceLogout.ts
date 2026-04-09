import { DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store, persistor } from '../../store';
import { logout } from '../../store/slices/authSlice';

export const forceLogout = async () => {
  await AsyncStorage.multiRemove([
    'idToken',
    'accessToken',
    'refreshToken',
    'username',
  ]);

  store.dispatch(logout());

  await persistor.purge();

  DeviceEventEmitter.emit('FORCE_LOGOUT');
};
