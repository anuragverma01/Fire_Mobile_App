import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    // Function to update network status
    const updateNetworkStatus = (state: any) => {
      console.log("Network status changed:", state.isConnected);
      setIsOnline(state.isConnected);
    };

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(updateNetworkStatus);

    // Fetch initial network status
    NetInfo.fetch().then(updateNetworkStatus);

    return () => {
      unsubscribe();
    };
  }, []);

  return isOnline;
};

export default useNetworkStatus;
