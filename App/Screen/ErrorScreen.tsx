import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import useNetworkStatus from '../Context/NetworkProvider';
import { useNavigation, StackActions, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function ErrorScreen() {
  const navigation = useNavigation();
  const isOnline = useNetworkStatus();
  const [showLoader, setShowLoader] = useState(true);
  const [message, setMessage] = useState("");
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#fff');
    }, []),
  );
  const insets = useSafeAreaInsets();
  useEffect(() => {
    setShowLoader(true);
    setMessage("");
    setTimeout(() => {
      setShowLoader(false);
      setMessage("No Internet Connection. Check your Connection");
    }, 5000);
  }, []);

  useEffect(() => {
    if (isOnline) {
      const currentRoute = navigation.getState()?.routes?.slice(-1)[0]?.name;
      if (currentRoute === "ErrorScreen") {
        navigation.dispatch(StackActions.replace("Home"));
      }
    }
  }, [isOnline, navigation]);

  return (
    <View style={{
      flex: 1,
      // Paddings to handle safe area
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      backgroundColor: '#fff',
    }} >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {showLoader ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>{message}</Text>
        )}
      </View>
    </View>
  );
}
