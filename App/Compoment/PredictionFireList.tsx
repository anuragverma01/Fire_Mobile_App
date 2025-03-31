import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, ActivityIndicator, StyleSheet, 
  TouchableOpacity, Modal, Button 
} from "react-native";
import axios from "axios";

interface LiveFireData {
  Latitude: number;
  Longitude: number;
  City: string;
  Temperature: number;
  Humidity: number;
  WindSpeed: number;
}

const PredictionFireList: React.FC = () => {
  const API_URL = "https://app-rewt.onrender.com/fire-risk";

  const [data, setData] = useState<LiveFireData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<LiveFireData | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const fetchData = async () => {
    if (loading || !hasMore) return; 
    setLoading(true);

    try {
      const response = await axios.get<{ data: LiveFireData[] }>(`${API_URL}?page=${page}&limit=50`);
      const newData = response.data.data;
      const highRiskData = newData.filter((item:any) => item["Fire Risk"] === "High");

      console.log("Data!!!!!!",highRiskData)

      if (highRiskData.length > 0) {
        setData((prevData) => [...prevData, ...highRiskData]);
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

  const openModal = (item: LiveFireData) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Prediction Fire Data</Text>

      <FlatList
        data={data}
        keyExtractor={(item:any, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openModal(item)}>
            <Text style={styles.cityText}>{item.City}</Text>
            <Text style={styles.riskText}>🔥 Fire Risk: {item["Fire Risk"]}</Text>
          </TouchableOpacity>
        )}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => loading && <ActivityIndicator size="large" />}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>{selectedItem.City}</Text>
                <Text style={styles.modalText}>🌍 Latitude: {selectedItem.Latitude}</Text>
                <Text style={styles.modalText}>🌍 Longitude: {selectedItem.Longitude}</Text>
                <Text style={styles.modalText}>🌡 Temperature: {selectedItem.Temperature}°C</Text>
                <Text style={styles.modalText}>💧 Humidity: {selectedItem.Humidity}%</Text>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
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
  riskText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
  },
});

export default PredictionFireList;
