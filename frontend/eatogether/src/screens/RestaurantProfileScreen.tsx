import { StackScreenProps } from "@react-navigation/stack";
import { RootNavParamList } from "../../App";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInputComponent,
} from "react-native";
import { AirbnbRating } from "@rneui/themed";
import {
  Tab,
  TabView,
  Image,
  BottomSheet,
  Button,
  ListItem,
  Icon,
  Input,
} from "@rneui/themed";
import {
  getRestaurantInfo,
  Restaurant,
  setFavouriteRestaurant,
} from "../../api/Restaurant";
import { useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../redux/store";
import { Group, createGroup, joinGroup } from '../../api/Group';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Review, postReview } from "../../api/Review";
import * as ImagePicker from "expo-image-picker";
import {
  manipulateAsync,
  SaveFormat,
  ImageResult,
} from "expo-image-manipulator";
import { ServerResponse } from "../../api/Common";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { Time } from "stream-chat-expo";
import moment from "moment";
import { getUserInfo } from "../../api/User";

type Props = StackScreenProps<RootNavParamList, "RestaurantProfile">;
export default function RestaurantProfileScreen({ navigation, route }: Props) {
  // Get the restaurant ID
  const restaurantID = route.params.restaurantID;
  // Get the user ID
  const { user_id, ETToken } = useSelector(
    (state: ReduxRootState) => state.user
  );

  // Get the restaurant object and reviews
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>();
  const [groups, setGroups] = useState<Group[]>();
  useEffect(() => {
    async function getData() {
      const restaurant = await getRestaurantInfo(restaurantID);
      setRestaurant(restaurant);
      setReviews(restaurant.reviews);
      setGroups(restaurant.upcomingGroups);

      const { favouriteRestaurants } = await getUserInfo(user_id);
      const index = favouriteRestaurants!.findIndex(
        (restaurant) => restaurant.restaurantID === restaurantID
      );
      if (index > -1) {
        setLike(true);
      }
    }
    getData();
  }, []);

  async function updateRestaurant() {
    const restaurant = await getRestaurantInfo(restaurantID);
    setRestaurant(restaurant);
    setReviews(restaurant.reviews);
    setGroups(restaurant.upcomingGroups);
  }

  const [errorText, setErrorText] = useState("");

  // the index of the tab subpage
  const [index, setIndex] = React.useState(0);

  // whether the restaurant is in the user's favourate list
  const [like, setLike] = React.useState(false);

  // set the rating in the review
  const [rating, setRating] = React.useState(3);

  // set the review text
  const [reviewText, setReviewText] = useState<string | null>("");

  // set the phote in the review
  const [reviewImage, setReviewImage] = useState<ImageResult | null>(null);

  const [groupMemberNum, setGroupMemberNum] = useState<number>(6);
  const [groupTime, setGroupTime] = useState<Date>(new Date());
  const [addGroupListVisible, setAddGroupListVisible] = useState(false);
  const [groupTimePickerVis, setGroupTimePickerVis] = useState(false);
  const [groupHourPickerVis, setGroupHourPickerVis] = useState(false);

  const handleChoosePhoto = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const manipResult = await manipulateAsync(
        result.uri,
        [{ resize: { width: 150 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );
      setReviewImage(manipResult);
    }
  };

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Please allow permission to use camera in order to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      const manipResult = await manipulateAsync(
        result.uri,
        [{ resize: { width: 150 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );
      setReviewImage(manipResult);
    }
  };

  const handleSubmitReview = async () => {
    setErrorText("");
    if (!reviewText) {
      setErrorText("Please type in review text!");
      console.log(errorText);
      return;
    }

    try {
      const response: ServerResponse = await postReview(
        ETToken,
        restaurantID,
        rating,
        reviewText,
        reviewImage
      );
      if (response.status === "success") {
        setIsVisible(false);
        updateRestaurant();
        console.log("Review Published successfully");
      } else {
        //Hide Loader
        setIsVisible(false);
        setErrorText(response.message ?? "Unknown error occurred");
        console.log(errorText);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorText(error.message ?? "Unknown error occurred");
        console.log(error);
      }
    }
  };

  const handleJoinGroup = async (groupID: string) => {
    try {
      console.log("Joining process starting");
      const response: ServerResponse = await joinGroup(ETToken, groupID);
      console.log("got response");
      if (response.status === "success") {
        updateRestaurant();
        console.log("Join Group successfully");
      } else {
        //Hide Loader
        setErrorText(response.message ?? "Unknown error occurred");
        console.log(errorText);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorText(error.message ?? "Unknown error occurred");
        console.log(error);
      }
    }
  };

  const handleCreateGroup = async () => {
    try{
        console.log("Creating group process starting")
        const response : ServerResponse = await createGroup(
            ETToken,
            restaurantID,
            moment(groupTime).format(),
            groupMemberNum
        );
        console.log("got response")
        if (response.status === "success") {
            updateRestaurant();
            console.log("Create Group successfully");
          } else {
            //Hide Loader
            setErrorText(response.message ?? "Unknown error occurred");
            console.log(errorText);
          }
    } catch (error) {
        if (error instanceof Error) {
          setErrorText(error.message ?? "Unknown error occurred");
          console.log(error);
        }
    }
  }


  const addGroupList = [
    {
      title: "Select Group Time",
    },
    {
        title : (groupTime.toDateString()),
        onPress: ()=>{
            console.log('press true')
            setGroupTimePickerVis(true)}
    },
    {
        title : (groupTime.toTimeString()),
        onPress: ()=>{
            console.log('press true')
            setGroupHourPickerVis(true)}
    },
    {
      content: (
        <Input
          placeholder="Maximum People"
          containerStyle={{ marginTop: -30, marginLeft: -10 }}
          onChangeText={(maxNumString) => {
            var maxNum = 0;
            try {
              maxNum = parseInt(maxNumString);
            } catch (error) {
              console.log("Please type in number");
            }
            setGroupMemberNum(maxNum);
          }}
        ></Input>
      ),
    },
    {
        title: "Create",
        containerStyle: { backgroundColor: "#6A040F" },
        titleStyle: { color: "white" },
        onPress: () => {setAddGroupListVisible(false), handleCreateGroup()}
    },
    {
        title: "Cancel",
        containerStyle: { backgroundColor: "#6A040F" },
        titleStyle: { color: "white" },
        onPress: () => setAddGroupListVisible(false),
    },
  ];

  const [isVisible, setIsVisible] = useState(false);
  //const [submitReview,setSubmitReview] = useState(false);
  const addReviewList = [
    {
      title: "Rating",
      containerStyle: { marginBottom: -20 },
      content: (
        <AirbnbRating
          showRating={false}
          defaultRating={3.0}
          size={20}
          starContainerStyle={{ marginLeft: -5 }}
          onFinishRating={(value) => {
            setRating(value);
          }}
        />
      ),
    },
    {
      content: (
        <Input
          placeholder="Review Text"
          containerStyle={{ marginTop: -30, marginLeft: -10 }}
          onChangeText={(reviewInput) => {
            setReviewText(reviewInput);
          }}
        ></Input>
      ),
    },
    {
      title: "Photo",
      containerStyle: { marginTop: -50, backgroundColor: "white" },
      content:
        reviewImage == null ? (
          <>
            <TouchableOpacity
              style={styles.photoButtonStyle}
              activeOpacity={0.5}
              onPress={handleChoosePhoto}
            >
              <Text style={styles.buttonTextStyle}>Choose Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoButtonStyle}
              activeOpacity={0.5}
              onPress={openCamera}
            >
              <Text style={styles.buttonTextStyle}>Take a photo</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Image
              source={{ uri: reviewImage.uri }}
              containerStyle={{ alignSelf: "center" }}
              style={{ width: 150, height: 150 }}
            />
            <TouchableOpacity
              style={styles.photoButtonStyle}
              activeOpacity={0.5}
              onPress={() => setReviewImage(null)}
            >
              <Text style={styles.buttonTextStyle}>Remove photo</Text>
            </TouchableOpacity>
          </>
        ),
    },
    {
      title: "Submit Review",
      containerStyle: { backgroundColor: "#D00000" },
      titleStyle: { color: "white" },
      onPress: () => {
        handleSubmitReview();
      },
    },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "#6A040F" },
      titleStyle: { color: "white" },
      onPress: () => setIsVisible(false),
    },
  ];

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* The head part */}
        <View style={styles.head}>
          <View
            style={{
              flex: 2,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {restaurant && (
              <Image
                source={{ uri: restaurant.restaurantImage }}
                style={{ width: 90, height: 90 }}
              />
            )}
          </View>
          <View
            style={{
              flex: 4,
              flexDirection: "column",
            }}
          >
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                {restaurant?.restaurantName}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 3, alignItems: "flex-start" }}>
                <AirbnbRating
                  isDisabled={true}
                  showRating={false}
                  defaultRating={restaurant?.rating}
                  size={20}
                />
              </View>
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                {like ? (
                  <Icon
                    name="heart"
                    type="font-awesome"
                    color="#DC2F02"
                    onPress={() => {
                      setLike(false);
                      setFavouriteRestaurant(ETToken, restaurantID, false);
                    }}
                  />
                ) : (
                  <Icon
                    name="heart-o"
                    type="font-awesome"
                    color="#DC2F02"
                    onPress={() => {
                      setLike(true);
                      setFavouriteRestaurant(ETToken, restaurantID, true);
                    }}
                  />
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={{ flex: 5 }}>
          <Tab
            containerStyle={{ backgroundColor: "#E85D04" }}
            value={index}
            onChange={(e) => setIndex(e)}
            disableIndicator
            variant="primary"
          >
            <Tab.Item
              title="About"
              titleStyle={{ fontSize: 12 }}
              containerStyle={(active) => ({
                backgroundColor: active ? "#F48C06" : undefined,
              })}
              icon={{
                name: "information-circle-outline",
                type: "ionicon",
                color: "white",
              }}
            />
            <Tab.Item
              title="Reviews"
              titleStyle={{ fontSize: 12 }}
              containerStyle={(active) => ({
                backgroundColor: active ? "#F48C06" : undefined,
              })}
              icon={{ name: "pencil-outline", type: "ionicon", color: "white" }}
            />
            <Tab.Item
              title="Groups"
              titleStyle={{ fontSize: 12 }}
              containerStyle={(active) => ({
                backgroundColor: active ? "#F48C06" : undefined,
              })}
              icon={{ name: "people-outline", type: "ionicon", color: "white" }}
            />
          </Tab>

          <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={{ backgroundColor: "white", width: "100%" }}>
              <View>
                <Text style={styles.infoHeading}>📍 Address</Text>
                <Text style={styles.infoContent}>{restaurant?.address}</Text>
                <Text style={styles.infoHeading}>🕘 Opening Hours</Text>
                <Text style={styles.infoContent}>
                  {restaurant?.openingHours}
                </Text>
                <Text style={styles.infoHeading}>🥘 Cuisine Type</Text>
                <Text style={styles.infoContent}>
                  {restaurant?.cuisineType}
                </Text>
              </View>
            </TabView.Item>
            <TabView.Item style={{ backgroundColor: "white", width: "100%" }}>
              <ScrollView>
                <View>
                  <Button
                    title="Add Review"
                    onPress={() => setIsVisible(true)}
                    buttonStyle={styles.button}
                  />
                  {/*//@ts-ignore*/}
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
                          {l.content}
                        </ListItem.Content>
                      </ListItem>
                    ))}
                  </BottomSheet>
                </View>

                {/* Display all the reviews */}
                {/* for {review} in {reviews}: */}
                {reviews &&
                  reviews.map((review, index) => (
                    <View
                      style={{
                        flexDirection: "row",
                        borderTopWidth: 10,
                        borderColor: "white",
                      }}
                      key={`review${index}`}
                    >
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          // justifyContent: "center"
                        }}
                      >
                        <Image
                          source={{ uri: review.reviewerPhoto }}
                          style={{ width: 40, height: 40 }}
                        />
                      </View>
                      <View style={{ flex: 5, flexDirection: "column" }}>
                        <View>
                          <Text> {review.reviewerName} </Text>
                          <Text>
                            {" "}
                            Published on {review.timestamp.split("T")[0]}{" "}
                          </Text>
                          <Text> Rating </Text>
                        </View>
                        <View style={{ alignSelf: "flex-start" }}>
                          <AirbnbRating
                            isDisabled={true}
                            showRating={false}
                            defaultRating={review.reviewRating}
                            size={15}
                          />
                        </View>
                        <View>
                          <Text> {review.reviewText}</Text>
                        </View>
                        <View>
                          {review.reviewImage && review.reviewImage != "" ? (
                            <Image
                              source={{ uri: review.reviewImage }}
                              style={{ width: 80, height: 80 }}
                            />
                          ) : null}
                        </View>
                      </View>
                    </View>
                  ))}
              </ScrollView>
            </TabView.Item>
            <TabView.Item style={{ backgroundColor: "white", width: "100%" }}>
              <ScrollView>
                <View>
                  <Button
                    title="Create Group"
                    onPress={() => setAddGroupListVisible(true)}
                    buttonStyle={styles.button}
                  />
                  {groupTimePickerVis? 
                    <DateTimePicker 
                        mode = "date"  
                        value={groupTime}
                        onChange = {(event: DateTimePickerEvent, date?: Date) => {
                            setGroupTimePickerVis(false);
                            const {
                                type,
                                nativeEvent: {timestamp},
                            } = event;  
                            if(date) setGroupTime(date);         
                        }}
                    />
                    :
                    null}
                  {groupHourPickerVis? 
                    <DateTimePicker 
                        mode = "time"  
                        value={groupTime}
                        onChange = {(event: DateTimePickerEvent, date?: Date) => {
                            setGroupHourPickerVis(false);
                            const {
                                type,
                                nativeEvent: {timestamp},
                            } = event;  
                            if(date) setGroupTime(date);  
                        }}
                    />
                    :
                    null}
                  {/*//@ts-ignore*/}
                  <BottomSheet modalProps={{}} isVisible={addGroupListVisible}>
                    {addGroupList.map((l, i) => (
                      <ListItem
                        key={i}
                        containerStyle={l.containerStyle}
                        onPress={l.onPress}
                      >
                        <ListItem.Content>
                          <ListItem.Title style={l.titleStyle}>
                            {l.title}
                          </ListItem.Title>
                          {l.content}
                        </ListItem.Content>
                      </ListItem>
                    ))}
                  </BottomSheet>
                </View>

                {/* Display all the groups */}
                {/* for {group} in {groups}: */}
                {groups &&
                  groups.map((group, index) => (
                    <View
                      style={{
                        flexDirection: "row",
                        borderTopWidth: 10,
                        borderColor: "white",
                      }}
                      key={`group${index}`}
                    >
                      <View
                        style={{
                          flex: 5,
                        }}
                      >
                        <Text> Group Id: {group.groupID}</Text>
                        <Text>
                          {" "}
                          Meeting on {group.timestamp.split("T")[0]}{" "}
                          {group.timestamp.split("T")[1].split("+")[0]}
                          {""}
                        </Text>
                        <Text>
                          {" "}
                          Participants {group.currentParticipants} /{" "}
                          {group.maxParticipants}
                        </Text>
                      </View>
                      <View style={{ flex: 2, justifyContent: "center" }}>
                        <Button
                          title="Join"
                          onPress={() => {
                            handleJoinGroup(group.groupID);
                          }}
                          buttonStyle={styles.button}
                        />
                      </View>
                    </View>
                  ))}
              </ScrollView>
            </TabView.Item>
          </TabView>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 30,
  },
  head: {
    flex: 1,
    flexDirection: "row",
  },
  button: {
    margin: 10,
    backgroundColor: "#DC2F02",
  },
  head_image: {},
  viewContainer: {
    flex: 1,
  },
  rating: {
    paddingVertical: 10,
  },
  Dropdown: {
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
    height: 40,
    backgroundColor: "transparent",
    borderColor: "#dadae8",
    borderWidth: 1,
    borderRadius: 30,
    padding: 12,
  },
  placeholderStyle: {
    fontSize: 15,
    color: "#dddddd",
  },
  selectedTextStyle: {
    fontSize: 15,
    color: "white",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  ProfilePhotoSectionStyle: {
    flexDirection: "column",
    // height: 40,
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 40,
  },
  buttonStyle: {
    backgroundColor: "#DC2F02",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7ECC30",
    height: 40,
    width: 200,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  photoButtonStyle: {
    backgroundColor: "#DC2F02",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#5798D8",
    height: 40,
    width: 200,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 30,
    // marginLeft: 35,
    // marginRight: 35,
    marginTop: 30,
    marginBottom: -10,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "white",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 18,
  },
  successTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
  infoHeading: {
    fontSize: 24,
    marginStart: 10,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
  infoContent: {
    fontSize: 20,
    marginBottom: 20,
    marginStart: 10,
  },
});
