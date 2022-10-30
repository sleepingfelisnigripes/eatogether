import { LatLng } from "./Latlng";
import { API_URL, ServerResponse } from "./Common";
import { Review } from "./Review";
import { Group } from "./Group";
import { RootState as ReduxRootState } from "../src/redux/store";
import { useSelector } from "react-redux";

export type Restaurant = {
  restaurantID: string;
  restaurantName: string;
  restaurantImage: string; // URL of the main/facade image of the restaurant
  noOfGroupsToday: number; // Number of existing groups for today
  cuisineType: string; // Type of cuisine served
  address: string; // address of the restaurant
  latlng: LatLng; // LatLng coordinate of the restaurant
  openingHours: string; // Opening hours of the restaurant, e.g. 10:00am-9:00pm
  rating: number; // Average rating of the restaurant (0-5 stars)
  reviews?: Review[]; // store all reviewIDs of a restaurant
  upcomingGroups?: Group[]; // upcoming Groups in this restaurant
};

/**
 * Get all Restaurant objects
 * @return an array of Restaurant objects
 **/
export async function getAllRestaurants(): Promise<Restaurant[]> {
  try {
    const response: Response = await fetch(`${API_URL}/restaurants`);
    const serverResponse: ServerResponse = await response.json();

    if (response.ok) {
      if (serverResponse.data) {
        return serverResponse.data as Restaurant[];
      } else {
        return Promise.reject(
          new Error(
            serverResponse.message ?? "Error while fetching restaurants"
          )
        );
      }
    } else {
      return Promise.reject(new Error("Error when fetching restaurants"));
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
 * Get Restaurant object by restaurantID
 * @param restaurantID
 * @return a Restaurant object
 **/
export async function getRestaurantInfo(
  restaurantID: string
): Promise<Restaurant> {
  try {
    const response: Response = await fetch(
      `${API_URL}/restaurants/${restaurantID}`
    );
    const serverResponse: ServerResponse = await response.json();

    if (response.ok) {
      if (serverResponse.data) {
        return serverResponse.data as Restaurant;
      } else {
        console.log(serverResponse.message);
        return Promise.reject(
          new Error(serverResponse.message ?? "Error while fetching restaurant")
        );
      }
    } else {
      return Promise.reject(
        new Error(serverResponse.message ?? "Error when fetching restaurants")
      );
<<<<<<< HEAD
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
 * Get Restaurant object by restaurantID
 * @param ETToken The ET jwt token
 * @param restaurantID The restaurant to set favourite status
 * @param active Set favourite on or off
 * @return a ServerResponse
 **/
export async function setFavouriteRestaurant(
  ETToken: string,
  restaurantID: string,
  active: boolean
): Promise<ServerResponse> {
  try {
    const body: string = JSON.stringify({
      restaurant_id: restaurantID,
      active: active,
    });
    console.log(body);
    const response: Response = await fetch(`${API_URL}/restaurant/favourite`, {
      method: "POST",
      headers: {
        authourization: `Bearer ${ETToken}`,
        "Content-type": "Application/json",
      },
      body: body,
    });
    const serverResponse: ServerResponse = await response.json();

    if (response.ok) {
      return serverResponse;
    } else {
      console.log(serverResponse.message);
      return Promise.reject(
        new Error(
          serverResponse.message ?? "Error while updating favourite restaurant"
        )
      );
=======
>>>>>>> c16027e (perf: formating code)
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
