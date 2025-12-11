import { apiClient } from "../../../core/network/apiClient";
import { IListHabitOutput, IHabit, ICreateHabitInput, IUpdateHabitInput } from "../../../domain/models/habit";



export const habitRepository = {
  async list(): Promise<IListHabitOutput> {
    const { data } = await apiClient.get<IListHabitOutput>("/habits");
    return data;
  },

  async get(id: string): Promise<IHabit> {
    const { data } = await apiClient.get<IHabit>(`/habit/${id}`);
    return data;
  },

  async create(payload: ICreateHabitInput): Promise<IHabit> {
    const { data } = await apiClient.post<IHabit>("/habit", payload);
    return data;
  },

  async update(payload: IUpdateHabitInput): Promise<IHabit> {
    const { id, ...rest } = payload;
    const { data } = await apiClient.put<IHabit>(`/habit/${id}`, rest);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/habit/${id}`);
  },
};
