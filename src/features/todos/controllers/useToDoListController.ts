import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService } from "../services/todoService";
import { IToDo } from "../../../domain/models/todo";
import { useAppScope } from "../../../scope/AppScopeContext";

const todosKey = (householdId: string, subjectId: string) => [
  "todos",
  householdId,
  subjectId,
];

export function useToDoListController() {
  const queryClient = useQueryClient();
  const { activeHouseholdId, activeSubjectId } = useAppScope();

  const hasScope = !!activeHouseholdId && !!activeSubjectId;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: hasScope
      ? todosKey(activeHouseholdId!, activeSubjectId!)
      : ["todos", "no-scope"],
    enabled: hasScope, // ✅ don't call backend until scope exists
    queryFn: () => todoService.list(activeHouseholdId!, activeSubjectId!),
  });

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
    // Scope awareness (useful for UI)
    hasScope,
    activeHouseholdId,
    activeSubjectId,

    todos: data ?? [],
    isLoading,
    error,
    refresh: refetch,

    toggleComplete: toggleMutation.mutate,
    deleteTodo: deleteMutation.mutate,

    isToggling: toggleMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
