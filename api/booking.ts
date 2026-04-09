import { privateApi } from './axios';


export const createBooking = async (payload: any) => {
  const response = await privateApi.post(
    '/booking/booking',
    payload
  );
  return response.data;
};


export const addItemToBooking = async (payload: any) => {
  const response = await privateApi.post(
    '/booking/bookingItem',
    payload
  );
  return response.data;
};

export const fetchBookings = async () => {
  const response = await privateApi.get(
    '/booking/'
  );
  return response.data;
};

export const fetchBookingbyId = async (id: string) => {
  const response = await privateApi.get(
    `/booking/${id}`
  );
  return response.data;
};
