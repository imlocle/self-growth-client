export interface IBaseEntity {
  id: string;
  dataCreated: string;  // ISO
  dateModified: string;  // ISO
}

export type ToDoStatus = "active" | "completed" | "deleted";
export type Difficulty = "trivial" | "easy" | "medium" | "hard";
export const DIFFICULTY_OPTIONS: { key: Difficulty; label: string; stars: number }[] = [
  { key: "trivial", label: "Trivial", stars: 1 },
  { key: "easy", label: "Easy", stars: 2 },
  { key: "medium", label: "Medium", stars: 3 },
  { key: "hard", label: "Hard", stars: 4 },
];

export interface IToDo extends IBaseEntity {
  title: string;
  checklist?: string[];
  dateDue?: string;
  description?: string;
  difficulty?: string
  status?: ToDoStatus;
}

export interface IListToDoOutput {
  items: IToDo[]
  lastEvaluatedKey?: string
}

export interface ICreateToDoInput {
  title: string;
  checklist?: string[];
  description?: string;
  difficulty?: string;
  dateDue?: string;
}

export interface IUpdateToDoInput {
  id: string;
  title?: string;
  checklist?: string[];
  description?: string;
  dateDue?: string;
  difficulty?: string;
  status?: string;
}