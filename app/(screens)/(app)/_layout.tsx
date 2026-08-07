import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppLayout() {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet(['accessToken', 'idToken', 'refreshToken']).then((pairs) => {
      const [accessToken, idToken, refreshToken] = pairs.map(([, v]) => v);
      if (!accessToken || !idToken || !refreshToken) {
        router.replace('/authintro');
      } else {
        setAuthed(true);
      }
      setChecked(true);
    });
  }, []);

  if (!checked || !authed) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This wraps all routes under /app */}
    </Stack>
  );
}
