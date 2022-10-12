import { API_URL } from "./Common";

export type Review = {
  reviewID: string;
  timestamp: string;        // String type in ISO 8601 format, e.g. "2022-09-26T13:25:40+10:00"
  restaurantID: string;     // The restaurant ID of the place being reviewed
  reviewerID: string;       // The user ID of the reviewer
  reviewerName: string;     // The name of the reviewer
  reviewerPhoto: string;    // Url of the reviewer profile photo
  reviewRating: number;     // The rating given by the review user
  reviewText: string;       // Text content of the review
  reviewImages: string[],   // Urls of review reviewImages
}

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