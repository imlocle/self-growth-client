/**
 * Base entity interface containing common fields for all entities.
 * All domain entities extend this interface.
 */
export interface IBaseEntity {
  /** Unique identifier for the entity */
  id: string;

  /** Household identifier (scope) */
  householdId: string;

  /** Subject identifier (scope) */
  subjectId: string;

  /** ISO 8601 timestamp when the entity was created */
  dateCreated: string;

  /** ISO 8601 timestamp when the entity was last modified */
  dateModified: string;
}

/**
 * ToDo status lifecycle states.
 */
export type ToDoStatus = "active" | "completed" | "deleted";

/**
 * Difficulty levels for tasks and habits.
 */
export type Difficulty = "trivial" | "easy" | "medium" | "hard";

/**
 * Difficulty options for UI display with visual indicators.
 */
export const DIFFICULTY_OPTIONS: Array<{
  key: Difficulty;
  label: string;
  stars: number;
}> = [
  { key: "trivial", label: "Trivial", stars: 1 },
  { key: "easy", label: "Easy", stars: 2 },
  { key: "medium", label: "Medium", stars: 3 },
  { key: "hard", label: "Hard", stars: 4 },
];

/**
 * ToDo entity representing a task to be completed.
 *
 * ToDos are one-time or recurring tasks that can be marked as complete.
 * They support checklists for breaking down complex tasks.
 *
 * @example
 * ```typescript
 * const todo: IToDo = {
 *   id: 'todo-123',
 *   title: 'Buy groceries',
 *   description: 'Weekly shopping',
 *   checklist: ['Milk', 'Eggs', 'Bread'],
 *   difficulty: 'easy',
 *   status: 'active',
 *   dateDue: '2025-01-15',
 *   dateCreated: '2025-01-01T10:00:00Z',
 *   dateModified: '2025-01-01T10:00:00Z'
 * };
 * ```
 */
export interface IToDo extends IBaseEntity {
  /** The todo title/name */
  title: string;

  /** Optional checklist of sub-tasks */
  checklist?: string[];

  /** Optional due date in ISO 8601 format (YYYY-MM-DD) */
  dateDue?: string;

  /** Optional detailed description */
  description?: string;

  /** Difficulty level of the task */
  difficulty?: Difficulty;

  /** Current status of the todo */
  status?: ToDoStatus;
}

/**
 * Response structure for listing todos.
 * Includes pagination support via lastEvaluatedKey.
 */
export interface IListToDoOutput {
  /** Array of todo items */
  items: IToDo[];

  /** Pagination token for fetching next page (DynamoDB pagination) */
  lastEvaluatedKey?: string;
}

/**
 * Input structure for creating a new todo.
 * Only title is required, all other fields are optional.
 *
 * @example
 * ```typescript
 * const input: ICreateToDoInput = {
 *   title: 'Buy groceries',
 *   description: 'Weekly shopping',
 *   checklist: ['Milk', 'Eggs', 'Bread'],
 *   difficulty: 'easy',
 *   dateDue: '2025-01-15'
 * };
 * ```
 */
export interface ICreateToDoInput {
  /** The todo title/name (required) */
  title: string;

  /** Optional checklist of sub-tasks */
  checklist?: string[];

  /** Optional detailed description */
  description?: string;

  /** Difficulty level */
  difficulty?: Difficulty;

  /** Optional due date in ISO 8601 format (YYYY-MM-DD) */
  dateDue?: string;
}

/**
 * Input structure for updating an existing todo.
 * All fields except id are optional - only send changed fields.
 *
 * @example
 * ```typescript
 * const update: IUpdateToDoInput = {
 *   id: 'todo-123',
 *   status: 'completed' // Only updating status
 * };
 * ```
 */
export interface IUpdateToDoInput {
  /** The todo ID (required) */
  id: string;

  /** Updated title */
  title?: string;

  /** Updated checklist */
  checklist?: string[];

  /** Updated description */
  description?: string;

  /** Updated due date */
  dateDue?: string;

  /** Updated difficulty */
  difficulty?: Difficulty;

  /** Updated status */
  status?: ToDoStatus;
}