import React, { useState, createRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";
import {
  manipulateAsync,
  SaveFormat,
  ImageResult,
} from "expo-image-manipulator";
import mime from "mime";

import Loader from "../components/Loader";
import { RootNavParamList } from "../../App";
import { ServerResponse } from "../../api/Common";
import { registerUser } from "../../api/User";

type Props = StackScreenProps<RootNavParamList, "RegisterScreen">;

const RegisterScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);
  const [photo, setPhoto] = useState<ImageResult | null>(null);
  const [genderValue, setGenderValue] = useState("");
  const genderItems = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Non Binary", value: "NB" },
    { label: "Prefer not to say", value: "ND" },
  ];

  // const usernameInputRef = createRef<TextInput>();
  const passwordInputRef = createRef<TextInput>();

  const handleChoosePhoto = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // console.log("Photo", result);

    if (!result.cancelled) {
      const manipResult = await manipulateAsync(
        result.uri,
        [{ resize: { width: 150 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );
      setPhoto(manipResult);
    }
  };

  const handleSubmitButton = async () => {
    setErrorText("");
    if (!username) {
      setErrorText("Please fill in Username");
      return;
    }
    if (!userPassword) {
      setErrorText("Please fill in Password");
      return;
    }

    if (!genderValue) {
      setErrorText("Please select a gender");
      return;
    }

    //Show Loader
    setLoading(true);

    try {
      const response: ServerResponse = await registerUser(
        username,
        userPassword,
        genderValue,
        photo
      );
      if (response.status === "success") {
        //Hide Loader
        setLoading(false);
        setIsRegistraionSuccess(true);
        console.log("Registration Successful. Please Login to proceed");
      } else {
        //Hide Loader
        setLoading(false);
        setErrorText(response.message ?? "Unknown error occurred");
      }
    } catch (error) {
      //Hide Loader
      setLoading(false);
      if (error instanceof Error) {
        setErrorText(error.message ?? "Unknown error occurred");
      }
    }
  };
  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#307ecc",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../../assets/success.png")}
          style={{
            height: 150,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />
        <Text style={styles.successTextStyle}>Registration Successful</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#307ecc" }}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="never"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/register.png")}
            style={{
              width: "50%",
              height: 100,
              resizeMode: "contain",
              margin: 30,
            }}
          />
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserName) => setUsername(UserName)}
              underlineColorAndroid="#f000"
              placeholder="Username"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) => setUserPassword(UserPassword)}
              underlineColorAndroid="#f000"
              placeholder="Password"
              placeholderTextColor="#8b9cb5"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>

          <Dropdown
            style={styles.Dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={genderItems}
            search={false}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Gender"
            value={genderValue}
            onChange={(item) => {
              setGenderValue(item.value);
            }}
          />

          <View style={styles.ProfilePhotoSectionStyle}>
            <Text style={{ color: "white", marginBottom: 10, fontSize: 18 }}>
              Profile Photo (Optional)
            </Text>
            {photo && (
              <>
                <Image
                  source={{ uri: photo.uri }}
                  style={{ width: 150, height: 150, alignSelf: "center" }}
                />
              </>
            )}
            <TouchableOpacity
              style={styles.photoButtonStyle}
              activeOpacity={0.5}
              onPress={handleChoosePhoto}
            >
              <Text style={styles.buttonTextStyle}>Choose Photo</Text>
            </TouchableOpacity>
          </View>
          {errorText != "" ? (
            <Text style={styles.errorTextStyle}>{errorText}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}
          >
            <Text style={styles.buttonTextStyle}>REGISTER</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
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
    color: "#8b9cb5",
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
    marginBottom: 20,
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
    marginBottom: 20,
  },
  photoButtonStyle: {
    backgroundColor: "#5798D8",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#5798D8",
    height: 40,
    width: 150,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 30,
    // marginLeft: 35,
    // marginRight: 35,
    marginTop: 20,
    // marginBottom: 20,
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
});
