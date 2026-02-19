<!-- Last Updated: February 19, 2026 -->

# Domain Model and Entities

## Ownership Hierarchy

```
User (Cognito Identity)
  └── UserProfile (App Identity)
       ├── HouseholdMember (Access Control) → Household
       │       ↓
       │       HouseholdSubject (Tracked Individual)
       │           ↓
       │           Todos, Habits, BlogPosts
       │
       └── HouseholdMember → Another Household
               ↓
               HouseholdSubject
                   ↓
                   Todos, Habits, BlogPosts
```

## Core Concepts

### User vs UserProfile

- **User (Cognito)** — Authentication identity managed by AWS Cognito (email, password).
- **UserProfile** — Application identity linking Cognito user to app data. Created during onboarding.
- **Does NOT contain** `householdId` or `subjectId` (users can be members of multiple households).
- **Does NOT contain** `email` (managed by Cognito, not the app layer).

### Household

A shared container (family, couple, individual workspace). All data is scoped under a household.

### HouseholdMember

Access control entity that links users to households with permissions (owner, admin, member).

- Does NOT contain `displayName` or `dob` (those belong on HouseholdSubject).
- Represents WHO can access the household.

### HouseholdSubject

An individual being tracked within a household (self, child, adult, pet). Each subject has their own habits and todos.

- Contains `displayName` and `dob` for the tracked individual.
- Has `createdByUserId` field tracking who created this subject (set from JWT by backend).
- Represents the individual being tracked (has todos, habits, blogs).

## Entity Models

### UserProfile

**Location:** `src/domain/models/profile.ts`

```typescript
interface IUserProfile {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  entity?: string;
  dateCreated?: string;
  dateModified?: string;
}

interface ICreateUserProfileInput {
  username: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

interface IUpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}
```

**API:** `GET /user-profile` · `POST /user-profile` · `PUT /user-profile`

**Important:** UserProfile does NOT contain `householdId`, `subjectId`, or `email`. Users can be members of multiple households. The frontend manages the "current scope" (selected household and subject) in SecureStore.

### Household

**Location:** `src/domain/models/household.ts`

```typescript
interface IHousehold {
  id: string;
  name: string;
  ownerUserId: string;
  entity?: string;
  dateCreated: string;
  dateModified: string;
}

interface ICreateHouseholdInput {
  name: string;
}
```

**API:** `GET /households` · `GET /households/{id}` · `POST /households` · `PUT /households/{id}` · `DELETE /households/{id}`

**Backend Behavior:** When a user creates a household, the backend automatically creates a HouseholdMember record linking the user to the household with role `owner`.

### HouseholdMember

**Location:** `src/domain/models/householdMember.ts`

```typescript
type HouseholdMemberRole = "owner" | "admin" | "member";

interface IHouseholdMember {
  householdId: string;
  userId: string;
  role: HouseholdMemberRole;
  entity?: string;
  dateCreated: string;
  dateModified: string;
}
```

**API:** `GET /households/{id}/members` · `POST /households/{id}/members` · `DELETE /households/{id}/members/{userId}`

**Important:** HouseholdMember represents access control (who can access the household). It does NOT contain `displayName` or `dob` (those belong on HouseholdSubject).

### HouseholdSubject

**Location:** `src/domain/models/householdSubject.ts`

```typescript
type HouseholdSubjectType = "self" | "child" | "adult" | "pet";

interface IHouseholdSubject {
  id: string;
  householdId: string;
  createdByUserId: string;
  type: HouseholdSubjectType;
  displayName?: string;
  dob?: string; // ISO 8601 (YYYY-MM-DD)
  points?: number;
  level?: number;
  dateCreated: string;
  dateModified: string;
}
```

**API:** `GET /households/{id}/subjects` · `GET /households/{id}/subjects/{id}` · `POST /households/{id}/subjects` · `PUT /households/{id}/subjects/{id}` · `DELETE /households/{id}/subjects/{id}`

**Important:**

- `createdByUserId` is automatically set from the authenticated user's token.
- HouseholdSubject represents the tracked individual (has todos, habits, blogs).
- `displayName` and `dob` are stored here (not on HouseholdMember).
- UI constants: `SUBJECT_TYPE_OPTIONS` provides labels and descriptions for type selection.

### IBaseEntity (shared by ToDo and Habit)

**Location:** `src/domain/models/todo.ts`

```typescript
interface IBaseEntity {
  id: string;
  householdId: string;
  subjectId: string;
  dateCreated: string;
  dateModified: string;
}
```

### ToDo

**Location:** `src/domain/models/todo.ts`

```typescript
interface IToDo extends IBaseEntity {
  title: string;
  checklist?: string[];
  dateDue?: string;
  description?: string;
  difficulty?: Difficulty; // "trivial" | "easy" | "medium" | "hard"
  status?: ToDoStatus; // "active" | "completed" | "deleted"
}
```

**API:** Scoped under `/households/{hid}/subjects/{sid}/todos`

### Habit

**Location:** `src/domain/models/habit.ts`

```typescript
interface IHabit extends IBaseEntity {
  title: string;
  counter?: HabitCounter; // "daily" | "weekly" | "monthly"
  description?: string;
  difficulty?: HabitDifficulty; // "trivial" | "easy" | "medium" | "hard"
  status?: HabitStatus; // "active" | "archived" | "deleted"
  type?: HabitType; // "build" | "quit"
}
```

**API:** Scoped under `/households/{hid}/subjects/{sid}/habits`

**UI Constants:** `HABIT_DIFFICULTY_OPTIONS`, `HABIT_COUNTER_OPTIONS`, `HABIT_TYPE_OPTIONS` provide labels and metadata for dropdowns.

### HabitEvent (Future)

```typescript
interface IHabitEvent {
  id: string;
  habitId: string;
  periodKey: string; // e.g., "2025-01-15" for daily
  status: string; // "done" | "skipped" | "failed"
  note?: string;
}
```

One event per period, enforced by backend. Not yet implemented on frontend.

## Scope Management

**Location:** `src/scope/AppScopeContext.tsx`

```typescript
const { activeHouseholdId, activeSubjectId } = useAppScope();
todoService.list(activeHouseholdId, activeSubjectId);
```

Scope is persisted to SecureStore and restored on app launch. All repositories require explicit `householdId` and `subjectId` parameters.

### Scope Storage Keys

- `sg_active_household_id` — Currently selected household
- `sg_active_subject_id` — Currently selected subject
- `sg_user_profile_json` — Cached user profile

## Onboarding Flow

New users go through a 4-screen onboarding after first login:

1. **Welcome** — Introduction with Lao Tzu quote
2. **ProfileSetup** — Username, first name, last name
3. **HouseholdSetup** — Create household AND "self" subject in one step
4. **OnboardingComplete** — Sets scope (householdId + subjectId) and transitions to MainTabs

Returning users who already have a profile but no household skip directly to HouseholdSetup.

## Data Lifecycle

### ToDo: `active → completed ↔ active → deleted (soft)`

### Habit: `active → archived ↔ active → deleted (soft)`

Soft deletes keep records in the database but filter them from list views.

## Related Docs

- [Architecture Overview](./architecture-overview.md)
- [Service & Repository Reference](./service-and-repository-reference.md)
