import {
  ICreateHouseholdSubjectInput,
  IHouseholdSubject,
  IUpdateHouseholdSubjectInput,
} from "@domain/models/householdSubject";
import { householdSubjectRepository } from "../repositories/householdSubjectRepository";

/**
 * Household Subject Service
 *
 * Contains business logic for household subject operations.
 * Acts as an intermediary between controllers and repositories,
 * handling data transformations, validation, and business rules.
 *
 * @example
 * ```typescript
 * const subjects = await householdSubjectService.list('hh-123');
 * const subject = await householdSubjectService.create('hh-123', {
 *   type: 'child',
 *   displayName: 'Emma'
 * });
 * ```
 */
export const householdSubjectService = {
  /**
   * Retrieves all subjects in a household.
   *
   * @param householdId - The unique identifier of the household
   * @returns Promise resolving to an array of subjects
   * @throws {Error} If the API request fails
   *
   * @example
   * ```typescript
   * const subjects = await householdSubjectService.list('hh-123');
   * console.log(subjects.length); // Number of subjects
   * ```
   */
  async list(householdId: string): Promise<IHouseholdSubject[]> {
    const response = await householdSubjectRepository.list(householdId);
    return response.items;
  },

  /**
   * Retrieves a single subject by ID.
   *
   * @param householdId - The unique identifier of the household
   * @param id - The unique identifier of the subject
   * @returns Promise resolving to the subject details
   * @throws {Error} If subject not found or API request fails
   *
   * @example
   * ```typescript
   * const subject = await householdSubjectService.get('hh-123', 'sub-456');
   * console.log(subject.displayName); // "Emma"
   * ```
   */
  async get(householdId: string, id: string): Promise<IHouseholdSubject> {
    return householdSubjectRepository.get(householdId, id);
  },

  /**
   * Creates a new subject with validation.
   * Backend automatically sets created_by_user_id from the authenticated user's token.
   *
   * @param householdId - The unique identifier of the household
   * @param payload - The subject data to create
   * @returns Promise resolving to the created subject
   * @throws {Error} If validation fails or API request fails
   *
   * @example
   * ```typescript
   * const subject = await householdSubjectService.create('hh-123', {
   *   type: 'child',
   *   displayName: 'Emma',
   *   dob: '2018-05-15'
   * });
   * ```
   */
  async create(
    householdId: string,
    payload: ICreateHouseholdSubjectInput
  ): Promise<IHouseholdSubject> {
    // Validate required fields
    if (!payload.type) {
      throw new Error("Subject type is required");
    }

    // Validate display name length if provided
    if (payload.displayName && payload.displayName.length > 50) {
      throw new Error("Display name must be 50 characters or less");
    }

    // Validate DOB format if provided (basic check)
    if (payload.dob && !/^\d{4}-\d{2}-\d{2}$/.test(payload.dob)) {
      throw new Error("Date of birth must be in YYYY-MM-DD format");
    }

    return householdSubjectRepository.create(householdId, payload);
  },

  /**
   * Updates an existing subject.
   *
   * @param householdId - The unique identifier of the household
   * @param payload - The subject data to update
   * @returns Promise resolving to the updated subject
   * @throws {Error} If subject not found or API request fails
   *
   * @example
   * ```typescript
   * const updated = await householdSubjectService.update('hh-123', {
   *   id: 'sub-456',
   *   displayName: 'Emma Rose'
   * });
   * ```
   */
  async update(
    householdId: string,
    payload: IUpdateHouseholdSubjectInput
  ): Promise<IHouseholdSubject> {
    // Validate type enum if being updated
    if (payload.type !== undefined) {
      const validTypes = ["self", "child", "adult", "pet"];
      if (!validTypes.includes(payload.type)) {
        throw new Error(`Subject type must be one of: ${validTypes.join(", ")}`);
      }
    }

    // Validate display name length if being updated
    if (payload.displayName !== undefined && payload.displayName.length > 50) {
      throw new Error("Display name must be 50 characters or less");
    }

    // Validate DOB format if being updated
    if (payload.dob !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(payload.dob)) {
      throw new Error("Date of birth must be in YYYY-MM-DD format");
    }

    return householdSubjectRepository.update(householdId, payload);
  },

  /**
   * Deletes a subject (soft delete).
   * Warning: Deleting a subject will also delete all associated todos, habits, and blog posts.
   *
   * @param householdId - The unique identifier of the household
   * @param id - The unique identifier of the subject to delete
   * @returns Promise resolving when deletion is complete
   * @throws {Error} If subject not found or API request fails
   *
   * @example
   * ```typescript
   * await householdSubjectService.delete('hh-123', 'sub-456');
   * ```
   */
  async delete(householdId: string, id: string): Promise<void> {
    return householdSubjectRepository.delete(householdId, id);
  },
};
