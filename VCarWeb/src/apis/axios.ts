import { API_BASE_URL } from "./../config/apiConfig";
import axios from "axios";
import axiosRetry from "axios-retry";
import { toast } from "react-toastify";
import { getAccessToken } from "../utils";
const RETRIES = 2;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosRetry(axiosInstance, {
  retries: RETRIES,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.response ? error.response.status >= 500 : false;
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Unauthorized access. Please log in again.");
    } else if (error.response && error.response.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error("An error occurred. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
