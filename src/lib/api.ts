import axios from "axios";
import { env } from "../env/env";

export const api = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
});

// Delay for 2 seconds
api.interceptors.request.use(
  async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
