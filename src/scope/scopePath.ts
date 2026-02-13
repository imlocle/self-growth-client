/**
 * Scope Path Utilities
 *
 * Helper functions for building scoped API paths.
 * All data operations in the app require explicit scope (household + subject)
 * to ensure proper data isolation and access control.
 *
 * @module scopePath
 */

/**
 * Builds the base scope prefix for API paths.
 * This prefix is used for all scoped resource endpoints.
 *
 * @param householdId - The unique identifier of the household
 * @param subjectId - The unique identifier of the subject
 * @returns The scoped path prefix with URL-encoded IDs
 *
 * @example
 * ```typescript
 * const prefix = buildScopePrefix('hh-123', 'sub-456');
 * console.log(prefix); // "/households/hh-123/subjects/sub-456"
 * ```
 *
 * @example
 * ```typescript
 * // Handles special characters safely
 * const prefix = buildScopePrefix('hh 123', 'sub/456');
 * console.log(prefix); // "/households/hh%20123/subjects/sub%2F456"
 * ```
 */
export function buildScopePrefix(householdId: string, subjectId: string): string {
  return `/households/${encodeURIComponent(householdId)}/subjects/${encodeURIComponent(subjectId)}`;
}

/**
 * Builds a complete scoped API path by combining the scope prefix with a relative path.
 * This is the primary function used by repositories to construct API endpoints.
 *
 * @param householdId - The unique identifier of the household
 * @param subjectId - The unique identifier of the subject
 * @param relativePath - The resource path (with or without leading slash)
 * @returns The complete scoped API path
 *
 * @example
 * ```typescript
 * // With leading slash
 * const path = scopedPath('hh-123', 'sub-456', '/todos');
 * console.log(path); // "/households/hh-123/subjects/sub-456/todos"
 * ```
 *
 * @example
 * ```typescript
 * // Without leading slash (automatically added)
 * const path = scopedPath('hh-123', 'sub-456', 'todos/todo-789');
 * console.log(path); // "/households/hh-123/subjects/sub-456/todos/todo-789"
 * ```
 *
 * @example
 * ```typescript
 * // Used in repositories
 * const { data } = await apiClient.get(
 *   scopedPath(householdId, subjectId, '/habits')
 * );
 * ```
 */
export function scopedPath(
  householdId: string,
  subjectId: string,
  relativePath: string
): string {
  const prefix = buildScopePrefix(householdId, subjectId);
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${prefix}${path}`;
}
