import React, { useState, createRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { ServerResponse } from "../../api/Common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";
import { RootNavParamList } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedInUser, IUserSliceState } from "../redux/userSlice";
// import { RootState as ReduxRootState } from "../redux/store";
import { useHeaderHeight } from "@react-navigation/elements";
import { loginUser } from "../../api/User";

type Props = StackScreenProps<RootNavParamList, "Login">;

const LoginScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");
  const passwordInputRef = createRef<TextInput>();
  const height = useHeaderHeight();
  const dispatch = useDispatch();

  const getLoggedInUser = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      const username = await AsyncStorage.getItem("username");
      const user_photo = await AsyncStorage.getItem("user_photo");
      const ETToken = await AsyncStorage.getItem("ETToken");
      const StreamToken = await AsyncStorage.getItem("StreamToken");
      if (user_id && username && ETToken && StreamToken && user_id != "") {
        const userData: IUserSliceState = {
          user_id: user_id,
          username: username,
          user_photo: user_photo ?? "",
          ETToken: ETToken,
          StreamToken: StreamToken,
        };
        dispatch(setLoggedInUser(userData));
        console.log("Logged in by AsyncStorage:", userData);
        navigation.navigate("TabNavigationRoutes");
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    (async () => {
      await getLoggedInUser();
    })();

    return;
  }, []);

  const handleSubmitPress = async () => {
    setErrortext("");
    if (!username) {
      setErrortext("Please fill in your username");
      return;
    }
    if (!userPassword) {
      setErrortext("Please fill in your password");

      return;
    }
    setLoading(true);

    // console.log(formBody);
    try {
      const response: ServerResponse = await loginUser(username, userPassword);
      //Hide Loader
      setLoading(false);

      // If server responds log in successful
      if (response.status === "success") {
        AsyncStorage.setItem("user_id", response.data.user_id);
        AsyncStorage.setItem("username", response.data.username);
        AsyncStorage.setItem("user_photo", response.data.user_photo);
        AsyncStorage.setItem("ETToken", response.data.ETToken);
        AsyncStorage.setItem("StreamToken", response.data.StreamToken);
        const userData: IUserSliceState = {
          user_id: response.data.user_id,
          username: response.data.username,
          user_photo: response.data.user_photo,
          ETToken: response.data.ETToken,
          StreamToken: response.data.StreamToken,
        };
        dispatch(setLoggedInUser(userData));

        // Clear password input box
        setUserPassword("");
        navigation.navigate("TabNavigationRoutes");
      } else {
        setErrortext(
          response.message != null
            ? response.message
            : "A connection error occured. Please try again later."
        );
      }
    } catch (error) {
      //Hide Loader
      setLoading(false);
      if (error instanceof Error) {
        setErrortext(
          error.message != null
            ? error.message
            : "A connection error occured. Please try again later."
        );
      }
    }
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View>
          <KeyboardAvoidingView
            enabled
            behavior={Platform.select({ android: undefined, ios: "position" })}
            keyboardVerticalOffset={height + 70}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/Eatogether-logos_white.png")}
                style={{
                  width: "70%",
                  height: 300,
                  resizeMode: "contain",
                  // margin: 30,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(username) => setUsername(username)}
                placeholder='Username'
                placeholderTextColor='#8b9cb5'
                autoCapitalize='none'
                keyboardType='default'
                returnKeyType='next'
                onSubmitEditing={() => {
                  passwordInputRef.current && passwordInputRef.current.focus();
                }}
                underlineColorAndroid='#f000'
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(userPassword) => setUserPassword(userPassword)}
                value={userPassword}
                placeholder='Password'
                placeholderTextColor='#8b9cb5'
                keyboardType='default'
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid='#f000'
                returnKeyType='done'
              />
            </View>
            {errortext != "" ? (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}
            >
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              New Here ? Register
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#307ecc",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#7ECC30",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7ECC30",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
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
  registerTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});
