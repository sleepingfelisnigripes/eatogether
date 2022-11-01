import * as React from "react";
import { StyleSheet, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./src/screens/ProfileScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RestaurantsScreen from "./src/screens/RestaurantsScreen";
import MyGroupsScreen from "./src/screens/MyGroupsScreen";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "./src/screens/RegisterScreen";
import Login from "./src/screens/LoginScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import { expo } from "./app.json";
import { registerRootComponent } from "expo";
import { color } from "react-native-reanimated";

AppRegistry.registerComponent(expo.name, () => App);

type IconName = React.ComponentProps<typeof Ionicons>["name"];

LogBox.ignoreLogs(["Audio Video library"]); // Ignore log notification by message

export type RootNavParamList = {
  Home: {};
  Restaurants: {};
  "My Groups": {};
  Profile: {};
  Login: undefined;
  RegisterScreen: undefined;
  Auth: undefined;
  TabNavigationRoutes: undefined;
  RestaurantProfileScreen: undefined;
};

const Tab = createBottomTabNavigator<RootNavParamList>();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IconName = "home";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Restaurants") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "My Groups") {
            iconName = focused
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={"#E85D04"} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "#E85D04",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Restaurants" component={RestaurantsScreen} />
      <Tab.Screen name="My Groups" component={MyGroupsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator<RootNavParamList>();

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: "Register", //Set Header Title
          headerStyle: {
            backgroundColor: "#DC2F02", //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* Auth: Include Login and Signup */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack.Navigator initialRouteName="Auth">
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={{ headerShown: false }}
            />
            {/* Navigation Tab: Include main app content */}
            <Stack.Screen
              name="TabNavigationRoutes"
              component={MyTabs}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </GestureHandlerRootView>
      </NavigationContainer>
    </Provider>
  );
}

registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
