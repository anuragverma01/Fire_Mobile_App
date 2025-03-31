import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation, useRoute } from "@react-navigation/native";
import React from 'react'
const CustomHeader = ({ title }: any) => {
  const navigation = useNavigation();
  const route = useRoute();
  const isListScreen = route.name === "ActiveList" || route.name === "PredictionList";

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(title === "Active Fire Alerts" ? "ActiveList" : "PredictionList")}>
        {!isListScreen && (
          <Text style={styles.navText}>
            {title === "Active Fire Alerts" ? "List Active" : "list prediction"}

          </Text>

        )}
      </TouchableOpacity>
    </View>
  )
}
export default CustomHeader
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    flex: 1,
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "gray",
  },
  navText: {
    marginTop: 5,
    color: "blue",
    fontSize: 16,
  },
});