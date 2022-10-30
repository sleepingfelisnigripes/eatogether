import { ListItem, Avatar } from "@rneui/themed";
import TouchableScale from "react-native-touchable-scale"; // https://github.com/kohver/react-native-touchable-scale
import { LinearGradient } from "expo-linear-gradient"; // Only if no expo
import { StyleSheet } from "react-native";
import React from "react";
interface ICard {
  cardTitle: string;
  cardDes: string;
  cardAvatar: string;
  handleSelectChat: () => void;
}

const Card = ({ cardTitle, cardDes, handleSelectChat, cardAvatar }: ICard) => (
  <ListItem
    style={styles.card}
    Component={TouchableScale}
    // friction={90} //
    // tension={100} // These props are passed to the parent component (here TouchableScale)
    // activeScale={0.95} //
    linearGradientProps={{
      colors: ["#FF9800", "#F44336"],
      // start: { x: 1, y: 0 },
      // end: { x: 0.2, y: 0 },
    }}
    onPress={handleSelectChat}
    // ViewComponent={LinearGradient} // Only if no expo
  >
    <Avatar
      size={54}
      rounded
      source={{ uri: cardAvatar }}
      // containerStyle={{ backgroundColor: '#3d4db7' }}
    />
    <ListItem.Content>
      <ListItem.Title
        style={{ color: "black", fontWeight: "bold", marginBottom: 10 }}
      >
        {cardTitle}
      </ListItem.Title>
      <ListItem.Subtitle style={{ color: "black" }}>
        {`Created at: ${cardDes}`}
      </ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron color="black" />
  </ListItem>
);

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
});

export default Card;
