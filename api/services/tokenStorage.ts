import AsyncStorage from '@react-native-async-storage/async-storage';

export const tokenStorage = {
  getIdToken: () => AsyncStorage.getItem('idToken'),
  setIdToken: (token: string) =>
    AsyncStorage.setItem('idToken', token),

  getRefreshToken: () => AsyncStorage.getItem('refreshToken'),
  getUsername: () => AsyncStorage.getItem('username'),

  clear: () =>
    AsyncStorage.multiRemove([
      'idToken',
      'accessToken',
      'refreshToken',
      'username',
    ]),
};
