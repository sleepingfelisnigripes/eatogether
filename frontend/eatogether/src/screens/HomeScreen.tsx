import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";

interface LocationObjectCoords {
  accuracy?: number | null;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  latitude: number;
  longitude: number;
  speed?: number | null;
}
interface LocationObject {
  coords: LocationObjectCoords;
  mocked?: boolean;
  timestamp?: number;
}

export default function HomeScreen() {
  const mapZoom: number = 0.004;
  const UNIMELB_REGION = {
    latitude: -37.796671094693004,
    longitude: 144.96108337210148,
    latitudeDelta: mapZoom,
    longitudeDelta: mapZoom,
  };

  let positionWatcher: Location.LocationSubscription;
  const mapViewRef = useRef<MapView>(null);

  // Get user's permission for location service once the screen is launched
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      // If location service permission is granted
      //   await updateUserPosition();
      positionWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Low,
          timeInterval: 10000,
          distanceInterval: 0,
        },
        (data) => {
          //   console.log(data);
          const newRegion = {
            latitudeDelta: mapZoom,
            longitudeDelta: mapZoom,
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
          };
          mapViewRef.current?.animateToRegion(newRegion, 300);
        }
      );
    })();
  }, []);

  async function updateUserPosition() {
    const latestPosition = await Location.getCurrentPositionAsync({});
    const newRegion = {
      latitudeDelta: mapZoom,
      longitudeDelta: mapZoom,
      latitude: latestPosition.coords.latitude,
      longitude: latestPosition.coords.longitude,
    };
    mapViewRef.current?.animateToRegion(newRegion, 300);
  }

  return (
    <>
      <MapView
        ref={mapViewRef}
        style={styles.mapContainer}
        initialRegion={UNIMELB_REGION}
      />
      <Button title="Update location" onPress={updateUserPosition} />
    </>
  );
}
console.log("rendered");

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
