import { apiClient } from "../../../core/network/apiClient";
import { scopedPath } from "../../../scope/scopePath";
import {
  IToDo,
  ICreateToDoInput,
  IUpdateToDoInput,
  IListToDoOutput,
} from "../../../domain/models/todo";

/**
 * ToDo Repository
 *
 * Handles all API communication for todo-related operations.
 * All methods require explicit scope (householdId and subjectId) to ensure
 * proper data isolation and access control.
 *
 * @example
 * ```typescript
 * const todos = await todoRepository.list('household-123', 'subject-456');
 * const todo = await todoRepository.create('household-123', 'subject-456', {
 *   title: 'Buy groceries',
 *   difficulty: 'easy'
 * });
 * ```
 */
export const todoRepository = {
  /**
   * Retrieves all todos for a specific subject within a household.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @returns Promise resolving to a list of todos with pagination metadata
   * @throws {Error} If the API request fails or user lacks access
   *
   * @example
   * ```typescript
   * const result = await todoRepository.list('hh-123', 'sub-456');
   * console.log(result.items); // Array of todos
   * console.log(result.lastEvaluatedKey); // For pagination
   * ```
   */
  async list(householdId: string, subjectId: string): Promise<IListToDoOutput> {
    const { data } = await apiClient.get<IListToDoOutput>(
      scopedPath(householdId, subjectId, "/todos")
    );
    return data;
  },

  /**
   * Retrieves a single todo by its ID.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param id - The unique identifier of the todo
   * @returns Promise resolving to the todo details
   * @throws {Error} If todo not found or user lacks access
   *
   * @example
   * ```typescript
   * const todo = await todoRepository.get('hh-123', 'sub-456', 'todo-789');
   * console.log(todo.title); // "Buy groceries"
   * ```
   */
  async get(householdId: string, subjectId: string, id: string): Promise<IToDo> {
    const { data } = await apiClient.get<IToDo>(
      scopedPath(householdId, subjectId, `/todos/${id}`)
    );
    return data;
  },

  /**
   * Creates a new todo for a subject.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param payload - The todo data to create
   * @returns Promise resolving to the created todo with generated ID
   * @throws {Error} If validation fails or user lacks permission
   *
   * @example
   * ```typescript
   * const newTodo = await todoRepository.create('hh-123', 'sub-456', {
   *   title: 'Buy groceries',
   *   description: 'Milk, eggs, bread',
   *   difficulty: 'easy',
   *   dateDue: '2025-01-15'
   * });
   * ```
   */
  async create(
    householdId: string,
    subjectId: string,
    payload: ICreateToDoInput
  ): Promise<IToDo> {
    const { data } = await apiClient.post<IToDo>(
      scopedPath(householdId, subjectId, "/todos"),
      payload
    );
    return data;
  },

  /**
   * Updates an existing todo with partial data.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param payload - The todo data to update (only changed fields needed)
   * @returns Promise resolving to the updated todo
   * @throws {Error} If todo not found or user lacks permission
   *
   * @example
   * ```typescript
   * const updated = await todoRepository.update('hh-123', 'sub-456', {
   *   id: 'todo-789',
   *   status: 'completed'
   * });
   * ```
   */
  async update(
    householdId: string,
    subjectId: string,
    payload: IUpdateToDoInput
  ): Promise<IToDo> {
    const { id, ...rest } = payload;
    const { data } = await apiClient.put<IToDo>(
      scopedPath(householdId, subjectId, `/todos/${id}`),
      rest
    );
    return data;
  },

  /**
   * Deletes a todo (soft delete - sets status to 'deleted').
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param id - The unique identifier of the todo to delete
   * @returns Promise resolving when deletion is complete
   * @throws {Error} If todo not found or user lacks permission
   *
   * @example
   * ```typescript
   * await todoRepository.delete('hh-123', 'sub-456', 'todo-789');
   * // Todo is now soft-deleted (status: 'deleted')
   * ```
   */
  async delete(householdId: string, subjectId: string, id: string): Promise<void> {
    await apiClient.delete(scopedPath(householdId, subjectId, `/todos/${id}`));
  },
};
