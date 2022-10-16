import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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

const client = StreamChat.getInstance("vsw2j53wvgv6");

export default function MyGroupsScreen() {
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
