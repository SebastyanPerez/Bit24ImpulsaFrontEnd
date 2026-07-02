import axios from "axios";

let authToken: string | null = null;

/**
 * Sets the active authentication token in memory for the Axios client.
 * This is called by the AuthContext when the user logs in or out.
 */
export const setClientToken = (token: string | null) => {
  authToken = token;
};

const axiosClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject the Authorization header dynamically if the token exists
axiosClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
