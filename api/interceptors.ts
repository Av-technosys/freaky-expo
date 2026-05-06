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

import { tokenStorage } from './services/tokenStorage';

privateApi.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


privateApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const message =
      error?.response?.data?.message ||
      error?.message ||
      '';

    const isTokenError =
      error.response?.status === 401 ||
      message.includes('Token is required') ||
      message.includes('Token verification failed');

    const isRefreshMissing =
      message.includes('Missing refresh credentials') ||
      message.includes('refreshToken null');

    if (isRefreshMissing) {
      await forceLogout();
      return Promise.reject(error);
    }

    if (
      !isTokenError ||
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

      if (!newToken) {
        await forceLogout();
        return Promise.reject(error);
      }

      notify(newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return privateApi(originalRequest);
    } catch (err) {
      await forceLogout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
