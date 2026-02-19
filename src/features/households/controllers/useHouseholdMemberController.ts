import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { householdMemberService } from "../services/householdMemberService";
import { ICreateHouseholdMemberInput } from "@domain/models/householdMember";

/**
 * Generates the React Query cache key for household members.
 * Includes householdId to ensure proper cache isolation.
 *
 * @param householdId - The unique identifier of the household
 * @returns Array to be used as React Query key
 */
const householdMembersKey = (householdId: string) => ["householdMembers", householdId];

/**
 * Household Member Controller Hook
 *
 * Custom React hook that manages household member state and operations using React Query.
 * Provides data fetching, caching, and mutation capabilities for members.
 *
 * Features:
 * - Automatic data fetching with caching
 * - Household-scoped queries
 * - Optimistic updates for better UX
 * - Automatic cache invalidation after mutations
 * - Loading and error states
 *
 * @param householdId - The unique identifier of the household
 * @returns Object containing members data, loading states, and mutation functions
 *
 * @example
 * ```typescript
 * function MemberScreen({ householdId }: { householdId: string }) {
 *   const {
 *     members,
 *     isLoading,
 *     error,
 *     addMember,
 *     removeMember
 *   } = useHouseholdMemberController(householdId);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage />;
 *
 *   return (
 *     <FlatList
 *       data={members}
 *       renderItem={({ item }) => (
 *         <MemberCard
 *           member={item}
 *           onRemove={() => removeMember(item.userId)}
 *         />
 *       )}
 *     />
 *   );
 * }
 * ```
 */
export function useHouseholdMemberController(householdId: string) {
  const queryClient = useQueryClient();

  /**
   * Indicates whether the required householdId is provided.
   * Query is automatically disabled when householdId is not set.
   */
  const hasHouseholdId = !!householdId;

  /**
   * Fetches the list of members for the specified household.
   * Query is automatically disabled when householdId is not set.
   */
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: hasHouseholdId
      ? householdMembersKey(householdId)
      : ["householdMembers", "no-household"],
    enabled: hasHouseholdId,
    queryFn: () => householdMemberService.list(householdId),
  });

  /**
   * Mutation for adding a member to the household.
   */
  const addMutation = useMutation({
    mutationFn: (payload: ICreateHouseholdMemberInput) =>
      householdMemberService.create(householdId, payload),
    onSuccess: () => {
      if (!hasHouseholdId) return;
      queryClient.invalidateQueries({ queryKey: householdMembersKey(householdId) });
    },
  });

  /**
   * Mutation for removing a member from the household.
   * User must be household owner or admin to remove members.
   */
  const removeMutation = useMutation({
    mutationFn: (userId: string) => householdMemberService.delete(householdId, userId),
    onSuccess: () => {
      if (!hasHouseholdId) return;
      queryClient.invalidateQueries({ queryKey: householdMembersKey(householdId) });
    },
  });

  return {
    // Household information
    hasHouseholdId,
    householdId,

    // Data
    members: data ?? [],
    isLoading,
    error,

    // Actions
    refresh: refetch,
    addMember: addMutation.mutate,
    removeMember: removeMutation.mutate,

    // Mutation states
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
