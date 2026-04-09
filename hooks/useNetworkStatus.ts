import * as Network from 'expo-network';
import { useEffect, useState } from 'react';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsConnected(state.isConnected ?? true);
    };

    checkNetwork();

    const interval = setInterval(checkNetwork, 3000); // simple polling

    return () => clearInterval(interval);
  }, []);

  return isConnected;
}