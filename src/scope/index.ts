/**
 * Scope Module
 *
 * Centralized export for all scoping-related functionality.
 * Handles household and subject scoping for multi-user support.
 *
 * @example
 * ```typescript
 * import { useAppScope, AppScopeProvider, scopedPath } from '@scope';
 * ```
 */

export { AppScopeProvider, useAppScope } from "./AppScopeContext";
export { scopedPath } from "./scopePath";
export { useScopedApi } from "./useScopedApi";
