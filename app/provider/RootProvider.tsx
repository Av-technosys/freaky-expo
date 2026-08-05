// app/providers/RootProvider.tsx

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" hidden={false} translucent={false} backgroundColor="#ffffff" />
      {children}
    </SafeAreaProvider>
  );
}
