import { useEffect, useState, useRef } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { Button } from "@rneui/themed";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootNavParamList } from "../../App";
import { useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../redux/store";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = BottomTabScreenProps<RootNavParamList, "Home">;

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

  // Update greetings according to time of day
  let greetings: string = "Good day";
  const currentHour = parseInt(moment().format("H"));
  if (currentHour < 12) greetings = "🌞 Good morning";
  else if (currentHour < 18) greetings = "☕️ Good afternoon";
  else greetings = "🌝 Good evening";

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

  // Handle whether the user wants the map moves as the user moves
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

 /*  async function handleLogout(): Promise<void> {
    // const dispatch = useDispatch();

    // Clear AsyncStorage keys
    const clearAsyncStorage = async () => {
      const keys = ["user_id", "username", "user_photo", "token"];
      try {
        await AsyncStorage.multiRemove(keys);
      } catch (e) {
        // remove error
        console.log("Done clearing AsyncStorage");
      }
    };
    await clearAsyncStorage();

    // Navigate back to login screen
    navigation.navigate("Login");
  } */

  return (
    <>
      <View style={styles.bannerContainer}>
        <Text style={styles.greetings}>
          {greetings + ", "}
          {useSelector((state: ReduxRootState) => state.user.username)}!
        </Text>
        {/* <Text style={styles.logoutButton} onPress={handleLogout}>
          Logout
        </Text> */}
      </View>

      <MapView
        provider={"google"}
        ref={mapViewRef}
        style={styles.mapContainer}
        initialRegion={UNIMELB_REGION}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        pitchEnabled={false}
      />
      {locationPermissionStatus === Location.PermissionStatus.GRANTED ? (
        <>
          <Button
            color="#DC2F02"
            title={`Follow me: ${followMe ? "ON" : "OFF"}`}
            style={styles.button}
            onPress={() => {
              setFollowMe(followMe ? false : true);
            }}
          />
          <Button
            color="#DC2F02"
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
            color="#DC2F02"
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
  bannerContainer: {
    flex: 1.1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "#DC2F02",
  },
  greetings: {
    flex: 5,
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 20,
    color: "#ffffff",
    fontWeight: '500',
    //fontFamily:"times"
  },
  /* logoutButton: {
    flex: 1,
    fontSize: 15,
    marginBottom: 15,
    // marginStart: 30,
    color: "#ffff00",
  }, */
  mapContainer: {
    flex: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginBottom: 5,
  },
});
