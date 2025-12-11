import { ICreateToDoInput, IToDo, IUpdateToDoInput } from "../../../domain/models/todo";
import { todoRepository} from "../repositories/todoRepository";

export const todoService = {
  async list(): Promise<IToDo[]> {
    const response = await todoRepository.list();
    return response.items
  },

  async create(payload: ICreateToDoInput): Promise<IToDo> {
    // Could add validation here
    return todoRepository.create(payload);
  },

  async update(payload: IUpdateToDoInput): Promise<IToDo> {
    return todoRepository.update(payload);
  },

  async toggleComplete(todo: IToDo): Promise<IToDo> {
    let status = todo.status === "active" ? "completed" : "active"
    return todoRepository.update({
      id: todo.id,
      status: status
    });
  },

  async delete(id: string): Promise<void> {
    return todoRepository.delete(id);
  },
};
