import axios from "axios";
import { ENV } from "@core/config/env";
import { getAccessToken } from "@auth/tokenStorage";

/**
 * Axios API Client
 *
 * Centralized HTTP client for all API requests.
 * Automatically attaches JWT authentication tokens to requests.
 *
 * Configuration:
 * - Base URL from environment config
 * - 10 second timeout
 * - Automatic token injection via interceptor
 *
 * @example
 * ```typescript
 * // GET request
 * const { data } = await apiClient.get('/user-profile');
 *
 * // POST request
 * const { data } = await apiClient.post('/todos', { title: 'New todo' });
 *
 * // PUT request
 * const { data } = await apiClient.put('/todos/123', { title: 'Updated' });
 *
 * // DELETE request
 * await apiClient.delete('/todos/123');
 * ```
 */
export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
});

/**
 * Request Interceptor
 *
 * Automatically attaches the JWT access token to all outgoing requests.
 * The token is retrieved from secure storage and added to the Authorization header.
 *
 * Flow:
 * 1. Request is initiated
 * 2. Interceptor retrieves token from SecureStore
 * 3. Token is added to Authorization header
 * 4. Request proceeds to backend
 *
 * @remarks
 * If no token is found, the request proceeds without authentication.
 * This allows unauthenticated endpoints (signup, login) to work.
 */
apiClient.interceptors.request.use(async (config: any) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});