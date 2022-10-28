import { API_URL, ServerResponse } from "./Common";
import { User } from "./User";

export type Group = {
  groupID: string;
  restaurantID: string; // The restaurant that the group is going
  restaurantName?: string; // The restaurnat name
  restaurantImage?: string; // The restaurant facade image
  initUserID: string; // User ID of the user who initiated the group
  timestamp: string; // Timestamp of the meeting. String type in ISO 8601 format, e.g. "2022-09-26T13:25:40+10:00"
  maxParticipants: number; // Number of maximum participants
  currentParticipants: number; // Current number of participants joined
  participants: User[]; // List of participants
};

/**
 * Create a group and put the user in the group
 * @param ETToken
 * @param restaurantID
 * @param groupMeetingTimestamp
 * @param maxParticipants Default=6
 * @return a ServerResponse
 **/
export async function createGroup(
  ETToken: string,
  restaurantID: string,
  groupMeetingTimestamp: string,
  maxParticipants: number = 6
): Promise<ServerResponse> {
  try {
    const dataToSend = {
      restaurant_id: restaurantID,
      group_meeting_timestamp: groupMeetingTimestamp,
      group_maximum: maxParticipants,
    };

    const response = await fetch(`${API_URL}/group/create`, {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        //Header Defination
        "Content-Type": "application/json",
        Authorization: `Bearer ${ETToken}`,
      },
    });
    const serverResponse: ServerResponse = await response.json();
    if (response.ok) {
      return serverResponse;
    } else {
      return Promise.reject(
        new Error(serverResponse.message ?? "Error while creating group")
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
 * To join or leave a group
 * @param ETToken
 * @param groupID
 * @param active True = Join the group, False = Leave the group
 * @return a ServerResponse
 **/
async function updateGroupMembership(
  ETToken: string,
  groupID: string,
  active: boolean
): Promise<ServerResponse> {
  try {
    const dataToSend = {
      group_id: groupID,
      active: active,
    };

    const response = await fetch(`${API_URL}/group/join`, {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        //Header Defination
        "Content-Type": "application/json",
        Authorization: `Bearer ${ETToken}`,
      },
    });
    const serverResponse: ServerResponse = await response.json();
    if (response.ok) {
      return serverResponse;
    } else {
      return Promise.reject(
        new Error(serverResponse.message ?? "Error while joining/leaving group")
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
 * To join  a group
 * @param ETToken
 * @param groupID
 * @return a ServerResponse
 **/
export async function joinGroup(
  ETToken: string,
  groupID: string
): Promise<ServerResponse> {
  try {
    const response = await updateGroupMembership(ETToken, groupID, true);
    return response;
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
 * To leave  a group
 * @param ETToken
 * @param groupID
 * @return a ServerResponse
 **/
export async function leaveGroup(
  ETToken: string,
  groupID: string
): Promise<ServerResponse> {
  try {
    const response = await updateGroupMembership(ETToken, groupID, false);
    return response;
  } catch (error) {
    // Handle the error
    return Promise.reject(
      error instanceof Error
        ? error.message ?? "Unknown Error"
        : "Unknown Error"
    );
  }
}
