import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitService } from "../services/habitService";
import { IHabit } from "../../../domain/models/habit";
import { useAppScope } from "../../../scope/AppScopeContext";

/**
 * Generates the React Query cache key for habits.
 * Includes scope to ensure proper cache isolation.
 *
 * @param householdId - The unique identifier of the household
 * @param subjectId - The unique identifier of the subject
 * @returns Array to be used as React Query key
 */
const habitsKey = (householdId: string, subjectId: string) => [
  "habits",
  householdId,
  subjectId,
];

/**
 * Habit List Controller Hook
 *
 * Custom React hook that manages habit list state and operations using React Query.
 * Provides data fetching, caching, and mutation capabilities for habits.
 *
 * Features:
 * - Automatic data fetching with caching
 * - Scope-aware queries (only fetches when scope is set)
 * - Optimistic updates for better UX
 * - Automatic cache invalidation after mutations
 * - Loading and error states
 *
 * @returns Object containing habits data, loading states, and mutation functions
 *
 * @example
 * ```typescript
 * function HabitScreen() {
 *   const {
 *     habits,
 *     isLoading,
 *     error,
 *     deleteHabit,
 *     archiveHabit,
 *     reactivateHabit,
 *     hasScope
 *   } = useHabitListController();
 *
 *   if (!hasScope) return <NoScopeMessage />;
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage />;
 *
 *   return (
 *     <FlatList
 *       data={habits}
 *       renderItem={({ item }) => (
 *         <HabitCard
 *           habit={item}
 *           onArchive={() => archiveHabit(item)}
 *           onDelete={() => deleteHabit(item.id)}
 *         />
 *       )}
 *     />
 *   );
 * }
 * ```
 */
export function useHabitListController() {
  const queryClient = useQueryClient();
  const { activeHouseholdId, activeSubjectId } = useAppScope();

  /**
   * Indicates whether the required scope (household + subject) is set.
   * Queries are disabled when scope is not available.
   */
  const hasScope = !!activeHouseholdId && !!activeSubjectId;

  /**
   * Fetches the list of habits for the active subject.
   * Query is automatically disabled when scope is not set.
   */
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: hasScope
      ? habitsKey(activeHouseholdId!, activeSubjectId!)
      : ["habits", "no-scope"],
    enabled: hasScope,
    queryFn: () => habitService.list(activeHouseholdId!, activeSubjectId!),
  });

  /**
   * Mutation for archiving a habit.
   * Sets the habit status to 'archived' without deleting it.
   */
  const archiveMutation = useMutation({
    mutationFn: (habit: IHabit) =>
      habitService.archive(activeHouseholdId!, activeSubjectId!, habit),
    onSuccess: () => {
      if (!hasScope) return;
      queryClient.invalidateQueries({
        queryKey: habitsKey(activeHouseholdId!, activeSubjectId!),
      });
    },
  });

  /**
   * Mutation for reactivating an archived habit.
   * Sets the habit status back to 'active'.
   */
  const reactivateMutation = useMutation({
    mutationFn: (habit: IHabit) =>
      habitService.reactivate(activeHouseholdId!, activeSubjectId!, habit),
    onSuccess: () => {
      if (!hasScope) return;
      queryClient.invalidateQueries({
        queryKey: habitsKey(activeHouseholdId!, activeSubjectId!),
      });
    },
  });

  /**
   * Mutation for deleting a habit.
   * Performs a soft delete (sets status to 'deleted').
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      habitService.delete(activeHouseholdId!, activeSubjectId!, id),
    onSuccess: () => {
      if (!hasScope) return;
      queryClient.invalidateQueries({
        queryKey: habitsKey(activeHouseholdId!, activeSubjectId!),
      });
    },
  });

  return {
    // Scope information
    hasScope,
    activeHouseholdId,
    activeSubjectId,

    // Data
    habits: data ?? [],
    isLoading,
    error,

    // Actions
    refresh: refetch,
    archiveHabit: archiveMutation.mutate,
    reactivateHabit: reactivateMutation.mutate,
    deleteHabit: deleteMutation.mutate,

    // Mutation states
    isArchiving: archiveMutation.isPending,
    isReactivating: reactivateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
