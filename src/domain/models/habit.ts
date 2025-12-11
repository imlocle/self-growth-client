import { IBaseEntity } from "./todo";

export interface IHabit extends IBaseEntity {
  title: string;
  counter?: string
  description?: string;
  difficulty?: string;
  status?: string;
  type?: string;
}

export interface IListHabitOutput {
  items: IHabit[]
  lastEvaluatedKey?: string
}

export interface ICreateHabitInput {
  title: string;
  counter?: string
  description?: string;
  difficulty?: string;
  status?: string;
  type?: string;
}

export interface IUpdateHabitInput {
  id: string;
  title?: string;
  counter?: string
  description?: string;
  difficulty?: string;
  status?: string;
  type?: string;
}