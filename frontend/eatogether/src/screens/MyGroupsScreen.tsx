import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Group } from '../../api/Group';
import { Gender, getUserInfo, User } from '../../api/User';
import Card from '../components/card';
import ChatScreen from './chat-screen';

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
        <ChatScreen chatId={selectedChat} handleReturn={() => setSelectedChat(null)}/>
        :
        (groups.map(group => ({
            groupID: group.groupID,
            cardTitle: group.restaurantName,
            cardAvatar: group.restaurantImage,
            cardDes: group.timestamp
          })).map(cardData => (
            <Card {...cardData} handleSelectChat={() => {setSelectedChat(cardData.groupID)}}/>
          )))}
    </SafeAreaView>
  );
}

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