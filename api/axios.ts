
import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || ""

export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

publicApi.interceptors.request.use(config => {
  delete config.headers.Authorization;
  delete config.headers.authorization;
  return config;
});

export const privateApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});
