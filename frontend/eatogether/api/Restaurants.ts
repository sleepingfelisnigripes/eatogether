import { Review } from "./Review";
import { LatLng } from "./Latlng";
import { API_URL } from "./Common";

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
};

/** 
 * Get all Restaurant objects
 * @return an array of Restaurant objects
 **/
export async function getAllRestaurant(): Promise<Restaurant[]> {
  try {
    const response: Response = await fetch(`${API_URL}/restaurants`);
    const restaurants: Restaurant[] = await response.json();

    if (response.ok) {
      if (restaurants) {
        return restaurants;
      } else {
        return Promise.reject(new Error("Cannot fetch any restaurants."));
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
 * @return an array of Restaurant
 **/
export async function getRestaurant(restaurantID: string): Promise<Restaurant> {
    try{
        const response: Response = await fetch(`${API_URL}/restaurants/${restaurantID}`);
        const restaurant:Restaurant = await response.json();

        if (response.ok){
            if (restaurant){
                return restaurant;
            } else {
                return Promise.reject(new Error('Cannot fetch any restaurants.'));
            }
        } else {
            return Promise.reject(new Error('Error when fetching restaurants'));
        }
    }
    catch (error){
        // Handle the error
            return Promise.reject(error instanceof Error ? (error.message ?? 'Unknown Error'): 'Unknown Error');
    }
    
}