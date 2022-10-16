import { Button } from '@rneui/base';
import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';

interface IChatScreen {
  chatId: string;
  handleReturn: () => void
}

const ChatScreen = ({ chatId, handleReturn }: IChatScreen) => (
  <View>
    <Text>
      {chatId}
    </Text>
    {/* <ChatRoomComp/> */}
    <Button onPress={handleReturn}>Return</Button>
  </View>
)

export default ChatScreen;