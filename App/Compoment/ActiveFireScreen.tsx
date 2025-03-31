import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import MapView, { Marker } from 'react-native-maps';
function ActiveFireScreen() {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#fff');
    }, []),
  );
  const insets = useSafeAreaInsets();

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
      <View style={{ backgroundColor: "#f00", flex: 1 }} >
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="Marker Title"
          description="Marker Description"
        />
      </MapView> */}
      </View>


    </View>
  )
}

export default ActiveFireScreen

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
})