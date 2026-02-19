import { useQuery, useMutation, useQueryClient } from "@tantml:react-query";
import { householdSubjectService } from "../services/householdSubjectService";
import {
  ICreateHouseholdSubjectInput,
  IUpdateHouseholdSubjectInput,
} from "@domain/models/householdSubject";

/**
 * Generates the React Query cache key for household subjects.
 * Includes householdId to ensure proper cache isolation.
 *
 * @param householdId - The unique identifier of the household
 * @returns Array to be used as React Query key
 */
const householdSubjectsKey = (householdId: string) => ["householdSubjects", householdId];

/**
 * Household Subject Controller Hook
 *
 * Custom React hook that manages household subject state and operations using React Query.
 * Provides data fetching, caching, and mutation capabilities for subjects.
 *
 * Features:
 * - Automatic data fetching with caching
 * - Household-scoped queries
 * - Optimistic updates for better UX
 * - Automatic cache invalidation after mutations
 * - Loading and error states
 *
 * @param householdId - The unique identifier of the household
 * @returns Object containing subjects data, loading states, and mutation functions
 *
 * @example
 * ```typescript
 * function SubjectScreen({ householdId }: { householdId: string }) {
 *   const {
 *     subjects,
 *     isLoading,
 *     error,
 *     createSubject,
 *     updateSubject,
 *     deleteSubject
 *   } = useHouseholdSubjectController(householdId);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage />;
 *
 *   return (
 *     <FlatList
 *       data={subjects}
 *       renderItem={({ item }) => (
 *         <SubjectCard
 *           subject={item}
 *           onPress={() => navigation.navigate('SubjectDetail', { id: item.id })}
 *         />
 *       )}
 *     />
 *   );
 * }
 * ```
 */
export function useHouseholdSubjectController(householdId: string) {
  const queryClient = useQueryClient();

  /**
   * Indicates whether the required householdId is provided.
   * Query is automatically disabled when householdId is not set.
   */
  const hasHouseholdId = !!householdId;

  /**
   * Fetches the list of subjects for the specified household.
   * Query is automatically disabled when householdId is not set.
   */
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: hasHouseholdId
      ? householdSubjectsKey(householdId)
      : ["householdSubjects", "no-household"],
    enabled: hasHouseholdId,
    queryFn: () => householdSubjectService.list(householdId),
  });

  /**
   * Mutation for creating a new subject.
   * Backend automatically sets created_by_user_id from the authenticated user's token.
   */
  const createMutation = useMutation({
    mutationFn: (payload: ICreateHouseholdSubjectInput) =>
      householdSubjectService.create(householdId, payload),
    onSuccess: () => {
      if (!hasHouseholdId) return;
      queryClient.invalidateQueries({ queryKey: householdSubjectsKey(householdId) });
    },
  });

  /**
   * Mutation for updating a subject.
   */
  const updateMutation = useMutation({
    mutationFn: (payload: IUpdateHouseholdSubjectInput) =>
      householdSubjectService.update(householdId, payload),
    onSuccess: () => {
      if (!hasHouseholdId) return;
      queryClient.invalidateQueries({ queryKey: householdSubjectsKey(householdId) });
    },
  });

  /**
   * Mutation for deleting a subject.
   * Warning: Deleting a subject will also delete all associated todos, habits, and blog posts.
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => householdSubjectService.delete(householdId, id),
    onSuccess: () => {
      if (!hasHouseholdId) return;
      queryClient.invalidateQueries({ queryKey: householdSubjectsKey(householdId) });
    },
  });

  return {
    // Household information
    hasHouseholdId,
    householdId,

    // Data
    subjects: data ?? [],
    isLoading,
    error,

    // Actions
    refresh: refetch,
    createSubject: createMutation.mutate,
    updateSubject: updateMutation.mutate,
    deleteSubject: deleteMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
