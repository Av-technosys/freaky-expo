import { privateApi } from './axios';

export interface ReviewMedia {
  mediaUrl: string;
  mediaType: string;
}

export interface ProductReview {
  productId: number;
  rating: number;
  description: string;
  media: ReviewMedia[];
}

export interface ReviewData {
  eventId: number;
  eventRating: number;
  description: string;
  products: ProductReview[];
}

export const getAllReviews = async () => {
  const response = await privateApi.get('/user/get_all_reviews');
  return response.data;
};

export const addReview = async (reviewData: ReviewData) => {
  const response = await privateApi.post('/user/add_review', reviewData);
  return response.data;
};


export const deleteReview = async (reviewId: number) => {
  const response = await privateApi.delete(`/user/review`, {
    data: {
      reviewId: reviewId,
    },
  });

  return response.data;
};