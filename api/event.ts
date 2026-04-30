import { privateApi } from './axios';



export const getBanners = async () => {
  try {

    const response = await privateApi.get('/event/banner');


    return response.data;
  } catch (error: any) {
    console.log("❌ API ERROR:" ,error?.response?.data || error.message || error);
  }
};


export const getEventTypes = async () => {
  const response = await privateApi.get('/event/event_type');
  return response.data;
};

export const getEvents = async () => {
  const response = await privateApi.get('/event');
  return response.data;
};

export const getFeaturedEvents = async () => {
  const response = await privateApi.get('/event/featured');
  return response.data;
};

export const createEvent = async (eventData: any) => {
  const response = await privateApi.post('/event/create', eventData);
  return response.data;
};

export const fetchEventType = async () => {
  const response = await privateApi.get('/event/event_type');
  return response.data;
};


export const saveInBookingDraft = async (payload: {
  eventId: any;
  productId: any;
  quantity: any;
  startTime : any;
  endTime : any;
  slabIndex: any;
  price: any;
}) => {
  const response = await privateApi.post('/event/create_eventitem', payload);
  return response.data;
};

export const deleteEventItem = async (eventItemId: number) => {
  const response = await privateApi.delete(
    `/event/delete_eventitem/${eventItemId}`
  );
  return response.data;
};


export const getEventById = async (eventId: number) => {
  const response = await privateApi.get(`/event/${eventId}`);
  return response.data;
};