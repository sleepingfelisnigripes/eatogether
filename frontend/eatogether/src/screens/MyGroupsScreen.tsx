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
// import Card from "../components/Card";
import ChatScreen from "./ChatScreen";
import { RootState } from "../redux/store";

const client = StreamChat.getInstance("vsw2j53wvgv6");

export default function MyGroupsScreen() {
  const [channel, setChannel] = useState<ChannelType>();
  const [clientReady, setClientReady] = useState(false);
  const [thread, setThread] = useState<MessageType | null>();
  const { user_id, username, StreamToken, user_photo } = useSelector(
    (state: RootState) => state.user
  );
  const filters = {
    members: {
      $in: [user_id],
    },
  };
  // @ts-ignore
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

        // // fetch the channel state, subscribe to future updates
        // const state = await channel.watch();
      } catch (e) {
        console.log(e);
      }
    };

    setupClient();

    return () => {
      client.disconnectUser();
      setClientReady(false);
      console.log("Stream logged off");
    };
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
        <View style={{ height: 80, paddingLeft: 16, paddingTop: 40 }}>
          {channel && <Text style={{ marginTop: 10, fontSize: 25 }}>Back</Text>}
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
            <ChannelList
              filters={filters}
              sort={{ last_message_at: -1 }}
              onSelect={setChannel}
            />
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
    backgroundColor: "#370617",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
