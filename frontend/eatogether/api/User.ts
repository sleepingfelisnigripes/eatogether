<<<<<<< HEAD
import { ImageResult } from "expo-image-manipulator";
import mime from "mime";
=======
>>>>>>> c16027e (perf: formating code)
import { API_URL, ServerResponse } from "./Common";
import { Group } from "./Group";
import { Restaurant } from "./Restaurant";

export type UserGroup = {
  userID: string;
  upcomingGroups: Group[];
};

export enum Gender {
  male = "M",
  female = "F",
  notDisclosed = "ND",
}

export type User = {
  userID?: string;
  userName: string;
  favouriteRestaurants?: Restaurant[];
  gender: Gender;
  userPhoto: string; // URL to the user's photo
  upcomingGroups?: Group[];
};

/**
 * Get User object by userID
 * @param userID
 * @return a User object
 **/
export async function getUserInfo(userID: string): Promise<User> {
  try {
    const response: Response = await fetch(`${API_URL}/users/${userID}`);
    const serverResponse: ServerResponse = await response.json();

    if (response.ok) {
      if (serverResponse.data) {
        return serverResponse.data as User;
      } else {
        return Promise.reject(
          new Error(serverResponse.message ?? "Error while fetching user")
        );
      }
    } else {
      return Promise.reject(
        new Error(serverResponse.message ?? "Error when fetching user")
      );
    }
  } catch (error) {
    // Handle the error
    return Promise.reject(
      error instanceof Error
        ? error.message ?? "Unknown Error"
        : "Unknown Error"
    );
  }
}
<<<<<<< HEAD

/**
 * Register user
 * @param username
 * @param userPassword
 * @param genderValue
 * @param [photo = null]
 * @return a User object
 **/
export async function registerUser(
  username: string,
  userPassword: string,
  genderValue: string,
  photo: ImageResult | null = null
): Promise<ServerResponse> {
  const createFormData = () => {
    const data = new FormData();

    data.append("username", username);
    data.append("password", userPassword);
    data.append("gender", genderValue);
    if (photo != null) {
      data.append("user_photo", {
        // @ts-ignore
        name: photo.uri.split("/").pop(),
        type: mime.getType(photo.uri)!,
        uri: photo.uri,
      });
    }
    return data;
  };
  try {
    const formBody = createFormData();

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      body: formBody,
      headers: {
        //Header Defination
        "Content-Type": "multipart/form-data",
      },
    });
    const serverResponse: ServerResponse = await response.json();
    if (response.ok) {
      return serverResponse;
    } else {
      return Promise.reject(
        new Error(serverResponse.message ?? "Error while registering user")
      );
    }
  } catch (error) {
    // Handle the error
    return Promise.reject(
      error instanceof Error
        ? error.message ?? "Unknown Error"
        : "Unknown Error"
    );
  }
}

/**
 * Log in user
 * @param username
 * @param userPassword
 * @return a ServerResponse
 **/
export async function loginUser(
  username: string,
  userPassword: string
): Promise<ServerResponse> {
  let dataToSend = { username: username, password: userPassword };
  let formBody = JSON.stringify(dataToSend);
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      body: formBody,
      headers: {
        //Header Defination
        "Content-Type": "application/json",
      },
    });
    const serverResponse: ServerResponse = await response.json();
    if (response.ok) {
      return serverResponse;
    } else {
      return Promise.reject(
        new Error(serverResponse.message ?? "Error while logging in user")
      );
    }
  } catch (error) {
    // Handle the error
    return Promise.reject(
      error instanceof Error
        ? error.message ?? "Unknown Error"
        : "Unknown Error"
    );
  }
}
=======
>>>>>>> c16027e (perf: formating code)
