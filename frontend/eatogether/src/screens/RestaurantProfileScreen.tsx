import { StackScreenProps } from "@react-navigation/stack";
import { RootNavParamList } from "../../App";
import React ,{ useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { AirbnbRating } from '@rneui/themed';
import { Tab,  TabView, Image, BottomSheet, Button, ListItem, Icon } from '@rneui/themed';
import { getRestaurantInfo, Restaurant } from '../../api/Restaurant';
import { useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../redux/store";
import { Review } from '../../api/Review';

import { SafeAreaProvider } from 'react-native-safe-area-context';

type Props = StackScreenProps<RootNavParamList, "RestaurantProfile">;
export default function RestaurantProfileScreen({ navigation, route }: Props) {
    // Get the restaurant ID
    const restaurantID = route.params.restaurantID;
    // Get the user ID
    const { user_id } = useSelector((state: ReduxRootState) => state.user);

    // Get the restaurant object and reviews
    const [restaurant, setRestaurant] = useState<Restaurant>();
    const [reviews, setReviews] = useState<Review[]>();
    useEffect(()=>{
        async function getData() {
            const restaurant= await getRestaurantInfo(restaurantID);
            setRestaurant(restaurant);
            setReviews(restaurant.reviews);
        }
        getData(); 
    },[])


    type RatingsComponentProps = {};

    const ratingCompleted = (rating: number) => {
    console.log('Rating is: ' + rating);
    };

    const ratingProps = {};

    const [index, setIndex] = React.useState(0);

    const [like, setLike] = React.useState(false);


    const [isVisible, setIsVisible] = useState(false);
    const [submitReview,setSubmitReview] = useState(false);
    const addReviewList = [
    { title: 'List Item 1' },
    { title: 'List Item 2' },
    { title: 'Submit Review',
        containerStyle: { backgroundColor: 'blue' },
        titleStyle: { color: 'white' },
        onPress: () => {setSubmitReview(true), setIsVisible(false)}

    },
    {
        title: 'Cancel',
        containerStyle: { backgroundColor: 'red' },
        titleStyle: { color: 'white' },
        onPress: () => setIsVisible(false),
    },
    ];

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
            
            {/* The head part */}
            <View style= {styles.head}>
                <View style = {{
                flex : 2, 
                alignItems: "center", 
                justifyContent: "flex-start"}}>
                <Image 
                source={{uri: restaurant?.restaurantImage}}
                style={{width: 90, height: 90}} 
                />
                </View>
                <View style = {{
                flex : 4,
                flexDirection: "column"
                }}>
                <View style = {{flex: 1, alignItems: "flex-start"}}>
                    <Text style = {{
                    fontWeight: 'bold',
                    fontSize: 20
                    }}>
                    {restaurant?.restaurantName}
                    </Text>
                </View>
                <View style = {{
                    flex: 1, 
                    flexDirection: "row"
                    }}>
                        <View style = {{flex: 3, alignItems: "flex-start"}}>
                            <AirbnbRating 
                                isDisabled = {true}
                                showRating = {false}
                                defaultRating = {restaurant?.rating}
                                size = {20}
                            />
                        </View>
                        <View style = {{flex: 1, alignItems: "flex-start"}}>
                            {
                                like? 
                                <Icon
                                name='heart-o'
                                type='font-awesome'
                                color='#517fa4'
                                onPress = {() => {setLike(false)}}
                                />
                                :
                                <Icon
                                    name='heart'
                                    type='font-awesome'
                                    color='#517fa4'
                                    onPress = {() => {setLike(true)}}
                                />
                            }
                        </View>
                    
                </View>
                </View>
            </View>
    
            <View style = {{flex: 5}}>
                <Tab
                containerStyle = {{backgroundColor:'green'}}
                //buttonStyle = {{backgroundColor:'red'}}
                value={index}
                onChange={(e) => setIndex(e)}
                indicatorStyle={{
                    backgroundColor: 'white',
                    height: 3,
                }}
                variant="primary"
                >
                <Tab.Item
                    title="About"
                    titleStyle={{ fontSize: 12 }}
                    icon={{ name: 'timer', type: 'ionicon', color: 'white' }}
                />
                <Tab.Item
                    title="Review"
                    titleStyle={{ fontSize: 12 }}
                    icon={{ name: 'heart', type: 'ionicon', color: 'white' }}
                />
                <Tab.Item
                    title="Groups"
                    titleStyle={{ fontSize: 12 }}
                    icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
                />
                </Tab>
    
                <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <View>
                    <Text>Address : {restaurant?.address}</Text>    
                    <Text>Opening Hours: {restaurant?.openingHours}</Text>
                    <Text>Cuisine Type: {restaurant?.cuisineType}</Text>
                    </View>
                </TabView.Item>
                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <ScrollView>
    
                    <View>
                        <Button
                        title="Add Review"
                        onPress={() => setIsVisible(true)}
                        buttonStyle={styles.button}
                        />
                        <BottomSheet modalProps={{}} isVisible={isVisible}>
                        {addReviewList.map((l, i) => (
                            <ListItem
                            key={i}
                            containerStyle={l.containerStyle}
                            onPress={l.onPress}
                            >
                            <ListItem.Content>
                                
                                <ListItem.Title style={l.titleStyle}>
                                {l.title}
                                </ListItem.Title>
                            </ListItem.Content>
                            </ListItem>
                        ))}
                        </BottomSheet>
                    </View>
                    
                    {/* Display all the reviews */}
                    {/* for {review} in {reviews}: */}
                    {reviews?.map(review => (
                        <View style = {{
                            flexDirection: "row", 
                            borderTopWidth: 10,
                            borderColor: "white"
                        }} >
                            <View style = {{
                            flex:1, 
                            alignItems: "center", 
                            // justifyContent: "center"
                            }}>
                                <Image 
                                    source={{uri: review.reviewerPhoto}}
                                    style={{width: 40, height: 40}} 
                                />
                            </View>
                            <View style = {{flex:5, flexDirection: "column"}}>
                                <View>
                                    <Text> {review.reviewerName} </Text>
                                    <Text> Published on {review.timestamp.split("T")[0]} </Text>
                                    <Text> Rating </Text>
                                </View>
                                <View style= {{alignSelf: "flex-start"}}>
                                    <AirbnbRating 
                                    isDisabled = {true}
                                    showRating = {false}
                                    defaultRating = {review.reviewRating}
                                    size = {15}
                                    />
                                </View>
                                <View>
                                    <Text> {review.reviewText}</Text>
                                </View>
                                <View>
                                    <Image
                                        source={{uri: review.reviewImage}}
                                        style={{width: 80, height: 80}} 
                                    />
                                </View>

                            </View>
                        </View>
                    ))}
    
                    </ScrollView>
                </TabView.Item>
                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <Text>Cart</Text>
                </TabView.Item>
                </TabView>
    
            </View>
            </View>
        </SafeAreaProvider>
    
        
        );
};
    
const styles = StyleSheet.create({
container: {
flex: 1,
flexDirection: "column",
marginTop: 50,
},
head: {
flex: 1,
flexDirection: "row",
},
button: {
margin: 10,
},
head_image:{

},
viewContainer: {
flex: 1,
},
rating: {
paddingVertical: 10,
},
});



