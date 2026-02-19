/**
 * Household Member Domain Model
 * 
 * Represents access control - links users to households with permissions.
 * Does NOT contain displayName or dob (those belong on HouseholdSubject).
 */

export type HouseholdMemberRole = "owner" | "admin" | "member";

export interface IHouseholdMember {
  householdId: string;
  userId: string;
  role: HouseholdMemberRole;
  entity?: string;
  dateCreated: string;
  dateModified: string;
}

export interface ICreateHouseholdMemberInput {
  userId: string;
  role: HouseholdMemberRole;
}

export interface IListHouseholdMemberOutput {
  items: IHouseholdMember[];
  nextToken?: string;
}
