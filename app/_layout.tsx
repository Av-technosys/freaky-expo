import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { Provider } from 'react-redux';
import RootProvider from './provider/RootProvider';
import { useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/store';
import Toast from 'react-native-toast-message';
import { AppState } from 'react-native'; // 👈 ADD THIS
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
export { ErrorBoundary } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

export default function RootLayout() {
  const { setColorScheme } = useColorScheme();
  useEffect(() => {
    setColorScheme('light');
  }, []);


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <RootProvider>
              <ThemeProvider value={NAV_THEME['light']}>
                <StatusBar style="dark" />

                {/* 👇 also add this */}
                <Stack initialRouteName="index" screenOptions={{ headerShown: false }} />

                <Toast />
                <PortalHost />
              </ThemeProvider>
            </RootProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
