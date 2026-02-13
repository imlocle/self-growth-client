import { ICreateHabitInput, IHabit, IUpdateHabitInput } from "../../../domain/models/habit";
import { habitRepository } from "../repositories/habitRepository";

/**
 * Habit Service
 *
 * Contains business logic for habit operations.
 * Acts as an intermediary between controllers and repositories,
 * handling data transformations, validation, and business rules.
 *
 * @example
 * ```typescript
 * const habits = await habitService.list('household-123', 'subject-456');
 * const habit = await habitService.create('hh-123', 'sub-456', {
 *   title: 'Morning run',
 *   counter: 'daily',
 *   type: 'build'
 * });
 * ```
 */
export const habitService = {
  /**
   * Retrieves all habits for a subject, extracting items from the response.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @returns Promise resolving to an array of habits
   * @throws {Error} If the API request fails
   *
   * @example
   * ```typescript
   * const habits = await habitService.list('hh-123', 'sub-456');
   * console.log(habits.length); // Number of habits
   * ```
   */
  async list(householdId: string, subjectId: string): Promise<IHabit[]> {
    const response = await habitRepository.list(householdId, subjectId);
    return response.items;
  },

  /**
   * Retrieves a single habit by ID.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param id - The unique identifier of the habit
   * @returns Promise resolving to the habit details
   * @throws {Error} If habit not found or API request fails
   *
   * @example
   * ```typescript
   * const habit = await habitService.get('hh-123', 'sub-456', 'habit-789');
   * console.log(habit.title); // "Morning run"
   * ```
   */
  async get(householdId: string, subjectId: string, id: string): Promise<IHabit> {
    return habitRepository.get(householdId, subjectId, id);
  },

  /**
   * Creates a new habit with validation.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param payload - The habit data to create
   * @returns Promise resolving to the created habit
   * @throws {Error} If validation fails or API request fails
   *
   * @example
   * ```typescript
   * const habit = await habitService.create('hh-123', 'sub-456', {
   *   title: 'Morning run',
   *   description: '5km run every morning',
   *   counter: 'daily',
   *   difficulty: 'medium',
   *   type: 'build'
   * });
   * ```
   */
  async create(
    householdId: string,
    subjectId: string,
    payload: ICreateHabitInput
  ): Promise<IHabit> {
    // Validate required fields
    if (!payload.title?.trim()) {
      throw new Error("Habit title is required");
    }

    // Validate title length
    if (payload.title.trim().length > 200) {
      throw new Error("Habit title must be 200 characters or less");
    }

    // Validate description length if provided
    if (payload.description && payload.description.length > 1000) {
      throw new Error("Habit description must be 1000 characters or less");
    }

    return habitRepository.create(householdId, subjectId, payload);
  },

  /**
   * Updates an existing habit.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param payload - The habit data to update
   * @returns Promise resolving to the updated habit
   * @throws {Error} If habit not found or API request fails
   *
   * @example
   * ```typescript
   * const updated = await habitService.update('hh-123', 'sub-456', {
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
    // Validate title length if being updated
    if (payload.title !== undefined) {
      if (!payload.title.trim()) {
        throw new Error("Habit title cannot be empty");
      }
      if (payload.title.trim().length > 200) {
        throw new Error("Habit title must be 200 characters or less");
      }
    }

    // Validate description length if being updated
    if (payload.description !== undefined && payload.description.length > 1000) {
      throw new Error("Habit description must be 1000 characters or less");
    }

    return habitRepository.update(householdId, subjectId, payload);
  },

  /**
   * Archives a habit by setting its status to 'archived'.
   * This is a convenience method for pausing a habit without deleting it.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param habit - The habit to archive
   * @returns Promise resolving to the updated habit
   * @throws {Error} If habit not found or API request fails
   *
   * @example
   * ```typescript
   * const archived = await habitService.archive('hh-123', 'sub-456', habit);
   * console.log(archived.status); // 'archived'
   * ```
   */
  async archive(
    householdId: string,
    subjectId: string,
    habit: IHabit
  ): Promise<IHabit> {
    return habitRepository.update(householdId, subjectId, {
      id: habit.id,
      status: "archived",
    });
  },

  /**
   * Reactivates an archived habit by setting its status to 'active'.
   * This is a convenience method for resuming a paused habit.
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param habit - The habit to reactivate
   * @returns Promise resolving to the updated habit
   * @throws {Error} If habit not found or API request fails
   *
   * @example
   * ```typescript
   * const active = await habitService.reactivate('hh-123', 'sub-456', habit);
   * console.log(active.status); // 'active'
   * ```
   */
  async reactivate(
    householdId: string,
    subjectId: string,
    habit: IHabit
  ): Promise<IHabit> {
    return habitRepository.update(householdId, subjectId, {
      id: habit.id,
      status: "active",
    });
  },

  /**
   * Deletes a habit (soft delete).
   *
   * @param householdId - The unique identifier of the household
   * @param subjectId - The unique identifier of the subject
   * @param id - The unique identifier of the habit to delete
   * @returns Promise resolving when deletion is complete
   * @throws {Error} If habit not found or API request fails
   *
   * @example
   * ```typescript
   * await habitService.delete('hh-123', 'sub-456', 'habit-789');
   * ```
   */
  async delete(householdId: string, subjectId: string, id: string): Promise<void> {
    return habitRepository.delete(householdId, subjectId, id);
  },
};
