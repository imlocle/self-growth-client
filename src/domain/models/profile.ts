/**
 * User Profile Domain Model
 * 
 * Represents application-level identity (separate from Cognito authentication).
 * Does NOT contain householdId or subjectId (users can be members of multiple households).
 * Frontend manages current scope in local storage.
 */

export interface IUserProfile {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  entity?: string;
  dateCreated?: string;
  dateModified?: string;
}

export interface ICreateUserProfileInput {
  username: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface IUpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}
