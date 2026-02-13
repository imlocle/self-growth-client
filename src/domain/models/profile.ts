export interface IUserProfile {
  userId: string;
  firstName?: string;
  lastName?: string;

  defaultHouseholdId?: string;
  defaultSubjectId?: string;
}

export interface ICreateUserProfileInput {
  firstName?: string;
  lastName?: string;
}
