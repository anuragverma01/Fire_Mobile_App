import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useState, useRef, useMemo } from "react";
import { ActivityIndicator, Alert, StatusBar, StyleSheet, View, Text } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Supercluster from "supercluster";
import { debounce } from "lodash";
import { FireMapScreenProps,FireRiskData } from "./types";

const FireMapScreen: React.FC<FireMapScreenProps> = ({ apiUrl, filterHighRisk = false }) => {
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle("dark-content");
            StatusBar.setBackgroundColor("#fff");
        }, [])
    );

    const insets = useSafeAreaInsets();
    const mapRef = useRef<MapView>(null);
    const [locations, setLocations] = useState<FireRiskData[]>([]);
    const [clusters, setClusters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [zoomLevel, setZoomLevel] = useState<number>(5);
    const prevZoomLevel = useRef<number>(zoomLevel);
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(apiUrl);
            let fetchedData = response.data.data;
            if (filterHighRisk) {
                fetchedData = fetchedData.filter((item: any) => item["Fire Risk"] === "High");
            }
            const formattedData: FireRiskData[] = fetchedData.map((item: any) => ({
                latitude: item.latitude ?? item.Latitude, 
                longitude: item.longitude ?? item.Longitude,
                city: item.city ?? item.City,
            }));
            setLocations(formattedData);
        } catch (error) {
            console.error("🔥 Fetch error:", error);
            Alert.alert("Network Error", "Failed to fetch fire risk data.", [{ text: "Retry", onPress: fetchData }]);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );
    const supercluster = useMemo(() => {
        if (locations.length === 0) return null;
        const cluster = new Supercluster({ radius: 60, maxZoom: 18, minPoints: 3 });
        cluster.load(
            locations.map((loc, index) => ({
                type: "Feature",
                properties: { id: index, city: loc.city },
                geometry: { type: "Point", coordinates: [loc.longitude, loc.latitude] },
            }))
        );
        return cluster;
    }, [JSON.stringify(locations)]);

    const updateClusters = useCallback(
        (region: Region) => {
            const newZoomLevel = Math.round(Math.log2(360 / region.longitudeDelta));
            if (prevZoomLevel.current !== newZoomLevel) {
                prevZoomLevel.current = newZoomLevel;
                setZoomLevel(newZoomLevel);
            }
            const bbox: [number, number, number, number] = [
                region.longitude - region.longitudeDelta / 2,
                region.latitude - region.latitudeDelta / 2,
                region.longitude + region.longitudeDelta / 2,
                region.latitude + region.latitudeDelta / 2,
            ];
            setClusters(supercluster?.getClusters(bbox, newZoomLevel) || []);
        },
        [supercluster]
    );
    const getEmojiSize = (zoom: number) => {
        if (zoom >= 15) return 40;
        if (zoom >= 12) return 30;
        if (zoom >= 9) return 25;
        if (zoom >= 6) return 20;
        return 15;
    };
    const handleClusterPress = debounce((cluster: any) => {
        const expansionZoom = supercluster?.getClusterExpansionZoom(cluster.properties.cluster_id);
        if (expansionZoom) {
            mapRef.current?.animateToRegion({
                latitude: cluster.geometry.coordinates[1],
                longitude: cluster.geometry.coordinates[0],
                latitudeDelta: Math.max(0.01, 360 / Math.pow(2, expansionZoom)),
                longitudeDelta: Math.max(0.01, 360 / Math.pow(2, expansionZoom)),
            });
        }
    }, 500);
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {loading ? (
                <ActivityIndicator style={{ flex: 1, justifyContent: "center", alignItems: "center" }} size="large" color="blue" />
            ) : (
                <MapView
                    ref={mapRef}
                    provider="google"
                    style={styles.map}
                    initialRegion={{
                        latitude: 25.275,
                        longitude: 110.296,
                        latitudeDelta: 5,
                        longitudeDelta: 5,
                    }}
                    onRegionChangeComplete={updateClusters}
                >
                    {clusters.map((item) => {
                        const [longitude, latitude] = item.geometry.coordinates;
                        const isCluster = item.properties.cluster;

                        return isCluster ? (
                            <Marker key={`cluster-${item.properties.cluster_id}`} coordinate={{ latitude, longitude }} onPress={() => handleClusterPress(item)}>
                                <View style={styles.cluster}>
                                    <Text style={styles.clusterText}>{item.properties.point_count}</Text>
                                </View>
                            </Marker>
                        ) : (
                            <Marker key={`marker-${item.properties.id}`} coordinate={{ latitude, longitude }} title={item.properties.city}>
                                <Text style={[styles.emoji, { fontSize: getEmojiSize(zoomLevel) }]}>🔥</Text>
                            </Marker>
                        );
                    })}
                </MapView>
            )}
        </View>
    );
};
export default FireMapScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    map: { width: "100%", height: "100%" },
    emoji: { textAlign: "center" },
    cluster: {
        backgroundColor: "rgba(255, 0, 0, 0.8)",
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    clusterText: { color: "#fff", fontWeight: "bold" },
});