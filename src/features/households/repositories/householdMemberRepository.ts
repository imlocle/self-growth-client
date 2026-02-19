import { apiClient } from "@core/network/apiClient";
import {
  IHouseholdMember,
  ICreateHouseholdMemberInput,
  IListHouseholdMemberOutput,
} from "@domain/models/householdMember";

/**
 * Household Member Repository
 *
 * Handles all API communication for household member operations.
 * HouseholdMember represents access control - who can access a household.
 *
 * @example
 * ```typescript
 * const members = await householdMemberRepository.list('hh-123');
 * const member = await householdMemberRepository.create('hh-123', {
 *   userId: 'user-456',
 *   role: 'member'
 * });
 * ```
 */
export const householdMemberRepository = {
  /**
   * Retrieves all members of a household.
   *
   * @param householdId - The unique identifier of the household
   * @returns Promise resolving to a list of members with pagination metadata
   * @throws {Error} If the API request fails or user lacks access
   *
   * @example
   * ```typescript
   * const result = await householdMemberRepository.list('hh-123');
   * console.log(result.items); // Array of members
   * console.log(result.nextToken); // For pagination
   * ```
   */
  async list(householdId: string): Promise<IListHouseholdMemberOutput> {
    const { data } = await apiClient.get<IListHouseholdMemberOutput>(
      `/households/${householdId}/members`
    );
    return data;
  },

  /**
   * Adds a member to a household.
   *
   * @param householdId - The unique identifier of the household
   * @param payload - The member data to create
   * @returns Promise resolving to the created member record
   * @throws {Error} If validation fails or user lacks permission
   *
   * @example
   * ```typescript
   * const newMember = await householdMemberRepository.create('hh-123', {
   *   userId: 'user-456',
   *   role: 'member'
   * });
   * ```
   */
  async create(
    householdId: string,
    payload: ICreateHouseholdMemberInput
  ): Promise<IHouseholdMember> {
    const { data } = await apiClient.post<IHouseholdMember>(
      `/households/${householdId}/members`,
      payload
    );
    return data;
  },

  /**
   * Removes a member from a household.
   * User must be household owner or admin to remove members.
   *
   * @param householdId - The unique identifier of the household
   * @param userId - The unique identifier of the user to remove
   * @returns Promise resolving when removal is complete
   * @throws {Error} If member not found or user lacks permission
   *
   * @example
   * ```typescript
   * await householdMemberRepository.delete('hh-123', 'user-456');
   * // Member is now removed from household
   * ```
   */
  async delete(householdId: string, userId: string): Promise<void> {
    await apiClient.delete(`/households/${householdId}/members/${userId}`);
  },
};
