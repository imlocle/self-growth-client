import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { householdService } from "../services/householdService";
import { ICreateHouseholdInput, IUpdateHouseholdInput } from "@domain/models/household";

/**
 * Generates the React Query cache key for households.
 *
 * @returns Array to be used as React Query key
 */
const householdsKey = () => ["households"];

/**
 * Household Controller Hook
 *
 * Custom React hook that manages household state and operations using React Query.
 * Provides data fetching, caching, and mutation capabilities for households.
 *
 * Features:
 * - Automatic data fetching with caching
 * - Optimistic updates for better UX
 * - Automatic cache invalidation after mutations
 * - Loading and error states
 *
 * @returns Object containing households data, loading states, and mutation functions
 *
 * @example
 * ```typescript
 * function HouseholdScreen() {
 *   const {
 *     households,
 *     isLoading,
 *     error,
 *     createHousehold,
 *     updateHousehold,
 *     deleteHousehold
 *   } = useHouseholdController();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage />;
 *
 *   return (
 *     <FlatList
 *       data={households}
 *       renderItem={({ item }) => (
 *         <HouseholdCard
 *           household={item}
 *           onPress={() => navigation.navigate('HouseholdDetail', { id: item.id })}
 *         />
 *       )}
 *     />
 *   );
 * }
 * ```
 */
export function useHouseholdController() {
  const queryClient = useQueryClient();

  /**
   * Fetches the list of households the authenticated user is a member of.
   */
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: householdsKey(),
    queryFn: () => householdService.list(),
  });

  /**
   * Mutation for creating a new household.
   * Backend automatically creates a HouseholdMember record linking
   * the authenticated user to this household with role 'owner'.
   */
  const createMutation = useMutation({
    mutationFn: (payload: ICreateHouseholdInput) => householdService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: householdsKey() });
    },
  });

  /**
   * Mutation for updating a household.
   */
  const updateMutation = useMutation({
    mutationFn: (payload: IUpdateHouseholdInput) => householdService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: householdsKey() });
    },
  });

  /**
   * Mutation for deleting a household.
   * Only the household owner can delete a household.
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => householdService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: householdsKey() });
    },
  });

  return {
    // Data
    households: data ?? [],
    isLoading,
    error,

    // Actions
    refresh: refetch,
    createHousehold: createMutation.mutate,
    updateHousehold: updateMutation.mutate,
    deleteHousehold: deleteMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
