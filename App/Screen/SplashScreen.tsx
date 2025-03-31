import React, { useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, StatusBar, Dimensions, Text } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
};
type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, "Splash">;
const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#098f62");
    }, [])
  );
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      navigation.replace("Home");
    }, 4000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AMIFIRE 🔥</Text>
    </View>
  );
};
const win = Dimensions.get("window");
const ratio = win.width / 410;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#098f62",
  },
  text: {
    fontSize: 48,
    fontWeight: "bold",
    color: "black",
  },
});
export default SplashScreen;