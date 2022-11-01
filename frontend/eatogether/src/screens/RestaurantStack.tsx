import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { PropsWithRef } from "react";
import { RootNavParamList } from "../../App";
import RestaurantProfileScreen from "./RestaurantProfileScreen";
import RestaurantScreen from "./RestaurantsScreen";
type Props = BottomTabScreenProps<RootNavParamList, "Restaurants">;

export default function RestaurantStack({ navigation, route }: Props) {
  const Stack = createStackNavigator<RootNavParamList>();

  return (
    <Stack.Navigator initialRouteName="RestaurantsList">
      <Stack.Screen
        name="RestaurantsList"
        component={RestaurantScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RestaurantProfile"
        component={RestaurantProfileScreen}
        options={{
          title: "Restaurant Profile", //Set Header Title
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
}
