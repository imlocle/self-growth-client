import { apiClient } from "../../../core/network/apiClient";
import { ICreateToDoInput, IListToDoOutput, IToDo, IUpdateToDoInput } from "../../../domain/models/todo";



export const todoRepository = {
  async list(): Promise<IListToDoOutput> {
    const { data } = await apiClient.get<IListToDoOutput>("/todos");
    return data;
  },

  async get(id: string): Promise<IToDo> {
    const { data } = await apiClient.get<IToDo>(`/todo/${id}`);
    return data;
  },

  async create(payload: ICreateToDoInput): Promise<IToDo> {
    const { data } = await apiClient.post<IToDo>("/todo", payload);
    return data;
  },

  async update(payload: IUpdateToDoInput): Promise<IToDo> {
    const { id, ...rest } = payload;
    const { data } = await apiClient.put<IToDo>(`/todo/${id}`, rest);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/todo/${id}`);
  },
};
