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

  async update(todo: IUpdateToDoInput): Promise<IToDo> {
    return todoRepository.update({
      id: todo.id,
      status: todo.status,
      title: todo.title,
      description: todo.description
    });
  },

  async toggleComplete(todo: IToDo): Promise<IToDo> {
    return todoRepository.update({
      id: todo.id,
      status: todo.status,
    });
  },

  async delete(id: string): Promise<void> {
    return todoRepository.delete(id);
  },
};
