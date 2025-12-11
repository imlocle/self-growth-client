import axios from "axios";
import { ENV } from "../config/env";

export const apiClient = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 10000,
});

// // Optional: inject auth token
// ApiClient.interceptors.request.use(async (config) => {
//   // TODO: read from AsyncStorage if you use auth
//   // const token = await AsyncStorage.getItem("accessToken");
//   const token = null;
//   if (token) {
//     config.headers = {
//       ...config.headers,
//       Authorization: `Bearer ${token}`,
//     };
//   }
//   return config;
// });