import { StackScreenProps } from "@react-navigation/stack";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { RootNavParamList } from "../../App";

type Props = StackScreenProps<RootNavParamList, "RestaurantProfile">;
export default function RestaurantProfileScreen({ navigation, route }: Props) {
  useEffect(() => {
    console.log(navigation);
    console.log(route);
  }, []);

  return (
    <View>
      <Text>Restaurant Profile Screen</Text>
    </View>
  );
}
