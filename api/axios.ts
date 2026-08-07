
import axios from 'axios';

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL?.replace(/\/$/, '');

if (!backendUrl) {
  console.warn('EXPO_PUBLIC_BACKEND_URL is not configured. API requests cannot be made.');
}

const BASE_URL = backendUrl ? `${backendUrl}/v1` : '';

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
