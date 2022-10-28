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
        new Error(serverResponse.message ?? "Error while posting review")
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
