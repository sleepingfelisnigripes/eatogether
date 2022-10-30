//import { Col, Row } from "react-bootstrap"
//import { Restaurants } from "../components/Restaurants"
import { View, ScrollView, StyleSheet, Image,FlatList,SafeAreaView,ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, Card, Button, Icon } from '@rneui/themed';
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootNavParamList } from "../../App";
import { ListItem, Avatar } from '@rneui/themed';
// import { getAllRestaurants } from '../../api/Restaurant';
import { ButtonGroup } from '@rneui/themed';
import * as Location from "expo-location";
import { AirbnbRating } from "@rneui/themed";




const BASE_URI = 'https://api.eatogether.site/restaurants';

var Position: { latitude: any; longitude: any; };

 
  
  
type Props = BottomTabScreenProps<RootNavParamList, "Restaurants">;





  
export default function RestaurantScreen({ navigation }: Props) { 

  


  const [isLoading, setLoading] = useState(true);
  var [dataR, setDataR] = useState<{ restaurantID: any; restaurantImage: any; restaurantName: any; address: any; rating: any; latlng: any; distance: any;}[]>([]);
  var [dataD, setDataD] = useState<{ restaurantID: any; restaurantImage: any; restaurantName: any; address: any; rating: any; latlng: any; distance: any;}[]>([]);
 
  
 

  const [selectedIndex, setSelectedIndex] = useState(0);

  async function updateUserPosition(): Promise<void> {
    try {
      const latestPosition: Location.LocationObject =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });

      Position = {
          latitude: latestPosition.coords.latitude,
          longitude: latestPosition.coords.longitude,
        
      };

    } catch (error) {
      return;
    }
  }

  function algorithm(point1:any, point2:any): any {
    let [x1, y1] = point1;
    let [x2, y2] = point2;
      let Lat1 = rad(x1); 
      let Lat2 = rad(x2);
      let a = Lat1 - Lat2;
      let b = rad(y1) - rad(y2); 
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) 
            + Math.cos(Lat1) * Math.cos(Lat2) * Math.pow(Math.sin(b / 2), 2)));
          
      s = s * 6378137.0;
      s = Math.round(s * 10000) / 10000;
      return s;
  
  }


  function rad(d:any):any{ return d * Math.PI / 180.00; };


  function getAllRestaurants(){

    fetch(BASE_URI)
      .then((response) => response.json())
      .then((json) => {
        //json = json.data;
        // console.log('json==>`')
        // console.log(json)
        const array_URL = [];

        for (var i = 0; i < json?.data.length; i++) {
          var max = i;
          const Roint = [json.data[i]?.latlng.latitude, json.data[i]?.latlng.longitude];
          const UPoint = [Position.latitude,Position.longitude];
          const dis = algorithm(Roint, UPoint);
          for (var j = i+1; j < json?.data.length; j++){
              if (json.data[max].rating <= json.data[j].rating){
                max = j;
              }

          }
          if(max != i){
              var temp = json.data[i]
              json.data[i] = json.data[max];
              json.data[max] = temp;
          }
          array_URL.push({
            restaurantID: json?.data[i]?.restaurantID,
            restaurantImage: json?.data[i]?.restaurantImage,
            restaurantName: json?.data[i]?.restaurantName,
            address: json?.data[i]?.address,
            rating: json?.data[i]?.rating,
            latlng: json?.data[i]?.latlng,
            distance: dis
          });
         
          //console.log(typeof Number(json?.data[i]?.rating));
        }


        //setData(json);
        setDataR([...array_URL]);
        //setData([...array_URL]);

        



        
        for (var i = 0; i < array_URL.length; i++) {
          var min =i;
          for (var j = i+1; j < array_URL.length; j++){
            if (array_URL[min].distance >= array_URL[j].distance){
              min = j;
            }

            if(min != i){
              var t: any = array_URL[i]
              array_URL[i] = array_URL[min];
              array_URL[min] = t;
          }

          }

        }

       setDataD([...array_URL]);

        
       
      

      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

      
  }



  useEffect(() => {
    //getAllRestaurants()
    updateUserPosition();
    getAllRestaurants();
    
  }, []);


  // useEffect(() => {
  //   console.log('data=.')
  //   console.log(data)
  // }, [data])

useEffect(() => {
  const unsubscribe = navigation.addListener("focus", () => {
    // The screen is focused
    console.log("Restaurant Screen is focused");
    // Call any action
  });

  // Return the function to unsubscribe from the event so it gets removed on unmount
  return unsubscribe;
}, [navigation]);


// useEffect(() => {

//   if(selectedIndex){
    
//     console.log("D")
//   }else{

//     console.log("R")
//   }
// }, [selectedIndex])




  
    
return (
  <>
    <Text style={styles.subHeader}>   Sort By:</Text>
    <ButtonGroup
      buttons={['Rating', 'Distance']}
      selectedIndex={selectedIndex}
      onPress={(value) => {
        setSelectedIndex(value);
      }}
      containerStyle={{ backgroundColor : "white" }}
    />
    <ScrollView>
    <View style={styles.container}>
    {
      // selectedIndex &&
      (selectedIndex ? dataD: dataR).map((l, i) => (
        <ListItem key={i}>
        <Card>
        {/* <Text style={{ marginTop: 5, marginRight: 5 }}>
          Rating: {l.rating}
        </Text> */}
        <Card.Title>{l.restaurantName}</Card.Title>
        <AirbnbRating
                    isDisabled={true}
                    showRating={false}
                    defaultRating={l.rating}
                    size={15}
                  />
        <Card.Divider />
        <Card.Image
          style={styles.image}
          source={{
            uri:
              l.restaurantImage
          }}
        />
        <Text style={{ marginTop: 5,marginBottom: 5 }}>
          {l.distance >= 1000? parseInt(l.distance)/1000 : parseInt(l.distance)} {l.distance >= 1000? "km" : "m"}
        </Text>
        <Button 
          icon={
            <Icon
              name="code"
              color="#ffffff"
              iconStyle={{ marginRight: 10 }}
            />
          }
          buttonStyle={{
            borderRadius: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
          }}
          title="View Info"
          onPress={() => { navigation.navigate("My Groups", {restaurantID: 1})}}
        />
        </Card>
        </ListItem>
      ))
      
    }
    </View>
  </ScrollView>
</>
);

};
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    fonts: {
      marginBottom: 8,
    },
    user: {
      flexDirection: 'row',
      marginBottom: 6,
    },
    image: {
      width: 300,
      height: 150,
      
    },
    name: {
      fontSize: 16,
      marginTop: 5,
    },

    subHeader: {
      backgroundColor : "white",
      color : "black",
      textAlign : "left",
      paddingVertical : 5,
      marginTop : 50,
      fontSize : 16 
    },
    });