import { IBaseEntity } from "./todo";

/**
 * Habit counter frequency types.
 * Determines how often a habit should be tracked.
 */
export type HabitCounter = "daily" | "weekly" | "monthly";

/**
 * Habit type indicating whether it's a positive habit to build or negative habit to quit.
 */
export type HabitType = "build" | "quit";

/**
 * Habit status lifecycle states.
 */
export type HabitStatus = "active" | "archived" | "deleted";

/**
 * Habit difficulty levels.
 */
export type HabitDifficulty = "trivial" | "easy" | "medium" | "hard";

/**
 * Habit difficulty options for UI display.
 */
export const HABIT_DIFFICULTY_OPTIONS: Array<{
  key: HabitDifficulty;
  label: string;
  stars: number;
}> = [
  { key: "trivial", label: "Trivial", stars: 1 },
  { key: "easy", label: "Easy", stars: 2 },
  { key: "medium", label: "Medium", stars: 3 },
  { key: "hard", label: "Hard", stars: 4 },
];

/**
 * Habit counter options for UI display.
 */
export const HABIT_COUNTER_OPTIONS: Array<{
  key: HabitCounter;
  label: string;
  description: string;
}> = [
  { key: "daily", label: "Daily", description: "Track every day" },
  { key: "weekly", label: "Weekly", description: "Track once per week" },
  { key: "monthly", label: "Monthly", description: "Track once per month" },
];

/**
 * Habit type options for UI display.
 */
export const HABIT_TYPE_OPTIONS: Array<{
  key: HabitType;
  label: string;
  description: string;
}> = [
  { key: "build", label: "Build", description: "Positive habit to develop" },
  { key: "quit", label: "Quit", description: "Negative habit to eliminate" },
];

/**
 * Habit entity representing a recurring behavior to track.
 *
 * Habits are the definition of intent - they describe what behavior
 * should be tracked. Actual occurrences are logged as HabitEvents.
 *
 * @example
 * ```typescript
 * const habit: IHabit = {
 *   id: 'habit-123',
 *   title: 'Morning run',
 *   description: '5km run every morning',
 *   counter: 'daily',
 *   difficulty: 'medium',
 *   type: 'build',
 *   status: 'active',
 *   dateCreated: '2025-01-01T10:00:00Z',
 *   dateModified: '2025-01-01T10:00:00Z'
 * };
 * ```
 */
export interface IHabit extends IBaseEntity {
  /** The habit title/name */
  title: string;

  /** How often the habit should be tracked (daily, weekly, monthly) */
  counter?: HabitCounter;

  /** Optional detailed description of the habit */
  description?: string;

  /** Difficulty level of the habit */
  difficulty?: HabitDifficulty;

  /** Current status of the habit */
  status?: HabitStatus;

  /** Whether this is a habit to build or quit */
  type?: HabitType;
}

/**
 * Response structure for listing habits.
 * Includes pagination support via lastEvaluatedKey.
 */
export interface IListHabitOutput {
  /** Array of habit items */
  items: IHabit[];

  /** Pagination token for fetching next page (DynamoDB pagination) */
  lastEvaluatedKey?: string;
}

/**
 * Input structure for creating a new habit.
 * All fields except title are optional with sensible defaults.
 *
 * @example
 * ```typescript
 * const input: ICreateHabitInput = {
 *   title: 'Morning meditation',
 *   description: '10 minutes of mindfulness',
 *   counter: 'daily',
 *   difficulty: 'easy',
 *   type: 'build'
 * };
 * ```
 */
export interface ICreateHabitInput {
  /** The habit title/name (required) */
  title: string;

  /** How often the habit should be tracked */
  counter?: HabitCounter;

  /** Optional detailed description */
  description?: string;

  /** Difficulty level */
  difficulty?: HabitDifficulty;

  /** Initial status (defaults to 'active' on backend) */
  status?: HabitStatus;

  /** Whether this is a habit to build or quit */
  type?: HabitType;
}

/**
 * Input structure for updating an existing habit.
 * All fields except id are optional - only send changed fields.
 *
 * @example
 * ```typescript
 * const update: IUpdateHabitInput = {
 *   id: 'habit-123',
 *   difficulty: 'hard', // Only updating difficulty
 *   description: 'Increased to 15 minutes'
 * };
 * ```
 */
export interface IUpdateHabitInput {
  /** The habit ID (required) */
  id: string;

  /** Updated title */
  title?: string;

  /** Updated counter frequency */
  counter?: HabitCounter;

  /** Updated description */
  description?: string;

  /** Updated difficulty */
  difficulty?: HabitDifficulty;

  /** Updated status */
  status?: HabitStatus;

  /** Updated type */
  type?: HabitType;
}