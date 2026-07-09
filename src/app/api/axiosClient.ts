import axios from "axios";

const TOKEN_KEY = "bit24_token";

let authToken: string | null = null;

/**
 * Sets the active authentication token in memory for the Axios client.
 * This is called by the AuthContext when the user logs in or out.
 */
export const setClientToken = (token: string | null) => {
  authToken = token;
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY) ?? authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
