import { ImageResult } from "expo-image-manipulator";
import mime from "mime";
import { API_URL, ServerResponse } from "./Common";

export type Review = {
  reviewID: string;
  timestamp: string; // String type in ISO 8601 format, e.g. "2022-09-26T13:25:40+10:00"
  restaurantID: string; // The restaurant ID of the place being reviewed
  reviewerID: string; // The user ID of the reviewer
  reviewerName: string; // The name of the reviewer
  reviewerPhoto: string; // Url of the reviewer profile photo
  reviewRating: number; // The rating given by the review user
  reviewText: string; // Text content of the review
<<<<<<< HEAD
  reviewImage: string; // Urls of review reviewImages
};

/**
 * Post a new review
 * @param ETToken
 * @param restaurantID
 * @param reviewRating
 * @param reviewText
 * @param reviewImage
 * @return a ServerResponse
 **/
export async function postReview(
  ETToken: string,
  restaurantID: string,
  reviewRating: number,
  reviewText: string,
  reviewImage: ImageResult | null = null
): Promise<ServerResponse> {
  const createFormData = () => {
    const data = new FormData();

    data.append("restaurant_id", restaurantID);
    data.append("review_rating", reviewRating.toString());
    data.append("review_text", reviewText);
    if (reviewImage != null) {
      data.append("review_image", {
        // @ts-ignore
        name: reviewImage.uri.split("/").pop(),
        type: mime.getType(reviewImage.uri)!,
        uri: reviewImage.uri,
      });
    }
    return data;
  };

  try {
    const formBody = createFormData();

    const response = await fetch(`${API_URL}/restaurant/review`, {
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
=======
  reviewImages: string[]; // Urls of review reviewImages
};
>>>>>>> c16027e (perf: formating code)

// /**
//  * Get Review object by reviewID
//  * @param reviewID
//  * @return a Review object
//  **/
//  export async function getReview(reviewID: string): Promise<Review> {
//   try{
//       const response: Response = await fetch(`${API_URL}/reviews/${reviewID}`);
//       const review:Review = await response.json();

//       if (response.ok){
//           if (review){
//               return review;
//           } else {
//               return Promise.reject(new Error('Cannot fetch any review.'));
//           }
//       } else {
//           return Promise.reject(new Error('Error when fetching review'));
//       }
//   }
//   catch (error){
//       // Handle the error
//           return Promise.reject(error instanceof Error ? (error.message ?? 'Unknown Error'): 'Unknown Error');
//   }

// }
