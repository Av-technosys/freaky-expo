import { privateApi } from "./axios";


export type AddCartItemPayload = {
  productId: number;
  quantity: number;
  name: string;
  contactNumber: string;
  date: string; // ISO string
  minGuestCount: number;
  maxGuestCount: number;
  latitude: number;
  longitude: number;
};


export const fetchCartItems = async () => {
  const response = await privateApi.get(
    `/user/cart/items`,
  );
  return response.data; 
};

export const deleteCartItem = async (bookingDraftId : number) => {
  const response = await privateApi.delete(
    `user/cart/item/${bookingDraftId}`,
  );
  return response.data; 
};

export const addCartItem = async (payload: AddCartItemPayload) => {
  const res = await privateApi.post('user/cart/item', payload);
  return res.data;
};
