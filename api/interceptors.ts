import { privateApi } from './axios';
import { refreshIdToken } from './refreshToken';
import { forceLogout } from '../api/services/forceLogout';

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

let cachedToken: string | null = null;

export const setGlobalToken = (token: string) => {
  cachedToken = token;
};

const subscribe = (cb: (token: string) => void) => {
  subscribers.push(cb);
};

const notify = (token: string) => {
  subscribers.forEach(cb => cb(token));
  subscribers = [];
};

// REQUEST: attach token
import { tokenStorage } from '../api/services/tokenStorage';


privateApi.interceptors.request.use(async config => {

   if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`;
  }

  console.log("🔑 TOKEN ATTACHED:", !!cachedToken);
  const token = await tokenStorage.getIdToken();
//console.log("token storage", token)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE: refresh on 401
privateApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url.includes('/auth/refresh_token')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise(resolve => {
        subscribe(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(privateApi(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshIdToken();

      notify(newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return privateApi(originalRequest);
    } catch (err) {
      await forceLogout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
