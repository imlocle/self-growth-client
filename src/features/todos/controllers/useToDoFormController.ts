import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService } from "../services/todoService";
import { ICreateToDoInput, IUpdateToDoInput } from "../../../domain/models/todo";
import { useAppScope } from "../../../scope/AppScopeContext";

/**
 * Generates the React Query cache key for todos.
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
 * ToDo Form Controller Hook
 *
 * Custom React hook for managing todo creation and editing operations.
 * Provides mutation functions with automatic cache invalidation.
 *
 * Features:
 * - Create new todos
 * - Update existing todos
 * - Automatic cache invalidation
 * - Loading and error states
 * - Scope-aware mutations
 *
 * @returns Object containing mutation functions and their states
 *
 * @example
 * ```typescript
 * function CreateToDoScreen() {
 *   const { createTodo, isCreating, createError } = useToDoFormController();
 *   const navigation = useNavigation();
 *
 *   const handleSubmit = async (data: ICreateToDoInput) => {
 *     try {
 *       await createTodo(data);
 *       navigation.goBack();
 *     } catch (error) {
 *       // Error is available in createError
 *       console.error('Failed to create todo:', error);
 *     }
 *   };
 *
 *   return (
 *     <ToDoForm
 *       onSubmit={handleSubmit}
 *       isLoading={isCreating}
 *       error={createError}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * function EditToDoScreen({ route }) {
 *   const { todo } = route.params;
 *   const { updateTodo, isUpdating } = useToDoFormController();
 *   const navigation = useNavigation();
 *
 *   const handleSubmit = async (data: IUpdateToDoInput) => {
 *     await updateTodo({ id: todo.id, ...data });
 *     navigation.goBack();
 *   };
 *
 *   return (
 *     <ToDoForm
 *       initialValues={todo}
 *       onSubmit={handleSubmit}
 *       isLoading={isUpdating}
 *     />
 *   );
 * }
 * ```
 */
export function useToDoFormController() {
  const queryClient = useQueryClient();
  const { activeHouseholdId, activeSubjectId } = useAppScope();

  /**
   * Indicates whether the required scope (household + subject) is set.
   */
  const hasScope = !!activeHouseholdId && !!activeSubjectId;

  /**
   * Mutation for creating a new todo.
   * Automatically invalidates the todos list cache on success.
   */
  const createMutation = useMutation({
    mutationFn: (payload: ICreateToDoInput) => {
      if (!hasScope) {
        throw new Error("No scope selected. Please select a household and subject.");
      }
      return todoService.create(activeHouseholdId!, activeSubjectId!, payload);
    },
    onSuccess: () => {
      if (!hasScope) return;
      queryClient.invalidateQueries({
        queryKey: todosKey(activeHouseholdId!, activeSubjectId!),
      });
    },
  });

  /**
   * Mutation for updating an existing todo.
   * Automatically invalidates the todos list cache on success.
   */
  const updateMutation = useMutation({
    mutationFn: (payload: IUpdateToDoInput) => {
      if (!hasScope) {
        throw new Error("No scope selected. Please select a household and subject.");
      }
      return todoService.update(activeHouseholdId!, activeSubjectId!, payload);
    },
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

    // Create mutation
    createTodo: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // Update mutation
    updateTodo: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}
