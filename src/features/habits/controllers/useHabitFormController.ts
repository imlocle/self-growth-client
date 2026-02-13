import { useMutation, useQueryClient } from "@tanstack/react-query";
import { habitService } from "../services/habitService";
import { ICreateHabitInput, IUpdateHabitInput } from "../../../domain/models/habit";
import { useAppScope } from "../../../scope/AppScopeContext";

/**
 * Generates the React Query cache key for habits.
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
 * Habit Form Controller Hook
 *
 * Custom React hook for managing habit creation and editing operations.
 * Provides mutation functions with automatic cache invalidation.
 *
 * Features:
 * - Create new habits
 * - Update existing habits
 * - Automatic cache invalidation
 * - Loading and error states
 * - Scope-aware mutations
 *
 * @returns Object containing mutation functions and their states
 *
 * @example
 * ```typescript
 * function CreateHabitScreen() {
 *   const { createHabit, isCreating, createError } = useHabitFormController();
 *   const navigation = useNavigation();
 *
 *   const handleSubmit = async (data: ICreateHabitInput) => {
 *     try {
 *       await createHabit(data);
 *       navigation.goBack();
 *     } catch (error) {
 *       // Error is available in createError
 *       console.error('Failed to create habit:', error);
 *     }
 *   };
 *
 *   return (
 *     <HabitForm
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
 * function EditHabitScreen({ route }) {
 *   const { habit } = route.params;
 *   const { updateHabit, isUpdating } = useHabitFormController();
 *   const navigation = useNavigation();
 *
 *   const handleSubmit = async (data: IUpdateHabitInput) => {
 *     await updateHabit({ id: habit.id, ...data });
 *     navigation.goBack();
 *   };
 *
 *   return (
 *     <HabitForm
 *       initialValues={habit}
 *       onSubmit={handleSubmit}
 *       isLoading={isUpdating}
 *     />
 *   );
 * }
 * ```
 */
export function useHabitFormController() {
  const queryClient = useQueryClient();
  const { activeHouseholdId, activeSubjectId } = useAppScope();

  /**
   * Indicates whether the required scope (household + subject) is set.
   */
  const hasScope = !!activeHouseholdId && !!activeSubjectId;

  /**
   * Mutation for creating a new habit.
   * Automatically invalidates the habits list cache on success.
   */
  const createMutation = useMutation({
    mutationFn: (payload: ICreateHabitInput) => {
      if (!hasScope) {
        throw new Error("No scope selected. Please select a household and subject.");
      }
      return habitService.create(activeHouseholdId!, activeSubjectId!, payload);
    },
    onSuccess: () => {
      if (!hasScope) return;
      queryClient.invalidateQueries({
        queryKey: habitsKey(activeHouseholdId!, activeSubjectId!),
      });
    },
  });

  /**
   * Mutation for updating an existing habit.
   * Automatically invalidates the habits list cache on success.
   */
  const updateMutation = useMutation({
    mutationFn: (payload: IUpdateHabitInput) => {
      if (!hasScope) {
        throw new Error("No scope selected. Please select a household and subject.");
      }
      return habitService.update(activeHouseholdId!, activeSubjectId!, payload);
    },
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

    // Create mutation
    createHabit: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // Update mutation
    updateHabit: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}
