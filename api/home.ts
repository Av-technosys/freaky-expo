import { privateApi } from './axios';

export const getHomeFeaturedProducts = async () => {
  const response = await privateApi.get('/product/featuredProducts');
  return response.data;
};

export const getHomeBanners = async () => {
  const response = await privateApi.get('/event/banner');
  return response.data;
};

export const getHomeEventTypes = async () => {
  const response = await privateApi.get('/event/event_type');
  return response.data;
};

export const getHomeFeaturedExperiences = async () => {
  const response = await privateApi.get('/event/featured');
  return response.data;
};

export const getHomeProductTypes = async () => {
  const response = await privateApi.get('/product/products_type');
  return response.data;
};
