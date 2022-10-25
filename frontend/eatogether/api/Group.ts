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
  restaurantName: string;
  restaurantImage: string;
};