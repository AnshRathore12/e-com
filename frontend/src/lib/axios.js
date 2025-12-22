// import axios from "axios";

// const axiosInstance=axios.create({
//   baseURL:import.meta.env.MODE==="development"?"http://localhost:5000/api":"/api",
//   withCredentials:true,  //allow us to send cookies to the server with each request
// })

// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await axios.post("/api/auth/refresh-token", {}, { withCredentials: true });
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, user needs to login again
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;