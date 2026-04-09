import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { Provider } from 'react-redux';
import RootProvider from './provider/RootProvider';
import { useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/store';
import Toast from 'react-native-toast-message';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme('light');
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootProvider>
          <ThemeProvider value={NAV_THEME['light']}>
            {/* <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} /> */}
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }} />
            <Toast />
            <PortalHost />
          </ThemeProvider>
        </RootProvider>
      </PersistGate>
    </Provider>
  );
}
