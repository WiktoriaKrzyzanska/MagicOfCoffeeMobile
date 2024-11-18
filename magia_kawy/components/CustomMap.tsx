import mapStyle from "@/utils/mapConf";
import homeScreenCountryMarkersData from "@/utils/homeScreenCountryMarkersData";
import { CustomMapMarker } from "@/components/CustomMapMarker";
import MapView from "react-native-maps";
import React from "react";
import { StyleSheet, View } from "react-native";

const CustomMap = () => {
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: 20,
          longitude: 0,
          latitudeDelta: 100,
          longitudeDelta: 100,
        }}
      >
        {homeScreenCountryMarkersData.map((marker) => (
          <CustomMapMarker key={marker.id} marker={marker} />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    maxHeight: 300,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default CustomMap;
