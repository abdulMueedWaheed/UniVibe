import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Add this interceptor to ensure the proper handling of FormData
makeRequest.interceptors.request.use(function (config) {
  // Don't set the Content-Type header if we're sending FormData
  // The browser will automatically set the correct header with boundary
  if (config.data instanceof FormData) {
    config.headers = {
      ...config.headers,
      'Content-Type': undefined,
    };
  }
  return config;
});