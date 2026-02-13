/**
 * Environment Configuration
 *
 * Centralized configuration for environment-specific values.
 * Update these values based on your deployment environment.
 *
 * @remarks
 * In production, consider using environment variables or a config service
 * instead of hardcoded values.
 *
 * @example
 * ```typescript
 * // Development
 * API_BASE_URL: "https://api-dev.self-growth.com"
 *
 * // Production
 * API_BASE_URL: "https://api.self-growth.com"
 * ```
 */
export const ENV = {
  /**
   * Base URL for the backend API.
   * All API requests will be made to this URL.
   *
   * @remarks
   * - Must include protocol (https://)
   * - Should NOT include trailing slash
   * - Should NOT include /api or version prefix (handled by endpoints)
   */
  API_BASE_URL: "https://wlydtiiend.execute-api.us-west-1.amazonaws.com/dev",
};
