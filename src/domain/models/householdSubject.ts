/**
 * Household Subject Domain Model
 * 
 * Represents individuals being tracked within a household (self, child, adult, pet).
 * Has todos, habits, and blog posts.
 * created_by_user_id tracks who created this subject (ownership/audit trail).
 */

export type HouseholdSubjectType = "self" | "child" | "adult" | "pet";

export interface IHouseholdSubject {
  id: string;
  householdId: string;
  createdByUserId: string;
  type: HouseholdSubjectType;
  displayName?: string;
  dob?: string; // ISO 8601 date format (YYYY-MM-DD)
  points?: number;
  level?: number;
  dateCreated: string;
  dateModified: string;
}

export interface ICreateHouseholdSubjectInput {
  type: HouseholdSubjectType;
  displayName?: string;
  dob?: string;
}

export interface IUpdateHouseholdSubjectInput {
  id: string;
  type?: HouseholdSubjectType;
  displayName?: string;
  dob?: string;
  points?: number;
  level?: number;
}

export interface IListHouseholdSubjectOutput {
  items: IHouseholdSubject[];
  nextToken?: string;
}

/**
 * UI Constants for Subject Type Selection
 */
export const SUBJECT_TYPE_OPTIONS = [
  { value: "self" as const, label: "Self", description: "Track your own habits and tasks" },
  { value: "child" as const, label: "Child", description: "Track a child's progress" },
  { value: "adult" as const, label: "Adult", description: "Track another adult (parent, partner, etc.)" },
  { value: "pet" as const, label: "Pet", description: "Track a pet's routines" },
];
