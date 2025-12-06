import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api"; // backend base URL
const API_BASE_URL = "portfolio-tracker-spring-production.up.railway.app/api"; // backend base URL

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if needed in future
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error("Axios Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

const AxiosService = {
  get: async (url, params = {}) => {
    try {
      const res = await axiosInstance.get(url, { params });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (url, data = {}, params = {}) => {
    try {
      const res = await axiosInstance.post(url, data, { params });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  put: async (url, data = {}, params = {}) => {
    try {
      const res = await axiosInstance.put(url, data, { params });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  patch: async (url, data = {}, params = {}) => {
    try {
      const res = await axiosInstance.patch(url, data, { params });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (url, params = {}) => {
    try {
      const res = await axiosInstance.delete(url, { params });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

export default AxiosService;