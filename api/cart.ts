import { privateApi } from './axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


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
  const response = await privateApi.get(`/user/cart/items`);
  return response.data;
};

export const deleteCartItem = async (bookingDraftId: number) => {
  const response = await privateApi.delete(
    `user/cart/item/${bookingDraftId}`,
  );
  return response.data;
};

export const addCartItem = async (payload: AddCartItemPayload) => {
  const res = await privateApi.post('user/cart/item', payload);
  return res.data;
};

export const fetchBookingDetailsById = async (
  BookingDraftId: number,
) => {
  const res = await privateApi.get(
    `user/cart/item/${BookingDraftId}`,
  );
  return res.data;
};


export const useCartItems = () => {
  return useQuery({
    queryKey: ['cart-items'],
    queryFn: fetchCartItems,
  });
};

export const useBookingDetails = (bookingDraftId: number) => {
  return useQuery({
    queryKey: ['booking-details', bookingDraftId],
    queryFn: () => fetchBookingDetailsById(bookingDraftId),
    enabled: !!bookingDraftId,
  });
};


export const useAddCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart-items'],
      });
    },
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart-items'],
      });
    },
  });
};