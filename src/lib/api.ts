import axios, { AxiosError, AxiosInstance } from "axios";

import { env } from "../env/env";

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: () => void) => () => void;
};

export const api = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
}) as APIInstanceProps;

api.registerInterceptTokenManager = (signOut) => {
  // Delay for 2 seconds
  const requestInterceptorId = api.interceptors.request.use(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return config;
  });

  const responseInterceptorId = api.interceptors.response.use(
    (config) => config,
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        signOut();
      }

      return Promise.reject(error);
    }
  );

  // Return a function to eject the interceptor
  return () => {
    api.interceptors.request.eject(requestInterceptorId);
    api.interceptors.response.eject(responseInterceptorId);
  };
};
