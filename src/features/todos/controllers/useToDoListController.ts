import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService } from "../services/todoService";
import { IToDo } from "../../../domain/models/todo";

const TODOS_QUERY_KEY = ["todos"];

export function useToDoListController() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: () => todoService.list(),
  });

  const toggleMutation = useMutation({
    mutationFn: (todo: IToDo) => todoService.toggleComplete(todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => todoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  return {
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
