import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet,
  TouchableOpacity, Modal, Button
} from "react-native";
import axios from "axios";
import { FireData,FireListProps } from "./types";

const FireList: React.FC<FireListProps> = ({ apiUrl, filterHighRisk = false }) => {
  const [data, setData] = useState<FireData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<FireData | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const fetchData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get<{ data: any[] }>(`${apiUrl}?page=${page}&limit=50`);
      let newData = response.data.data;
      if (filterHighRisk) {
        newData = newData.filter((item: any) => item["Fire Risk"] === "High");
      }

      const formattedData: FireData[] = newData.map((item) => ({
        latitude: item.latitude ?? item.Latitude,
        longitude: item.longitude ?? item.Longitude,
        city: item.city ?? item.City,
        temperature: item.temperature ?? item.Temperature,
        humidity: item.humidity ?? item.Humidity,
        windSpeed: item.wind_speed ?? item.WindSpeed,
        fireRisk: item["Fire Risk"],
      }));

      if (formattedData.length > 0) {
        setData((prevData) => [...prevData, ...formattedData]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (item: FireData) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{ }</Text>

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openModal(item)}>
            <Text style={styles.cityText}>{item.city}</Text>
            {item.fireRisk ? (
              <Text style={styles.riskText}>🔥 Fire Risk: {item.fireRisk}</Text>
            ) : (
              <Text style={styles.tempText}>🌡 Temperature: {item.temperature}°C</Text>
            )}
          </TouchableOpacity>
        )}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => loading && <ActivityIndicator size="large" />}
      />

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>{selectedItem.city}</Text>
                <Text style={styles.modalText}>🌍 Latitude: {selectedItem.latitude}</Text>
                <Text style={styles.modalText}>🌍 Longitude: {selectedItem.longitude}</Text>
                {selectedItem.temperature && (
                  <Text style={styles.modalText}>🌡 Temperature: {selectedItem.temperature}°C</Text>
                )}
                {selectedItem.humidity && (
                  <Text style={styles.modalText}>💧 Humidity: {selectedItem.humidity}%</Text>
                )}
                {selectedItem.windSpeed && (
                  <Text style={styles.modalText}>💨 Wind Speed: {selectedItem.windSpeed} m/s</Text>
                )}
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  cityText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tempText: {
    fontSize: 14,
    color: "gray",
  },
  riskText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default FireList;
