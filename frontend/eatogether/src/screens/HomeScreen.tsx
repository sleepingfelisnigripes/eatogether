import { useEffect, useState, useRef } from "react";
import { Linking, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { Button } from "@rneui/themed";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../../App";

type Props = BottomTabScreenProps<RootTabParamList, "Home">;

export default function HomeScreen({ navigation }: Props): JSX.Element {
  const mapZoom: number = 0.004;
  const UNIMELB_REGION = {
    latitude: -37.796671094693004,
    longitude: 144.96108337210148,
    latitudeDelta: mapZoom,
    longitudeDelta: mapZoom,
  };

  const mapViewRef = useRef<MapView>(null);
  const [followMe, setFollowMe] = useState<boolean>(false);
  const trackingTimer = useRef<NodeJS.Timer | null>(null);
  const [locationPermissionStatus, setLocationPermissionStatus] =
    useState<Location.PermissionStatus>(Location.PermissionStatus.DENIED);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      console.log("Home screen is focused");
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  // Get user's permission for location service once the screen is launched
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermissionStatus(status);
      if (status !== Location.PermissionStatus.GRANTED) {
        return;
      }
      await updateUserPosition();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await checkLocationPermission();
        if (locationPermissionStatus !== Location.PermissionStatus.GRANTED) {
          throw new Error("Location Permission not granted");
        }
      } catch (error) {
        return;
      }
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
        if (trackingTimer.current) {
          clearInterval(trackingTimer.current);
        }
      };
    })();
  }, [followMe]);

  async function checkLocationPermission(): Promise<void> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermissionStatus(status);
  }

  async function updateUserPosition(): Promise<void> {
    try {
      await checkLocationPermission();
      if (locationPermissionStatus !== Location.PermissionStatus.GRANTED) {
        throw new Error("Location Permission not granted");
      }

      const latestPosition: Location.LocationObject =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });

      const newPosition = {
        center: {
          latitude: latestPosition.coords.latitude,
          longitude: latestPosition.coords.longitude,
        },
        zoom: 16,
      };

      mapViewRef.current?.animateCamera(newPosition, { duration: 300 });
      // mapViewRef.current?.animateToRegion(newRegion, 300);
      // setRegion(newRegion);
    } catch (error) {
      return;
    }
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
      />
      {/* <Button
        title={`Move to a random point`}
        onPress={() => {
          mapViewRef.current?.animateCamera(
            {
              center: {
                latitude: Math.random() * 50,
                longitude: Math.random() * 50,
              },
            },
            { duration: 300 }
          );
        }}
      /> */}
      {locationPermissionStatus === Location.PermissionStatus.GRANTED ? (
        <>
          <Button
            color="secondary"
            title={`Follow me: ${followMe ? "ON" : "OFF"}`}
            style={styles.button}
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
      ) : (
        <>
          <Button
            color="success"
            title="Grant Location Permission"
            onPress={() => {
              (async () => {
                await checkLocationPermission();
                if (
                  locationPermissionStatus === Location.PermissionStatus.DENIED
                ) {
                  Linking.openSettings();
                }
              })();
            }}
          />
        </>
      )}
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
  button: {
    marginBottom: 5,
  },
});
