/**
 * Household Domain Model
 * 
 * Represents a shared container (family, couple, individual workspace).
 * All data is scoped under a household.
 */

export interface IHousehold {
  id: string;
  name: string;
  ownerUserId: string;
  entity?: string;
  dateCreated: string;
  dateModified: string;
}

export interface ICreateHouseholdInput {
  name: string;
}

export interface IUpdateHouseholdInput {
  id: string;
  name?: string;
}

export interface IListHouseholdOutput {
  items: IHousehold[];
  nextToken?: string;
}
