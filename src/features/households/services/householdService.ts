import {
  ICreateHouseholdInput,
  IHousehold,
  IUpdateHouseholdInput,
} from "@domain/models/household";
import { householdRepository } from "../repositories/householdRepository";

/**
 * Household Service
 *
 * Contains business logic for household operations.
 * Acts as an intermediary between controllers and repositories,
 * handling data transformations, validation, and business rules.
 *
 * @example
 * ```typescript
 * const households = await householdService.list();
 * const household = await householdService.create({ name: 'Smith Family' });
 * ```
 */
export const householdService = {
  /**
   * Retrieves all households the authenticated user is a member of.
   *
   * @returns Promise resolving to an array of households
   * @throws {Error} If the API request fails
   *
   * @example
   * ```typescript
   * const households = await householdService.list();
   * console.log(households.length); // Number of households
   * ```
   */
  async list(): Promise<IHousehold[]> {
    const response = await householdRepository.list();
    return response.items;
  },

  /**
   * Retrieves a single household by ID.
   *
   * @param id - The unique identifier of the household
   * @returns Promise resolving to the household details
   * @throws {Error} If household not found or API request fails
   *
   * @example
   * ```typescript
   * const household = await householdService.get('hh-123');
   * console.log(household.name); // "Smith Family"
   * ```
   */
  async get(id: string): Promise<IHousehold> {
    return householdRepository.get(id);
  },

  /**
   * Creates a new household with validation.
   * Backend automatically creates a HouseholdMember record linking
   * the authenticated user to this household with role 'owner'.
   *
   * @param payload - The household data to create
   * @returns Promise resolving to the created household
   * @throws {Error} If validation fails or API request fails
   *
   * @example
   * ```typescript
   * const household = await householdService.create({
   *   name: 'Smith Family'
   * });
   * ```
   */
  async create(payload: ICreateHouseholdInput): Promise<IHousehold> {
    // Validate required fields
    if (!payload.name?.trim()) {
      throw new Error("Household name is required");
    }

    // Validate name length
    if (payload.name.trim().length > 100) {
      throw new Error("Household name must be 100 characters or less");
    }

    return householdRepository.create(payload);
  },

  /**
   * Updates an existing household.
   *
   * @param payload - The household data to update
   * @returns Promise resolving to the updated household
   * @throws {Error} If household not found or API request fails
   *
   * @example
   * ```typescript
   * const updated = await householdService.update({
   *   id: 'hh-123',
   *   name: 'Updated Family Name'
   * });
   * ```
   */
  async update(payload: IUpdateHouseholdInput): Promise<IHousehold> {
    // Validate name length if being updated
    if (payload.name !== undefined) {
      if (!payload.name.trim()) {
        throw new Error("Household name cannot be empty");
      }
      if (payload.name.trim().length > 100) {
        throw new Error("Household name must be 100 characters or less");
      }
    }

    return householdRepository.update(payload);
  },

  /**
   * Deletes a household (soft delete).
   * Only the household owner can delete a household.
   *
   * @param id - The unique identifier of the household to delete
   * @returns Promise resolving when deletion is complete
   * @throws {Error} If household not found or API request fails
   *
   * @example
   * ```typescript
   * await householdService.delete('hh-123');
   * ```
   */
  async delete(id: string): Promise<void> {
    return householdRepository.delete(id);
  },
};
