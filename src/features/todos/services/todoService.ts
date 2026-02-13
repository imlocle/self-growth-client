import { ICreateToDoInput, IToDo, IUpdateToDoInput } from "@domain/models/todo";
import { todoRepository } from "../repositories/todoRepository";

/**
 * ToDo Service
 *
 * Contains business logic for todo operations.
 * Acts as an intermediary between controllers and repositories,
 * handling data transformations, validation, and business rules.
 *
 * @example
 * ```typescript
 * const todos = await todoService.list('household-123', 'subject-456');
 * const todo = await todoService.toggleComplete('hh-123', 'sub-456', todo);
 * ```
 */
export const todoService = {
  /**
   * Retrieves all todos for a subject, extracting items from the response.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @returns Promise resolving to an array of todos
   * @throws {Error} If the API request fails
   *
   * @example
   * ```typescript
   * const todos = await todoService.list('hh-123', 'sub-456');
   * console.log(todos.length); // Number of todos
   * ```
   */
  async list(householdId: string, subjectId: string): Promise<IToDo[]> {
    const response = await todoRepository.list(householdId, subjectId);
    return response.items;
  },

  /**
   * Creates a new todo with optional validation.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param payload - The todo data to create
   * @returns Promise resolving to the created todo
   * @throws {Error} If validation fails or API request fails
   *
   * @example
   * ```typescript
   * const todo = await todoService.create('hh-123', 'sub-456', {
   *   title: 'Buy groceries',
   *   difficulty: 'easy'
   * });
   * ```
   */
  async create(
    householdId: string,
    subjectId: string,
    payload: ICreateToDoInput
  ): Promise<IToDo> {
    // Future: Add validation here
    // if (!payload.title.trim()) throw new Error('Title is required');
    return todoRepository.create(householdId, subjectId, payload);
  },

  /**
   * Updates an existing todo.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param payload - The todo data to update
   * @returns Promise resolving to the updated todo
   * @throws {Error} If todo not found or API request fails
   *
   * @example
   * ```typescript
   * const updated = await todoService.update('hh-123', 'sub-456', {
   *   id: 'todo-789',
   *   title: 'Updated title'
   * });
   * ```
   */
  async update(
    householdId: string,
    subjectId: string,
    payload: IUpdateToDoInput
  ): Promise<IToDo> {
    return todoRepository.update(householdId, subjectId, payload);
  },

  /**
   * Toggles a todo between active and completed status.
   * This is a convenience method for the common toggle operation.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param todo - The todo to toggle
   * @returns Promise resolving to the updated todo
   * @throws {Error} If todo not found or API request fails
   *
   * @example
   * ```typescript
   * const toggled = await todoService.toggleComplete('hh-123', 'sub-456', todo);
   * console.log(toggled.status); // 'completed' or 'active'
   * ```
   */
  async toggleComplete(
    householdId: string,
    subjectId: string,
    todo: IToDo
  ): Promise<IToDo> {
    const status = todo.status === "active" ? "completed" : "active";
    return todoRepository.update(householdId, subjectId, {
      id: todo.id,
      status: status,
    });
  },

  /**
   * Deletes a todo (soft delete).
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param id - The unique identifier of the todo to delete
   * @returns Promise resolving when deletion is complete
   * @throws {Error} If todo not found or API request fails
   *
   * @example
   * ```typescript
   * await todoService.delete('hh-123', 'sub-456', 'todo-789');
   * ```
   */
  async delete(householdId: string, subjectId: string, id: string): Promise<void> {
    return todoRepository.delete(householdId, subjectId, id);
  },
};
