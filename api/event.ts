import { privateApi } from './axios';



export const getBanners = async () => {
  try {
    console.log("🚀 API CALL → /event/banner");

    const response = await privateApi.get('/event/banner');

    console.log("✅ STATUS:", response.status);
    console.log("📦 DATA:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("❌ API ERROR:");

    // Axios error handling
    if (error.response) {
      console.log("🔴 STATUS:", error.response.status);
      console.log("🔴 DATA:", error.response.data);
    } else if (error.request) {
      console.log("🟡 NO RESPONSE RECEIVED:", error.request);
    } else {
      console.log("⚠️ ERROR MESSAGE:", error.message);
    }

    throw error;
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