import * as SecureStore from "expo-secure-store";

/**
 * Token Storage Keys
 *
 * Secure storage keys for JWT tokens.
 * All keys are prefixed with 'sg_' (Self-Growth) to avoid conflicts.
 */
const ACCESS_TOKEN_KEY = "sg_access_token";
const REFRESH_TOKEN_KEY = "sg_refresh_token";
const ID_TOKEN_KEY = "sg_id_token";

/**
 * Token Storage Module
 *
 * Handles secure storage and retrieval of JWT authentication tokens.
 * Uses Expo SecureStore for encrypted storage on device.
 *
 * Security:
 * - Tokens are encrypted at rest
 * - iOS: Stored in Keychain
 * - Android: Stored in EncryptedSharedPreferences
 *
 * @module tokenStorage
 */

/**
 * Saves authentication tokens to secure storage.
 *
 * @param tokens - Object containing authentication tokens
 * @param tokens.accessToken - JWT access token (required)
 * @param tokens.refreshToken - JWT refresh token (optional)
 * @param tokens.idToken - JWT ID token (optional)
 * @returns Promise that resolves when tokens are saved
 *
 * @example
 * ```typescript
 * await saveTokens({
 *   accessToken: 'eyJhbGciOiJSUzI1NiIs...',
 *   refreshToken: 'eyJjdHkiOiJKV1QiLCJlbmMi...',
 *   idToken: 'eyJhbGciOiJSUzI1NiIs...'
 * });
 * ```
 *
 * @remarks
 * - Access token is always required
 * - Refresh and ID tokens are optional
 * - Existing tokens are overwritten
 */
export async function saveTokens(tokens: {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
}): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
  if (tokens.idToken) {
    await SecureStore.setItemAsync(ID_TOKEN_KEY, tokens.idToken);
  }
}

/**
 * Retrieves the access token from secure storage.
 *
 * @returns Promise resolving to the access token, or null if not found
 *
 * @example
 * ```typescript
 * const token = await getAccessToken();
 * if (token) {
 *   // User is authenticated
 *   console.log('Token:', token);
 * } else {
 *   // User is not authenticated
 *   console.log('No token found');
 * }
 * ```
 *
 * @remarks
 * Used by API client interceptor to attach token to requests.
 */
export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

/**
 * Retrieves the refresh token from secure storage.
 *
 * @returns Promise resolving to the refresh token, or null if not found
 *
 * @example
 * ```typescript
 * const refreshToken = await getRefreshToken();
 * if (refreshToken) {
 *   // Can refresh access token
 *   const newTokens = await refreshAccessToken(refreshToken);
 * }
 * ```
 *
 * @remarks
 * Used for token refresh flow (not yet implemented).
 */
export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

/**
 * Clears all authentication tokens from secure storage.
 * This effectively logs the user out.
 *
 * @returns Promise that resolves when all tokens are cleared
 *
 * @example
 * ```typescript
 * await clearTokens();
 * // User is now logged out
 * navigation.navigate('Login');
 * ```
 *
 * @remarks
 * Called during logout to remove all authentication data.
 * Also clears scope data from AppScopeContext.
 */
export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
}
