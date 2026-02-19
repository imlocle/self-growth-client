import { habitService } from "@features/habits/services/habitService";
import { habitRepository } from "@features/habits/repositories/habitRepository";
import { IHabit, IListHabitOutput } from "@domain/models/habit";

jest.mock("@features/habits/repositories/habitRepository");

const mockedRepo = habitRepository as jest.Mocked<typeof habitRepository>;

const makeHabit = (overrides: Partial<IHabit> = {}): IHabit => ({
  id: "habit-1",
  title: "Morning run",
  dataCreated: "2025-01-01T00:00:00Z",
  dateModified: "2025-01-01T00:00:00Z",
  counter: "daily",
  difficulty: "medium",
  type: "build",
  status: "active",
  ...overrides,
});

const HH = "hh-1";
const SUB = "sub-1";

describe("habitService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("list", () => {
    it("returns items array from repository response", async () => {
      const habits = [makeHabit(), makeHabit({ id: "habit-2" })];
      mockedRepo.list.mockResolvedValue({ items: habits });

      const result = await habitService.list(HH, SUB);

      expect(result).toEqual(habits);
      expect(mockedRepo.list).toHaveBeenCalledWith(HH, SUB);
    });
  });

  describe("get", () => {
    it("delegates to repository", async () => {
      const habit = makeHabit();
      mockedRepo.get.mockResolvedValue(habit);

      const result = await habitService.get(HH, SUB, "habit-1");

      expect(result).toEqual(habit);
      expect(mockedRepo.get).toHaveBeenCalledWith(HH, SUB, "habit-1");
    });
  });

  describe("create", () => {
    it("creates a habit with valid input", async () => {
      const habit = makeHabit();
      mockedRepo.create.mockResolvedValue(habit);

      const result = await habitService.create(HH, SUB, {
        title: "Morning run",
        counter: "daily",
        type: "build",
      });

      expect(result).toEqual(habit);
      expect(mockedRepo.create).toHaveBeenCalledWith(HH, SUB, {
        title: "Morning run",
        counter: "daily",
        type: "build",
      });
    });

    it("throws when title is empty", async () => {
      await expect(
        habitService.create(HH, SUB, { title: "   " })
      ).rejects.toThrow("Habit title is required");
    });

    it("throws when title exceeds 200 characters", async () => {
      await expect(
        habitService.create(HH, SUB, { title: "a".repeat(201) })
      ).rejects.toThrow("Habit title must be 200 characters or less");
    });

    it("throws when description exceeds 1000 characters", async () => {
      await expect(
        habitService.create(HH, SUB, {
          title: "Valid",
          description: "x".repeat(1001),
        })
      ).rejects.toThrow("Habit description must be 1000 characters or less");
    });
  });

  describe("update", () => {
    it("updates a habit with valid input", async () => {
      const updated = makeHabit({ difficulty: "hard" });
      mockedRepo.update.mockResolvedValue(updated);

      const result = await habitService.update(HH, SUB, {
        id: "habit-1",
        difficulty: "hard",
      });

      expect(result.difficulty).toBe("hard");
    });

    it("throws when updated title is empty", async () => {
      await expect(
        habitService.update(HH, SUB, { id: "habit-1", title: "  " })
      ).rejects.toThrow("Habit title cannot be empty");
    });

    it("throws when updated title exceeds 200 characters", async () => {
      await expect(
        habitService.update(HH, SUB, { id: "habit-1", title: "a".repeat(201) })
      ).rejects.toThrow("Habit title must be 200 characters or less");
    });

    it("throws when updated description exceeds 1000 characters", async () => {
      await expect(
        habitService.update(HH, SUB, {
          id: "habit-1",
          description: "x".repeat(1001),
        })
      ).rejects.toThrow("Habit description must be 1000 characters or less");
    });
  });

  describe("archive", () => {
    it("sets status to archived", async () => {
      const archived = makeHabit({ status: "archived" });
      mockedRepo.update.mockResolvedValue(archived);

      const result = await habitService.archive(HH, SUB, makeHabit());

      expect(mockedRepo.update).toHaveBeenCalledWith(HH, SUB, {
        id: "habit-1",
        status: "archived",
      });
      expect(result.status).toBe("archived");
    });
  });

  describe("reactivate", () => {
    it("sets status to active", async () => {
      const active = makeHabit({ status: "active" });
      mockedRepo.update.mockResolvedValue(active);

      const result = await habitService.reactivate(
        HH,
        SUB,
        makeHabit({ status: "archived" })
      );

      expect(mockedRepo.update).toHaveBeenCalledWith(HH, SUB, {
        id: "habit-1",
        status: "active",
      });
      expect(result.status).toBe("active");
    });
  });

  describe("delete", () => {
    it("delegates to repository", async () => {
      mockedRepo.delete.mockResolvedValue(undefined);

      await habitService.delete(HH, SUB, "habit-1");

      expect(mockedRepo.delete).toHaveBeenCalledWith(HH, SUB, "habit-1");
    });
  });
});
