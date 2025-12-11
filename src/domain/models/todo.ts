export interface IBaseEntity {
  id: string;
  dataCreated: string;  // ISO
  dateModified: string;  // ISO
}

export interface IToDo extends IBaseEntity {
  title: string;
  checklist?: string[];
  description?: string;
  dateDue?: string;
  status?: string;
}

export interface IListToDoOutput {
  items: IToDo[]
  lastEvaluatedKey?: string
}

export interface ICreateToDoInput {
  title: string;
  checklist?: string[];
  description?: string;
  dateDue?: string;
  status?: string;
}

export interface IUpdateToDoInput {
  id: string;
  title?: string;
  checklist?: string[];
  description?: string;
  dateDue?: string;
  status?: string;
}