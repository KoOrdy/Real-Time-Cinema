import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3003/api',  // This should be the URL where your backend API is running
  timeout: 10000, // Timeout is set to 10 seconds (10000 ms)
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem("token"); // Retrieve the token
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

export default axiosInstance;
