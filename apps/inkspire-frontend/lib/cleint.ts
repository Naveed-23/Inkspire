// lib/api/client.ts
import axios from "axios";
import { HTTP_BACKEND } from "@/config";

export const apiClient = axios.create({
  baseURL: HTTP_BACKEND,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Authentication required");
    }
    return Promise.reject(error);
  }
);