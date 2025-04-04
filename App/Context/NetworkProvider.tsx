import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  useEffect(() => {
    const updateNetworkStatus = (state: any) => {
      console.log("Network status changed:", state.isConnected);
      setIsOnline(state.isConnected);
    };
    const unsubscribe = NetInfo.addEventListener(updateNetworkStatus);
    NetInfo.fetch().then(updateNetworkStatus);
    return () => {
      unsubscribe();
    };
  }, []);
  return isOnline;
};
export default useNetworkStatus;
