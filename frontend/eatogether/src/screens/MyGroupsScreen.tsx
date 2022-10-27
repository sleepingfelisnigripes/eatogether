import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { StreamChat, Channel as ChannelType } from "stream-chat";
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  MessageType,
  OverlayProvider,
  Thread,
} from "stream-chat-expo";
import { Group } from "../../api/Group";
import { getUserInfo } from "../../api/User";
import Card from "../components/card";
import ChatScreen from "./chat-screen";
import { RootState } from "../redux/store";

const client = StreamChat.getInstance("vsw2j53wvgv6");

const createTestChannelMethod = async () => {
  const channel = client.channel("messaging", "travel", {
    members: ["jlahey", "57"],
  });
  await channel.create();
};

export default function MyGroupsScreen() {
  const [channel, setChannel] = useState<ChannelType>();
  const [clientReady, setClientReady] = useState(false);
  const [thread, setThread] = useState<MessageType | null>();
  const { user_id, username, StreamToken, user_photo } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    const setupClient = async () => {
      try {
        await client.connectUser(
          {
            id: user_id,
            name: username,
            image: user_photo,
          },
          StreamToken
        );
        setClientReady(true);

        const channel = client.channel("messaging", {
          members: ["jlahey", "57"],
          name: "Awesome channel about traveling",
        });

        setChannel(channel);

        // // fetch the channel state, subscribe to future updates
        // const state = await channel.watch();

        // createTestChannelMethod().catch((e) => {
        //   console.log("error");
        //   console.log(e);
        // });
      } catch (e) {
        console.log(e);
      }
    };

    setupClient();
  }, []);

  const onBackPress = () => {
    if (thread) {
      setThread(undefined);
    } else if (channel) {
      setChannel(undefined);
    }
  };

  if (!clientReady) return null;

  return (
    <OverlayProvider topInset={60}>
      <TouchableOpacity onPress={onBackPress} disabled={!channel}>
        <View style={{ height: 60, paddingLeft: 16, paddingTop: 40 }}>
          {channel && <Text>Back</Text>}
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Chat client={client}>
          {channel ? (
            <Channel
              channel={channel}
              keyboardVerticalOffset={60}
              thread={thread}
              threadList={!!thread}
            >
              {thread ? (
                <Thread />
              ) : (
                <>
                  <MessageList onThreadSelect={setThread} />
                  <MessageInput />
                </>
              )}
            </Channel>
          ) : (
            <ChannelList onSelect={setChannel} />
          )}
        </Chat>
      </View>
    </OverlayProvider>
  );
}

// export default function MyGroupsScreen() {
//   const [selectedChat, setSelectedChat] = useState<string | null>(null)
//   const [groups, setGroups] = useState<Group[]>([])

//   useEffect(() => {
//     getUserInfo('2')
//       .then(user => setGroups(user?.upcomingGroups?? []))
//       .catch(e => {
//         console.log('Errors when fetching users joined group')
//         console.log(e)
//       })
//   }, [])

//   return (
//     // <SafeAreaView style={styles.container}>
//     //   {selectedChat?
//     //     // <ChatScreen chatId={selectedChat} handleReturn={() => setSelectedChat(null)}/>
//     //     <ChatScreen/>
//     //     :
//     //     (groups.map(group => ({
//     //         groupID: group.groupID,
//     //         cardTitle: group.restaurantName,
//     //         cardAvatar: group.restaurantImage,
//     //         cardDes: group.timestamp
//     //       })).map(cardData => (
//     //         <Card {...cardData} handleSelectChat={() => {setSelectedChat(cardData.groupID)}}/>
//     //       )))}
//     // </SafeAreaView>)
//     <SafeAreaView style={styles.container}>
//       <ChatScreen/>
//     </SafeAreaView>)
//   }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    // justifyContent: "center",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
