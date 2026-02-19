import {
  ICreateHouseholdMemberInput,
  IHouseholdMember,
} from "@domain/models/householdMember";
import { householdMemberRepository } from "../repositories/householdMemberRepository";

/**
 * Household Member Service
 *
 * Contains business logic for household member operations.
 * Acts as an intermediary between controllers and repositories,
 * handling data transformations, validation, and business rules.
 *
 * @example
 * ```typescript
 * const members = await householdMemberService.list('hh-123');
 * const member = await householdMemberService.create('hh-123', {
 *   userId: 'user-456',
 *   role: 'member'
 * });
 * ```
 */
export const householdMemberService = {
  /**
   * Retrieves all members of a household.
   *
   * @param householdId - The unique identifier of the household
   * @returns Promise resolving to an array of members
   * @throws {Error} If the API request fails
   *
   * @example
   * ```typescript
   * const members = await householdMemberService.list('hh-123');
   * console.log(members.length); // Number of members
   * ```
   */
  async list(householdId: string): Promise<IHouseholdMember[]> {
    const response = await householdMemberRepository.list(householdId);
    return response.items;
  },

  /**
   * Adds a member to a household with validation.
   *
   * @param householdId - The unique identifier of the household
   * @param payload - The member data to create
   * @returns Promise resolving to the created member record
   * @throws {Error} If validation fails or API request fails
   *
   * @example
   * ```typescript
   * const member = await householdMemberService.create('hh-123', {
   *   userId: 'user-456',
   *   role: 'member'
   * });
   * ```
   */
  async create(
    householdId: string,
    payload: ICreateHouseholdMemberInput
  ): Promise<IHouseholdMember> {
    // Validate required fields
    if (!payload.userId?.trim()) {
      throw new Error("User ID is required");
    }

    if (!payload.role) {
      throw new Error("Role is required");
    }

    // Validate role enum
    const validRoles = ["owner", "admin", "member"];
    if (!validRoles.includes(payload.role)) {
      throw new Error(`Role must be one of: ${validRoles.join(", ")}`);
    }

    return householdMemberRepository.create(householdId, payload);
  },

  /**
   * Removes a member from a household.
   * User must be household owner or admin to remove members.
   *
   * @param householdId - The unique identifier of the household
   * @param userId - The unique identifier of the user to remove
   * @returns Promise resolving when removal is complete
   * @throws {Error} If member not found or API request fails
   *
   * @example
   * ```typescript
   * await householdMemberService.delete('hh-123', 'user-456');
   * ```
   */
  async delete(householdId: string, userId: string): Promise<void> {
    return householdMemberRepository.delete(householdId, userId);
  },
};
