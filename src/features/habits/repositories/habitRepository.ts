import { apiClient } from "@core/network/apiClient";
import { scopedPath } from "@scope/scopePath";
import {
  IHabit,
  ICreateHabitInput,
  IUpdateHabitInput,
  IListHabitOutput,
} from "@domain/models/habit";

/**
 * Habit Repository
 *
 * Handles all API communication for habit-related operations.
 * All methods require explicit scope (householdId and subjectId) to ensure
 * proper data isolation and access control.
 *
 * @example
 * ```typescript
 * const habits = await habitRepository.list('household-123', 'subject-456');
 * const habit = await habitRepository.create('household-123', 'subject-456', {
 *   title: 'Morning run',
 *   counter: 'daily',
 *   type: 'build'
 * });
 * ```
 */
export const habitRepository = {
  /**
   * Retrieves all habits for a specific subject within a household.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @returns Promise resolving to a list of habits with pagination metadata
   * @throws {Error} If the API request fails or user lacks access
   *
   * @example
   * ```typescript
   * const result = await habitRepository.list('hh-123', 'sub-456');
   * console.log(result.items); // Array of habits
   * console.log(result.lastEvaluatedKey); // For pagination
   * ```
   */
  async list(householdId: string, subjectId: string): Promise<IListHabitOutput> {
    const { data } = await apiClient.get<IListHabitOutput>(
      scopedPath(householdId, subjectId, "/habits")
    );
    return data;
  },

  /**
   * Retrieves a single habit by its ID.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param id - The unique identifier of the habit
   * @returns Promise resolving to the habit details
   * @throws {Error} If habit not found or user lacks access
   *
   * @example
   * ```typescript
   * const habit = await habitRepository.get('hh-123', 'sub-456', 'habit-789');
   * console.log(habit.title); // "Morning run"
   * ```
   */
  async get(householdId: string, subjectId: string, id: string): Promise<IHabit> {
    const { data } = await apiClient.get<IHabit>(
      scopedPath(householdId, subjectId, `/habits/${id}`)
    );
    return data;
  },

  /**
   * Creates a new habit for a subject.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param payload - The habit data to create
   * @returns Promise resolving to the created habit with generated ID
   * @throws {Error} If validation fails or user lacks permission
   *
   * @example
   * ```typescript
   * const newHabit = await habitRepository.create('hh-123', 'sub-456', {
   *   title: 'Morning run',
   *   description: '5km run every morning',
   *   counter: 'daily',
   *   difficulty: 'medium',
   *   type: 'build',
   *   status: 'active'
   * });
   * ```
   */
  async create(
    householdId: string,
    subjectId: string,
    payload: ICreateHabitInput
  ): Promise<IHabit> {
    const { data } = await apiClient.post<IHabit>(
      scopedPath(householdId, subjectId, "/habits"),
      payload
    );
    return data;
  },

  /**
   * Updates an existing habit with partial data.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param payload - The habit data to update (only changed fields needed)
   * @returns Promise resolving to the updated habit
   * @throws {Error} If habit not found or user lacks permission
   *
   * @example
   * ```typescript
   * const updated = await habitRepository.update('hh-123', 'sub-456', {
   *   id: 'habit-789',
   *   difficulty: 'hard',
   *   description: 'Increased to 10km'
   * });
   * ```
   */
  async update(
    householdId: string,
    subjectId: string,
    payload: IUpdateHabitInput
  ): Promise<IHabit> {
    const { id, ...rest } = payload;
    const { data } = await apiClient.put<IHabit>(
      scopedPath(householdId, subjectId, `/habits/${id}`),
      rest
    );
    return data;
  },

  /**
   * Deletes a habit (soft delete - sets status to 'deleted').
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param id - The unique identifier of the habit to delete
   * @returns Promise resolving when deletion is complete
   * @throws {Error} If habit not found or user lacks permission
   *
   * @example
   * ```typescript
   * await habitRepository.delete('hh-123', 'sub-456', 'habit-789');
   * // Habit is now soft-deleted (status: 'deleted')
   * ```
   */
  async delete(householdId: string, subjectId: string, id: string): Promise<void> {
    await apiClient.delete(scopedPath(householdId, subjectId, `/habits/${id}`));
  },
};
