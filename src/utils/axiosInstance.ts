import axios from "axios";
import { BASE_URL } from "@utils/apiPaths";

const axiosInstance = axios.create({
  baseURL:BASE_URL,
  timeout:10000,
  headers:{
    "Content-Type":"application/json",
    Accept:"application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if(accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    const deskId = sessionStorage.getItem("desk");
    if(deskId) config.headers.desk = deskId;
    return config;
  },
  (error) => { return Promise.reject(error) },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => { return response; },
  (error) => {
    if(error.response) {
      // Redirect to login page
      if(error.response.status === 401) window.location.href = "/auth/login";
      // Server error
      if(error.response.status === 500) console.error("Server error. Please try again later.");
      // Timeout error
    } else if(error.code === "ECONNABORTED") console.error("Request timeout. Please try again.");
    return Promise.reject(error);
  },
);

export default axiosInstance;