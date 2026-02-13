/**
 * Habits Feature Module
 *
 * Barrel export file for the habits feature.
 * Provides convenient access to all habit-related functionality.
 *
 * @example
 * ```typescript
 * import {
 *   habitService,
 *   habitRepository,
 *   useHabitListController,
 *   useHabitFormController
 * } from '@/features/habits';
 * ```
 */

// Repository
export { habitRepository } from "./repositories/habitRepository";

// Service
export { habitService } from "./services/habitService";

// Controllers
export { useHabitListController } from "./controllers/useHabitListController";
export { useHabitFormController } from "./controllers/useHabitFormController";
