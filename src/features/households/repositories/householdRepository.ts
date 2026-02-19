import { apiClient } from "@core/network/apiClient";
import {
  IHousehold,
  ICreateHouseholdInput,
  IUpdateHouseholdInput,
  IListHouseholdOutput,
} from "@domain/models/household";

/**
 * Household Repository
 *
 * Handles all API communication for household-related operations.
 * Households are shared containers (family, couple, individual workspace).
 *
 * @example
 * ```typescript
 * const households = await householdRepository.list();
 * const household = await householdRepository.create({ name: 'Smith Family' });
 * ```
 */
export const householdRepository = {
  /**
   * Retrieves all households the authenticated user is a member of.
   *
   * @returns Promise resolving to a list of households with pagination metadata
   * @throws {Error} If the API request fails
   *
   * @example
   * ```typescript
   * const result = await householdRepository.list();
   * console.log(result.items); // Array of households
   * console.log(result.nextToken); // For pagination
   * ```
   */
  async list(): Promise<IListHouseholdOutput> {
    const { data } = await apiClient.get<IListHouseholdOutput>("/households");
    return data;
  },

  /**
   * Retrieves a single household by its ID.
   *
   * @param id - The unique identifier of the household
   * @returns Promise resolving to the household details
   * @throws {Error} If household not found or user lacks access
   *
   * @example
   * ```typescript
   * const household = await householdRepository.get('hh-123');
   * console.log(household.name); // "Smith Family"
   * ```
   */
  async get(id: string): Promise<IHousehold> {
    const { data } = await apiClient.get<IHousehold>(`/households/${id}`);
    return data;
  },

  /**
   * Creates a new household.
   * Backend automatically creates a HouseholdMember record linking
   * the authenticated user to this household with role 'owner'.
   *
   * @param payload - The household data to create
   * @returns Promise resolving to the created household with generated ID
   * @throws {Error} If validation fails
   *
   * @example
   * ```typescript
   * const newHousehold = await householdRepository.create({
   *   name: 'Smith Family'
   * });
   * ```
   */
  async create(payload: ICreateHouseholdInput): Promise<IHousehold> {
    const { data } = await apiClient.post<IHousehold>("/households", payload);
    return data;
  },

  /**
   * Updates an existing household with partial data.
   *
   * @param payload - The household data to update (only changed fields needed)
   * @returns Promise resolving to the updated household
   * @throws {Error} If household not found or user lacks permission
   *
   * @example
   * ```typescript
   * const updated = await householdRepository.update({
   *   id: 'hh-123',
   *   name: 'Updated Family Name'
   * });
   * ```
   */
  async update(payload: IUpdateHouseholdInput): Promise<IHousehold> {
    const { id, ...rest } = payload;
    const { data } = await apiClient.put<IHousehold>(`/households/${id}`, rest);
    return data;
  },

  /**
   * Deletes a household (soft delete).
   * Only the household owner can delete a household.
   *
   * @param id - The unique identifier of the household to delete
   * @returns Promise resolving when deletion is complete
   * @throws {Error} If household not found or user is not the owner
   *
   * @example
   * ```typescript
   * await householdRepository.delete('hh-123');
   * // Household is now soft-deleted
   * ```
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/households/${id}`);
  },
};
