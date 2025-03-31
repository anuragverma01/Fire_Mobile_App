import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Route from "./Routing/routes"
import { View } from "react-native";
const App = () => {
  return (
    <SafeAreaProvider>
      <Route />
    </SafeAreaProvider>
  );
};
export default App;