import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

export function useNavigationProtection() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateWithProtection = useCallback((path: string, params: any = {}) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    router.push({ pathname: path as any, params });
    setTimeout(() => setIsNavigating(false), 500);
  }, [isNavigating, router]);

  return { navigateWithProtection, isNavigating };
}
