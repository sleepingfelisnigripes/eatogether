import React, {Component, useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Ionicons'
import { getUserInfo, User} from '../../api/User';
import store from '../redux/store';
import { AirbnbRating } from '@rneui/themed';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Restaurant } from '../../api/Restaurant';





export default function ProfileScreen({navigation}: any) {

  const [user, setUser] = useState<User>({});
  const [restaurants, setResaurants] = useState<Restaurant[]>([])

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      console.log("Profile Screen is focused");
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(()=>{
    (async()=> {
      //const userInfo = await getUserInfo(store.getState().user.user_id);
      const userInfo = await getUserInfo('2');
      setUser(userInfo);
      setResaurants(userInfo?.favouriteRestaurants??[]);
      //console.log(userInfo?.favouriteRestaurants??[]);
    })();
  },[])

  async function handleLogout(): Promise<void> {
    // const dispatch = useDispatch();
    // Clear AsyncStorage keys
    const clearAsyncStorage = async () => {
      const keys = ["user_id", "username", "user_photo", "token"];
      try {
        await AsyncStorage.multiRemove(keys);
      } catch (e) {
        // remove error
        console.log("Done clearing AsyncStorage");
      }
    };
    await clearAsyncStorage();
  
    // Clear Redux store
    // const userData: IUserSliceState = {
    //   user_id: "",
    //   username: "",
    //   user_photo: "",
    //   token: "",
    // };
    // dispatch(setLoggedInUser(userData));
  
    // Navigate back to login screen
    navigation.navigate("Login");
  }
  

  const sex = user.gender;
  let sexIcons: string = 'eye-off-outline';
  let sexIconsColor: string = '#FFFFFF';

  if (sex == 'F') {
    sexIcons = 'gender-female';
    sexIconsColor = '#ffafcc'
  } else if (sex == "M") {
    sexIcons = 'gender-male';
    sexIconsColor = '#a2d2ff';
  } else if (sex == 'ND') {
    sexIcons = 'gender-male-female';
    sexIconsColor = '#cdb4db'
  } else {

  }
  return (
    <SafeAreaView style = {{flex:1, justifyContent:'flex-start'}}>
        <ImageBackground style = {styles.header} resizeMode = "cover" source = {{uri: 'https://simply-delicious-food.com/wp-content/uploads/2019/07/Pancake-board-3.jpg'}} imageStyle={{opacity: 0.6}}>
          <View style = {{flex: 6, flexDirection: 'row'}}>
            
            <View style = {{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
              <Image style = {styles.profilePhoto} source={{uri: user.userPhoto}}/>
            </View>
            
            <View style = {styles.userTitle}>

              <View style = {{flex: 1, justifyContent: 'center'}}>
                
                <Text style = {styles.name} >{user.userName}</Text>
                <Text style = {styles.nameId} >eatogether ID: {user.userID}</Text>
                
                <View style = {styles.sexIcon}>
                  <Icon name = {sexIcons} color= {sexIconsColor} size = {15}></Icon>
                </View>

              </View>
              
              <View style = {styles.logout}>
                
                <TouchableOpacity style={styles.logoutContent} onPress={handleLogout} >
                  <Icon name = "logout"  color = '#FFFFFF' size={15}>Logout</Icon>
                </TouchableOpacity>         
              
              </View>
            
            </View>
          
          </View>

          <View style = {styles.titleView}>
            <Text style = {styles.titleText}>Favorite Restaurant</Text>
          </View>
        
        </ ImageBackground>
        
        <View style = {styles.body}>  
          <ScrollView style = {{flex: 1}}>
      
            {restaurants.map((item)=>(   
              
              <TouchableOpacity style = {{flex: 1}} onPress={()=>navigation.navigate("Restaurants")}>
                
                <View style = {styles.restaurant} >

                  <View style = {{flex: 1}}>
                    <Image style = {styles.restaurantImage} source = {{uri: item.restaurantImage}}/>
                  </View>

                  <View style = {{flex: 3}}>
                    <Text style = {styles.restaurantInfo}>{item.restaurantName}</Text>
                    <AirbnbRating isDisabled = {true} showRating = {false} defaultRating = {item.rating} size = {15} />
                    <Icons name = "location-outline" style = {styles.restaurantInfo}>{item.address}</Icons>
                  </View>
                  
                </View>

              </TouchableOpacity>
            ))}
          
          </ScrollView>
        </View>
    </SafeAreaView>
  );
} 

const styles = StyleSheet.create({

  header: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },

  titleView: {
    flex: 1, 
    width: '100%',
    borderColor: "#FFFFFF", 
    borderTopLeftRadius: 13, 
    borderTopRightRadius: 13,
    borderWidth:1, 
    backgroundColor: '#FFFFFF',
    alignItems: 'center',

  },

  titleText: {
    fontSize: 17,
    fontWeight: '500',
    color: "#003049",
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: "Futura",
    //backgroundColor: '#FFFFFF',
  },
  
  profilePhoto: {
    width: 82,
    height: 82,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  
  userTitle: {
    flex: 6,
    paddingTop: 7,
  },

  // Set Name format
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '700',
    fontFamily: "Futura", 
  },

  // Set ID format 
  nameId: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: '400',
    /* position: 'absolute',
    left: 145,
    top: 110, */
    fontFamily: "Futura",
    //backgroundColor: 'transparent',
  },

  sexIcon :{
   /*  position: 'absolute',
    top: 173,
    left: 37, */
    width: 21,
    height: 21,
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius:10,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.9)',
    backgroundColor: 'rgba(150, 150, 150, 0.6)',
    marginTop:5,
  },

  logout: {
    flexDirection: 'row', 
    justifyContent:"flex-end", 
    marginTop:-30, 
    marginRight:15,
    marginBottom:10, 
    //position: 'absolute',
  },

  logoutContent: {
    height: 25,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.6)',
  },

  body: {
    flex: 4,
    backgroundColor: '#FFFFFF',
  },

  restaurant :{
    flexDirection: 'row',
    borderWidth:1,
    borderColor: '#edede9',
  },

  /* favoriteRestaurant: {
    //top: 500,
    borderWidth:1,
    borderColor: '#FFFFF0',
  }, */

  restaurantImage: {
    height: '100%',
    width: "100%",
    //paddingLeft: 20,
  },

  restaurantInfo: {
    fontSize: 17,
    fontWeight: '500',
    color: "#003049",
    fontFamily: "Futura",
    paddingLeft: 15
  }

});
