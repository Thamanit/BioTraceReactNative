// /app/_layout.tsx

import {
  Slot,
  useRouter,
  useSegments,
  useRootNavigationState,
} from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { AuthContextProvider, useAuth } from '@/context/AuthContext';

function Guard() {
  const { user, loading } = useAuth();
  const segments = useSegments();     // ["(auth)", "login"]   etc.
  const router = useRouter();
  const navReady = useRootNavigationState()?.key != null;

  useEffect(() => {
    if (!navReady || loading) return;

    const group = segments[0];            // "(auth)" | "(app)"
    const inAuthGroup = group === '(auth)';
    const inAppGroup = group === '(app)';

    if (!user && inAppGroup) router.replace('/');
    if (user && inAuthGroup) router.replace('/home');
  }, [user, loading, navReady, segments]);

  if (loading || !navReady)
    return (
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator size="large" />
      </View>
    );

  return <Slot />; // renders the matched route
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Guard />
    </AuthContextProvider>
  );
}
