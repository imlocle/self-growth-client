import { todoService } from "@features/todos/services/todoService";
import { todoRepository } from "@features/todos/repositories/todoRepository";
import { IToDo } from "@domain/models/todo";

jest.mock("@features/todos/repositories/todoRepository");

const mockedRepo = todoRepository as jest.Mocked<typeof todoRepository>;

const makeTodo = (overrides: Partial<IToDo> = {}): IToDo => ({
  id: "todo-1",
  title: "Buy groceries",
  dataCreated: "2025-01-01T00:00:00Z",
  dateModified: "2025-01-01T00:00:00Z",
  status: "active",
  difficulty: "easy",
  ...overrides,
});

const HH = "hh-1";
const SUB = "sub-1";

describe("todoService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("list", () => {
    it("returns items array from repository response", async () => {
      const todos = [makeTodo(), makeTodo({ id: "todo-2" })];
      mockedRepo.list.mockResolvedValue({ items: todos });

      const result = await todoService.list(HH, SUB);

      expect(result).toEqual(todos);
      expect(mockedRepo.list).toHaveBeenCalledWith(HH, SUB);
    });

    it("returns empty array when no todos exist", async () => {
      mockedRepo.list.mockResolvedValue({ items: [] });

      const result = await todoService.list(HH, SUB);

      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    it("creates a todo via repository", async () => {
      const todo = makeTodo();
      mockedRepo.create.mockResolvedValue(todo);

      const result = await todoService.create(HH, SUB, {
        title: "Buy groceries",
        difficulty: "easy",
      });

      expect(result).toEqual(todo);
      expect(mockedRepo.create).toHaveBeenCalledWith(HH, SUB, {
        title: "Buy groceries",
        difficulty: "easy",
      });
    });
  });

  describe("update", () => {
    it("updates a todo via repository", async () => {
      const updated = makeTodo({ title: "Updated" });
      mockedRepo.update.mockResolvedValue(updated);

      const result = await todoService.update(HH, SUB, {
        id: "todo-1",
        title: "Updated",
      });

      expect(result.title).toBe("Updated");
    });
  });

  describe("toggleComplete", () => {
    it("toggles active todo to completed", async () => {
      const completed = makeTodo({ status: "completed" });
      mockedRepo.update.mockResolvedValue(completed);

      const result = await todoService.toggleComplete(
        HH,
        SUB,
        makeTodo({ status: "active" })
      );

      expect(mockedRepo.update).toHaveBeenCalledWith(HH, SUB, {
        id: "todo-1",
        status: "completed",
      });
      expect(result.status).toBe("completed");
    });

    it("toggles completed todo to active", async () => {
      const active = makeTodo({ status: "active" });
      mockedRepo.update.mockResolvedValue(active);

      const result = await todoService.toggleComplete(
        HH,
        SUB,
        makeTodo({ status: "completed" })
      );

      expect(mockedRepo.update).toHaveBeenCalledWith(HH, SUB, {
        id: "todo-1",
        status: "active",
      });
      expect(result.status).toBe("active");
    });
  });

  describe("delete", () => {
    it("delegates to repository", async () => {
      mockedRepo.delete.mockResolvedValue(undefined);

      await todoService.delete(HH, SUB, "todo-1");

      expect(mockedRepo.delete).toHaveBeenCalledWith(HH, SUB, "todo-1");
    });
  });
});
