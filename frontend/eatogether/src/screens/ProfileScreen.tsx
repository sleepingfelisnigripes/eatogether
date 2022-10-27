import React, {Component, useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUserInfo, User, UserGroup } from '../../api/User';
import store from '../redux/store';
//import { useSelector} from 'react-redux';
//import { setLoggedInUser, IUserSliceState } from '../redux/userSlice';
//import { getUserInfo } from '../../api/User';
//import AsyncStorage from "@react-native-async-storage/async-storage";
//import { setLoggedInUser, IUserSliceState } from "../redux/userSlice";
//import { useDispatch, useSelector } from "react-redux";


let sexIcons: string = 'eye-off-outline';
let sexIconsColor: string = '#FFFFFF';
//const username = store.getState().user.username;
//const sex = store.getState().user.user_sex;


export default class ProfileScreen extends Component {

  /* constructor(props) {
    super(props);

    this.state = {
      userInfo: store.getState().user,
    };

    store.subscribe(() => {
      this.setState({
        userInfo: store.getState(),
      });
    });
  } */
  componentDidMount(): void {
    (async () => {
      const userInfo: User = await getUserInfo("2");
      console.log(userInfo);
    })();
  }

  render() {



    /* useEffect(() => { 
      getUserInfo(userId).then(user => setUsers(user?.upcomingUser?? []))
                         .catch(e => { console.log('Errors when fetching users joined group')
                                       console.log(e) })
    }, []) 
 */

    //var sex = store.getState().user.user_sex;

    const sex = 'F';

    if (sex == 'F') {
      sexIcons = 'female';
      sexIconsColor = '#ffafcc'
    } else if (sex == "M") {
      sexIcons = 'male';
      sexIconsColor = '#a2d2ff';
    } else if (sex == 'NB') {
      sexIcons = 'male-female';
      sexIconsColor = '#cdb4db'
    } else {
    }

    var userId = store.getState().user.user_id;
    
    

 


    var userPhoto = store.getState().user.user_photo;


    return (

      <View>
        <View style = {styles.header}>
          <Image style = {styles.backgroundImage} source={{uri: 'https://simply-delicious-food.com/wp-content/uploads/2019/07/Pancake-board-3.jpg'}}/>
          <Image style = {styles.profilePhoto} source={{uri: userPhoto}}/>
          <Text style = {styles.name} > {store.getState().user.username} </Text>
          <Text style = {styles.nameId} >eatogether ID: {userId}</Text>
          <TouchableOpacity style={styles.buttonEditProfile} onPress={() => this.props.navigation.navigate("Restaurants")}>
            <Text style = {styles.buttonEditProfileText} >Edit Profile</Text>  
          </TouchableOpacity>             
          <TouchableOpacity style={styles.buttonSet}>
            <Icon name = "settings-outline" color = '#FFFFFF' size={18}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBack}>
            <Icon name = {sexIcons} color = {sexIconsColor} size={16}/>
          </TouchableOpacity>
        </View>

        <View style = {styles.body}>
          <View style = {styles.title}>
            <Text style = {styles.titleText}>Favorite Restaurants</Text>
          </View>
        </View>
      </View>
    );
  }
} 


/* export default function ProfileScreen() {
  
  if (sex == 'F') {
    sexIcons = 'female';
    sexIconsColor = '#ffafcc'
  } else if (sex == "M") {
    sexIcons = 'male';
    sexIconsColor = '#a2d2ff';
  } else if (sex == 'NB') {
    sexIcons = 'male-female';
    sexIconsColor = '#cdb4db'
  } else {

  }
  var restaurantCount: Number = 5;
  for (var i=0; i < restaurantCount; i++) {
    <Text style = {styles.titleText}>Favorite Restaurant</Text>
  }
  return (
    <View>
        <View style = {styles.header}>
          <Image style = {styles.backgroundImage} source={{uri: 'https://simply-delicious-food.com/wp-content/uploads/2019/07/Pancake-board-3.jpg'}}/>
          <Image style = {styles.profilePhoto} source={{uri: 'https://dl.memuplay.com/new_market/img/com.vicman.newprofilepic.icon.2022-06-07-21-33-07.png'}}/>
          <Text style = {styles.name} >FirstName LastName</Text>
          <Text style = {styles.nameId} >eatogether ID: </Text>
          <Text style = {styles.shortIntro} >Introduce yourself</Text>
          <TouchableOpacity style={styles.buttonEditProfile}>
            <Text style = {styles.buttonEditProfileText} >Edit Profile</Text>  
          </TouchableOpacity>          
          <TouchableOpacity style={styles.buttonSet}>
            <Icon name = "settings-outline" color = '#FFFFFF' size={18}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBack}>
            <Icon name = {sexIcons} color = {sexIconsColor} size={16}/>
          </TouchableOpacity>
        </View>
        <View style = {styles.body}>
          <View style = {styles.title}>
            <Text style = {styles.titleText}>Favorite Restaurant</Text>
          </View>
          <Text style = {styles.titleText}>Restaurant</Text>
          <Text style = {styles.titleText}>Favorite Restaurant</Text>
          <Text style = {styles.titleText}>Favorite Restaurant</Text>
          <Text style = {styles.titleText}>Favorite Restaurant</Text>
          for (var i=0; i < restaurantCount; i++) {
            <Text style = {styles.titleText}>Favorite Restaurant</Text>
          }
        </View>
      </View>
  );
}  */

const styles = StyleSheet.create({

  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },

  backgroundImage:{
    backgroundColor: "#67B99A",
    opacity: 0.6,
    height:220,
  },

  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "white",
    left: 35,
    top: 55,
    position: 'absolute',
    backgroundColor: 'transparent',
  },

  // Set Name format
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '700',
    position: 'absolute',
    left: 145,
    top: 75,
    backgroundColor: 'transparent',
  },

  // Set ID format 
  nameId: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: '400',
    position: 'absolute',
    left: 145,
    top: 110,
    backgroundColor: 'transparent',
  },

  /* shortIntro: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: '400',
    position: 'absolute',
    left: 37,
    top: 166,
    backgroundColor: 'transparent',
  }, */

  buttonEditProfile: {
    position: 'absolute',
    top: 173,
    right: 80,
    height: 25,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    //backgroundColor: 'transparent',
    backgroundColor: 'rgba(150, 150, 150, 0.4)',
    //opacity: 0.5,
  },

  buttonSet: {
    //flex: 1,
    position: 'absolute',
    top: 173,
    right: 20,
    height: 25,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    //backgroundColor: 'transparent',
    backgroundColor: 'rgba(150, 150, 150, 0.4)',
    //opacity: 0.5,
  },

  buttonEditProfileText: {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    fontWeight: '500',
    fontSize: 15,
  },

  /* sexIcon: {
    
    position: 'absolute',
    top: 193,
    left: 37,
    backgroundColor: 'transparent',
    borderRadius:30,
    borderWidth:1,
    borderColor: '#FFFFFF', 
  }, */

  iconBack :{
    position: 'absolute',
    top: 173,
    left: 37,
    height: 25,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.4)',
  },

  /* setIcon: {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    fontWeight: '500',
    fontSize: 15,
  }, */
  
  body: {
    
    position: 'absolute',
    top: 212,
    width: '100%',
    borderWidth:3,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    borderColor: "#FFFFFF",
    backgroundColor: 'rgba(150, 150, 150, 0.4)',
    
  },

  title: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',

  },

  titleText: {
    fontSize: 20,
    fontWeight: '500',
    fontColor: 'rgb(0,0,0)',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: "#6c584c",
  }

});
