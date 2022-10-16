import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Group } from '../../api/Group';
import { Gender, getUserInfo, User } from '../../api/User';
import Card from '../components/card';
import ChatScreen from './chat-screen';

const mockParticipants: User[] = [1,2,3].map(p => ({
  userID: `userID${p}`,
  userName: `userName${p}`,
  favouriteRestaurants: [],
  gender: Gender.male,
  userPhoto: `userPhoto${p}`,
  upcomingGroups: [],
}))

// const mockGroupDatas: Group[] = [1,2,3,4,5].map(a => (
//   {groupID: `groupID${a}`,
//     restaurantID: `restaurantID${a}`, // The restaurant that the group is going
//     initUserID: `initUserID${a}`, // User ID of the user who initiated the group
//     timestamp: `timestamp${a}`, // Timestamp of the meeting. String type in ISO 8601 format, e.g. "2022-09-26T13:25:40+10:00"
//     maxParticipants: a, // Number of maximum participants
//     currentParticipants: a, // Current number of participants joined
//     participants: mockParticipants, }
// ))

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