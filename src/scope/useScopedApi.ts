import { apiClient } from "@core/network/apiClient";
import { useAppScope } from "./AppScopeContext";
import { scopedPath } from "./scopePath";

export function useScopedApi() {
  const { activeHouseholdId, activeSubjectId } = useAppScope();

  const requireScope = () => {
    if (!activeHouseholdId || !activeSubjectId) {
      throw new Error("Missing scope: select/create a household + subject first.");
    }
    return { activeHouseholdId, activeSubjectId };
  };

  return {
    get: async <T>(path: string) => {
      const { activeHouseholdId, activeSubjectId } = requireScope();
      const url = scopedPath(activeHouseholdId, activeSubjectId, path);
      const { data } = await apiClient.get<T>(url);
      return data;
    },
    post: async <T>(path: string, body?: any) => {
      const { activeHouseholdId, activeSubjectId } = requireScope();
      const url = scopedPath(activeHouseholdId, activeSubjectId, path);
      const { data } = await apiClient.post<T>(url, body);
      return data;
    },
    put: async <T>(path: string, body?: any) => {
      const { activeHouseholdId, activeSubjectId } = requireScope();
      const url = scopedPath(activeHouseholdId, activeSubjectId, path);
      const { data } = await apiClient.put<T>(url, body);
      return data;
    },
    del: async (path: string) => {
      const { activeHouseholdId, activeSubjectId } = requireScope();
      const url = scopedPath(activeHouseholdId, activeSubjectId, path);
      await apiClient.delete(url);
    },
  };
}
