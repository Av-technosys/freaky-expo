import { privateApi } from './axios';
import { refreshIdToken } from './refreshToken';
import { forceLogout } from '../api/services/forceLogout';

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

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
  const token = await tokenStorage.getIdToken();

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
