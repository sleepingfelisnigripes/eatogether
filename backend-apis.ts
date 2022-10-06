type LatLng = {
  latitude: number;
  longitude: number;
}

// API endpoint: GET /restaurants/
// Return: a list of all Restaurants (without review)

// API endpoint: GET /restaurants/{restaurantID}
// Return: a Restaurant object
type Restaurant = {
  restaurantID: string;
  restaurantName: string;
  restaurantImage: string;  // URL of the main/facade image of the restaurant
  noOfGroupsToday: number;  // Number of existing groups for today
  cuisineType: string;      // Type of cuisine served
  address: string;          // address of the restaurant
  latlng: LatLng;           // LatLng coordinate of the restaurant
  openingHours: string;     // Opening hours of the restaurant, e.g. 10:00am-9:00pm
  rating: number;           // Average rating of the restaurant (0-5 stars)
  reviews?: Review[];      // store all reviewIDs of a restaurant
}

// API endpoint: GET /reviews/{reviewID}
// Return: a Review
type Review = {
  reviewID: string;
  timestamp: string;        // String type in ISO 8601 format, e.g. "2022-09-26T13:25:40+10:00"
  reviewerID: string;       // The user ID of the reviewer
  reviewerName: string;     // The name of the reviewer
  reviewRating: number;     // The rating given by the review user
  reviewText: string;       // Text content of the review
  reviewImages: string[],   // Urls of review reviewImages
}

// API endpoint: GET /groups/{groupID}
// Return: a Group
type Group = {
  groupID: string;
  restaurantID: string;         // The restaurant that the group is going
  initUserID: string;           // User ID of the user who initiated the group
  timestamp: string;            // Timestamp of the meeting. String type in ISO 8601 format, e.g. "2022-09-26T13:25:40+10:00"
  maxParticipants: number;      // Number of maximum participants
  currentParticipants: number;  // Current number of participants joined
  participants: User[];         // List of participants
}

// API endpoint: /restaurant-groups/{restaurantID}
// Return: a list of FUTURE Groups for a restaurant (expired groups will not appear)
type RestaurantGroup = {
  restaurantID: string;
  upcomingGroups: Group[];
}

// API endpoint: /user-group/{userID}
// Return: a list of FUTURE Groups that a user has joined (expired groups will not appear)
type UserGroup = {
  userID: string,
  upcomingGroups: Group[];
}

enum Gender {
  male = "M",
  female = 'F',
  notDisclosed = 'ND'
}

// API endpoint: /users/{userID}
// Return: user's information
type User = {
  userID?: string;
  userName: string;
  favouriteRestaurants?: Restaurant[];
  gender: Gender;
  userPhoto: string;        // URL to the user's photo
}

// TODO: API endpoint: POST /login/           => Log in and get a JWT token
// TODO: API endpoint: POST /register/        => Register and create new user
// TODO: API endpoint: PATCH /users/{userID}  => Update user's name, user's photo and gender
// TODO: API endpoint: DELETE /user-group     => Remove a user from a group (i.e. leave a group)