

import { API_URL } from "./Common";
import { Group } from "./Group";
import { Restaurant } from "./Restaurant";

export type UserGroup = {
    userID: string,
    upcomingGroups: Group[];
  }
  
export enum Gender {
    male = "M",
    female = 'F',
    notDisclosed = 'ND'
}

export type User = {
    userID?: string;
    userName: string;
    favouriteRestaurants?: Restaurant[];
    gender: Gender;
    userPhoto: string;        // URL to the user's photo
    upcomingGroups?: Group[];
}

/** 
 * Get User object by userID
 * @param userID
 * @return a User object
 **/
 export async function getUserInfo(userID: string): Promise<User> {
    try{
        const response: Response = await fetch(`${API_URL}/users/${userID}`);
        const user:User = await response.json();
  
        if (response.ok){
            if (user){
                return user;
            } else {
                return Promise.reject(new Error('Cannot fetch any user.'));
            }
        } else {
            return Promise.reject(new Error('Error when fetching user'));
        }
    }
    catch (error){
        // Handle the error
            return Promise.reject(error instanceof Error ? (error.message ?? 'Unknown Error'): 'Unknown Error');
    }
    
  }