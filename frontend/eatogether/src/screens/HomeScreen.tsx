import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import MapView, { LatLng, Region } from "react-native-maps";
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
  const [region, setRegion] = useState<Region | null>(null);
  const [followMe, setFollowMe] = useState<boolean>(false);
  const trackingTimer = useRef<NodeJS.Timer>();

  // Get user's permission for location service once the screen is launched
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      updateUserPosition();
    })();
  }, []);

  useEffect(() => {
    if (followMe) {
      updateUserPosition();
      trackingTimer.current = setInterval(async () => {
        await updateUserPosition();
      }, 3000);
    } else {
      if (trackingTimer.current) {
        clearInterval(trackingTimer.current);
      }
    }

    return () => {
      clearInterval(trackingTimer.current);
    };
  }, [followMe]);

  async function updateUserPosition() {
    const latestPosition: Location.LocationObject =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });
    const newRegion: Region = {
      latitudeDelta: mapZoom,
      longitudeDelta: mapZoom,
      latitude: latestPosition.coords.latitude,
      longitude: latestPosition.coords.longitude,
    };
    const newPosition: LatLng = {
      latitude: latestPosition.coords.latitude,
      longitude: latestPosition.coords.longitude,
    };
    // mapViewRef.current?.animateToRegion(newRegion, 300);
    mapViewRef.current?.animateCamera(
      { center: newPosition },
      { duration: 300 }
    );
    // setRegion(newRegion);
  }

  return (
    <>
      <MapView
        provider={"google"}
        ref={mapViewRef}
        style={styles.mapContainer}
        initialRegion={UNIMELB_REGION}
        showsUserLocation={true}
        // followsUserLocation={true}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        pitchEnabled={false}
        region={region!}
      />
      <Button
        title={`Follow me: ${followMe ? "ON" : "OFF"}`}
        onPress={() => {
          setFollowMe(followMe ? false : true);
        }}
      />
      <Button
        title="Show my current location"
        onPress={() => {
          (async () => {
            await updateUserPosition();
          })();
        }}
      />
    </>
  );
}
console.log("Rendered Home Screen");

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
