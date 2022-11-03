import { useEffect, useState, useRef } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Button } from "@rneui/themed";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootNavParamList } from "../../App";
import { useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../redux/store";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllRestaurants, Restaurant } from "../../api/Restaurant";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  // Update greetings according to time of day
  let greetings: string = "Good day";
  const currentHour = parseInt(moment().format("H"));
  if (currentHour < 12) {
    greetings = "🌞 Good morning";
  } else if (currentHour < 18) {
    greetings = "☕️ Good afternoon";
  } else {
    greetings = "🌝 Good evening";
  }

  // Get user's permission for location service once the screen is launched
  useEffect(() => {
    (async () => {
      await checkLocationPermission();
      if (locationPermissionStatus !== Location.PermissionStatus.GRANTED) {
        return;
      }
      await updateUserPosition();
      try {
        const restaurants = await getAllRestaurants();
        setRestaurants(restaurants);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      console.log("Home screen is focused");
      // Update restaurant list
      (async () => {
        try {
          const restaurants = await getAllRestaurants();
          setRestaurants(restaurants);
        } catch (error) {
          console.error(error);
        }
      })();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

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

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "flex-start" }}>
      <View style={styles.bannerContainer}>
        <Text style={styles.greetings}>
          {greetings + ", "}
          {useSelector((state: ReduxRootState) => state.user.username)}!
        </Text>
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
      >
        {restaurants.length > 0 &&
          restaurants.map((marker) => (
            <Marker
              coordinate={marker.latlng}
              onPress={() => {
                setFollowMe(false);
                const newPosition = {
                  center: {
                    latitude: marker.latlng.latitude,
                    longitude: marker.latlng.longitude,
                  },
                  zoom: 17,
                };

                mapViewRef.current?.animateCamera(newPosition, {
                  duration: 300,
                });
              }}
              key={`marker-${marker.restaurantID}`}
            >
              <Image
                source={{ uri: marker.restaurantImage }}
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: 50,
                  resizeMode: "cover",
                }}
              ></Image>
              <Callout
                tooltip
                style={styles.callout}
                onPress={() => {
                  navigation.navigate("Restaurants", {
                    screen: "RestaurantProfile",
                    params: {
                      restaurantID: marker.restaurantID,
                    },
                    initial: false,
                  });
                }}
              >
                <View style={styles.calloutContainer}>
                  <View style={styles.bubble}>
                    <View style={styles.bubbleContent}>
                      <Text
                        style={styles.calloutHeaderText}
                        numberOfLines={2}
                        ellipsizeMode={"tail"}
                      >
                        {marker.restaurantName}
                      </Text>
                      <Text>{marker.cuisineType}</Text>
                      <Text>
                        {marker.noOfGroupsToday > 0
                          ? marker.noOfGroupsToday
                          : "No"}{" "}
                        upcoming group{marker.noOfGroupsToday > 1 ? "s" : ""}
                      </Text>
                      <Text style={styles.calloutDescriptionText}>
                        Tap here to see more details
                      </Text>
                    </View>
                  </View>
                  <View style={styles.arrowBorder} />
                  <View style={styles.arrow} />
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>
      {locationPermissionStatus === Location.PermissionStatus.GRANTED ? (
        <>
          <Button
            color="#E85D04"
            title={`Follow me: ${followMe ? "ON" : "OFF"}`}
            style={styles.button}
            onPress={() => {
              setFollowMe(followMe ? false : true);
            }}
          />
          <Button
            color="#E85D04"
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    flex: 1,
    maxHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E85D04",
  },
  greetings: {
    flex: 5,
    fontSize: 20,
    marginLeft: 20,
    color: "#ffffff",
    fontWeight: "500",
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
  callout: {
    width: 300,
    height: 200,
  },
  calloutContainer: {
    flexDirection: "column",
    alignSelf: "flex-start",
  },
  calloutHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  calloutDescriptionText: {
    color: "grey",
  },
  bubble: {
    width: 300,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    borderColor: "white",
    borderWidth: 0.5,
    marginTop: 32,
  },
  bubbleContent: {
    flex: 1,
  },
  arrow: {
    backgroundColor: "transparent",
    borderWidth: 16,
    borderColor: "transparent",
    borderTopColor: "white",
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderWidth: 16,
    borderColor: "transparent",
    borderTopColor: "white",
    alignSelf: "center",
    marginTop: -0.5,
  },
});
