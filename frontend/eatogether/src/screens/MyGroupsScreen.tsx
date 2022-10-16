import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { Group } from '../../api/Group';
import { getUserInfo } from '../../api/User';
import Card from '../components/card';

const client = StreamChat.getInstance("vsw2j53wvgv6");

export function ChatScreen() {
  const [channel, setChannel] = useState<ChannelType>();
  const [clientReady, setClientReady] = useState(false);
  const [thread, setThread] = useState<MessageType | null>();

  useEffect(() => {
    const setupClient = async () => {
      try {
        await client.connectUser(
          {
            id: "jlahey",
            name: "Jim Lahey",
            image: "https://i.imgur.com/fR9Jz14.png",
          },
          "user_token"
        );
        setClientReady(true);
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

  // return (
  //   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //     <OverlayProvider>
  //       <Chat client={client}>
  //         <ChannelList />
  //       </Chat>
  //       ;
  //     </OverlayProvider>
  //   </View>
  // );
}

export default function MyGroupsScreen() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    getUserInfo('2')
      .then(user => setGroups(user?.upcomingGroups?? []))
      .catch(e => {
        console.log('Errors when fetching users joined group')
        console.log(e)
      })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {selectedChat?
        // <ChatScreen chatId={selectedChat} handleReturn={() => setSelectedChat(null)}/>
        <ChatScreen/>
        :
        (groups.map(group => ({
            groupID: group.groupID,
            cardTitle: group.restaurantName,
            cardAvatar: group.restaurantImage,
            cardDes: group.timestamp
          })).map(cardData => (
            <Card {...cardData} handleSelectChat={() => {setSelectedChat(cardData.groupID)}}/>
          )))}
    </SafeAreaView>)}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    // justifyContent: "center",
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});