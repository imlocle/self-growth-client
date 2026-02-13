import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService } from "../services/todoService";
import { IToDo } from "@domain/models/todo";
import { useAppScope } from "@scope/AppScopeContext";

/**
 * Generates the React Query cache key for todos.
 * Includes scope to ensure proper cache isolation.
 *
 * @param householdId - The unique identifier of the household
 * @param subjectId - The unique identifier of the subject
 * @returns Array to be used as React Query key
 */
const todosKey = (householdId: string, subjectId: string) => [
  "todos",
  householdId,
  subjectId,
];

/**
 * ToDo List Controller Hook
 *
 * Custom React hook that manages todo list state and operations using React Query.
 * Provides data fetching, caching, and mutation capabilities for todos.
 *
 * Features:
 * - Automatic data fetching with caching
 * - Scope-aware queries (only fetches when scope is set)
 * - Optimistic updates for better UX
 * - Automatic cache invalidation after mutations
 * - Loading and error states
 *
 * @returns Object containing todos data, loading states, and mutation functions
 *
 * @example
 * ```typescript
 * function ToDoScreen() {
 *   const {
 *     todos,
 *     isLoading,
 *     error,
 *     toggleComplete,
 *     deleteTodo,
 *     hasScope
 *   } = useToDoListController();
 *
 *   if (!hasScope) return <NoScopeMessage />;
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage />;
 *
 *   return (
 *     <FlatList
 *       data={todos}
 *       renderItem={({ item }) => (
 *         <ToDoItemCard
 *           todo={item}
 *           onToggle={() => toggleComplete(item)}
 *           onPress={() => navigation.navigate('EditToDo', { todo: item })}
 *         />
 *       )}
 *     />
 *   );
 * }
 * ```
 */
export function useToDoListController() {
  const queryClient = useQueryClient();
  const { activeHouseholdId, activeSubjectId } = useAppScope();

  /**
   * Indicates whether the required scope (household + subject) is set.
   * Queries are disabled when scope is not available.
   */
  const hasScope = !!activeHouseholdId && !!activeSubjectId;

  /**
   * Fetches the list of todos for the active subject.
   * Query is automatically disabled when scope is not set.
   */
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: hasScope
      ? todosKey(activeHouseholdId!, activeSubjectId!)
      : ["todos", "no-scope"],
    enabled: hasScope, // ✅ don't call backend until scope exists
    queryFn: () => todoService.list(activeHouseholdId!, activeSubjectId!),
  });

  /**
   * Mutation for toggling todo completion status.
   * Switches between 'active' and 'completed' states.
   */
  const toggleMutation = useMutation({
    mutationFn: (todo: IToDo) =>
      todoService.toggleComplete(activeHouseholdId!, activeSubjectId!, todo),
    onSuccess: () => {
      if (!hasScope) return;
      queryClient.invalidateQueries({
        queryKey: todosKey(activeHouseholdId!, activeSubjectId!),
      });
    },
  });

  /**
   * Mutation for deleting a todo.
   * Performs a soft delete (sets status to 'deleted').
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      todoService.delete(activeHouseholdId!, activeSubjectId!, id),
    onSuccess: () => {
      if (!hasScope) return;
      queryClient.invalidateQueries({
        queryKey: todosKey(activeHouseholdId!, activeSubjectId!),
      });
    },
  });

  return {
    // Scope information
    hasScope,
    activeHouseholdId,
    activeSubjectId,

    // Data
    todos: data ?? [],
    isLoading,
    error,

    // Actions
    refresh: refetch,
    toggleComplete: toggleMutation.mutate,
    deleteTodo: deleteMutation.mutate,

    // Mutation states
    isToggling: toggleMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
