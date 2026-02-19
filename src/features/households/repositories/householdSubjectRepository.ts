import { apiClient } from "@core/network/apiClient";
import {
  IHouseholdSubject,
  ICreateHouseholdSubjectInput,
  IUpdateHouseholdSubjectInput,
  IListHouseholdSubjectOutput,
} from "@domain/models/householdSubject";

/**
 * Household Subject Repository
 *
 * Handles all API communication for household subject operations.
 * HouseholdSubject represents individuals being tracked (self, child, adult, pet).
 *
 * @example
 * ```typescript
 * const subjects = await householdSubjectRepository.list('hh-123');
 * const subject = await householdSubjectRepository.create('hh-123', {
 *   type: 'child',
 *   displayName: 'Emma',
 *   dob: '2018-05-15'
 * });
 * ```
 */
export const householdSubjectRepository = {
  /**
   * Retrieves all subjects in a household.
   *
   * @param householdId - The unique identifier of the household
   * @returns Promise resolving to a list of subjects with pagination metadata
   * @throws {Error} If the API request fails or user lacks access
   *
   * @example
   * ```typescript
   * const result = await householdSubjectRepository.list('hh-123');
   * console.log(result.items); // Array of subjects
   * console.log(result.nextToken); // For pagination
   * ```
   */
  async list(householdId: string): Promise<IListHouseholdSubjectOutput> {
    const { data } = await apiClient.get<IListHouseholdSubjectOutput>(
      `/households/${householdId}/subjects`
    );
    return data;
  },

  /**
   * Retrieves a single subject by its ID.
   *
   * @param householdId - The unique identifier of the household
   * @param id - The unique identifier of the subject
   * @returns Promise resolving to the subject details
   * @throws {Error} If subject not found or user lacks access
   *
   * @example
   * ```typescript
   * const subject = await householdSubjectRepository.get('hh-123', 'sub-456');
   * console.log(subject.displayName); // "Emma"
   * ```
   */
  async get(householdId: string, id: string): Promise<IHouseholdSubject> {
    const { data } = await apiClient.get<IHouseholdSubject>(
      `/households/${householdId}/subjects/${id}`
    );
    return data;
  },

  /**
   * Creates a new subject in a household.
   * Backend automatically sets created_by_user_id from the authenticated user's token.
   *
   * @param householdId - The unique identifier of the household
   * @param payload - The subject data to create
   * @returns Promise resolving to the created subject with generated ID
   * @throws {Error} If validation fails or user lacks permission
   *
   * @example
   * ```typescript
   * const newSubject = await householdSubjectRepository.create('hh-123', {
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
    const { data } = await apiClient.post<IHouseholdSubject>(
      `/households/${householdId}/subjects`,
      payload
    );
    return data;
  },

  /**
   * Updates an existing subject with partial data.
   *
   * @param householdId - The unique identifier of the household
   * @param payload - The subject data to update (only changed fields needed)
   * @returns Promise resolving to the updated subject
   * @throws {Error} If subject not found or user lacks permission
   *
   * @example
   * ```typescript
   * const updated = await householdSubjectRepository.update('hh-123', {
   *   id: 'sub-456',
   *   displayName: 'Emma Rose'
   * });
   * ```
   */
  async update(
    householdId: string,
    payload: IUpdateHouseholdSubjectInput
  ): Promise<IHouseholdSubject> {
    const { id, ...rest } = payload;
    const { data } = await apiClient.put<IHouseholdSubject>(
      `/households/${householdId}/subjects/${id}`,
      rest
    );
    return data;
  },

  /**
   * Deletes a subject (soft delete).
   * Warning: Deleting a subject will also delete all associated todos, habits, and blog posts.
   *
   * @param householdId - The unique identifier of the household
   * @param id - The unique identifier of the subject to delete
   * @returns Promise resolving when deletion is complete
   * @throws {Error} If subject not found or user lacks permission
   *
   * @example
   * ```typescript
   * await householdSubjectRepository.delete('hh-123', 'sub-456');
   * // Subject is now soft-deleted
   * ```
   */
  async delete(householdId: string, id: string): Promise<void> {
    await apiClient.delete(`/households/${householdId}/subjects/${id}`);
  },
};
