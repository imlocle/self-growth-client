# Domain Model and Entities

## Overview

The Self-Growth app follows a hierarchical ownership model:

```
User (Cognito Identity)
  └── UserProfile (App Identity)
       └── Household (Shared Container)
            └── Subject (Individual Being Tracked)
                 ├── ToDos
                 ├── Habits
                 └── HabitEvents (future)
```

## Core Concepts

### User vs UserProfile

**User (Cognito)**

- Authentication identity
- Managed by AWS Cognito
- Email, password, phone number
- Not directly used in app logic

**UserProfile (Application)**

- Application identity
- Links Cognito user to app data
- Contains household/subject memberships
- Created after signup confirmation

This separation allows:

- Multiple profiles per Cognito user (future)
- Shared device support
- Caregiver permissions (future)

### Household

A shared container representing:

- A family unit
- A couple
- A care group
- A single person's workspace

**Key Properties:**

- `householdId`: Unique identifier
- Members: Users who have access (managed on backend)
- Subjects: Individuals being tracked

**Purpose:**

- Scope data access
- Enable family tracking
- Support caregiver scenarios

### Subject

An individual being tracked within a household:

- Yourself
- Your child
- Your parent
- A dependent

**Key Properties:**

- `subjectId`: Unique identifier
- `householdId`: Parent household
- Name, metadata (managed on backend)

**Purpose:**

- Separate tracking for different people
- Enable "track my child's habits" use case
- Support elderly care scenarios

## Entity Models

### UserProfile

**Location:** `src/domain/models/profile.ts`

```typescript
interface IUserProfile {
  userId: string; // Cognito sub
  firstName?: string;
  lastName?: string;
  defaultHouseholdId?: string; // Future: default selection
  defaultSubjectId?: string; // Future: default selection
}
```

**API Endpoints:**

- `GET /user-profile` - Get current user's profile
- `POST /user-profile` - Create profile after signup
- `PUT /user-profile` - Update profile

**Frontend State:**

- Stored in `AppScopeContext.userProfile`
- Persisted to SecureStore
- Loaded on app start

### ToDo

**Location:** `src/domain/models/todo.ts`

```typescript
interface IToDo extends IBaseEntity {
  title: string;
  checklist?: string[]; // Sub-tasks
  dateDue?: string; // ISO date string
  description?: string;
  difficulty?: Difficulty; // trivial | easy | medium | hard
  status?: ToDoStatus; // active | completed | deleted
}
```

**Base Entity Fields:**

```typescript
interface IBaseEntity {
  id: string;
  dataCreated: string; // ISO timestamp
  dateModified: string; // ISO timestamp
}
```

**Difficulty Levels:**

- `trivial` (1 star) - Quick tasks
- `easy` (2 stars) - Simple tasks
- `medium` (3 stars) - Moderate effort
- `hard` (4 stars) - Significant effort

**Status Lifecycle:**

```
active → completed
  ↓
deleted (soft delete)
```

**API Endpoints:**

- `GET /households/{hid}/subjects/{sid}/todos` - List all
- `GET /households/{hid}/subjects/{sid}/todos/{id}` - Get one
- `POST /households/{hid}/subjects/{sid}/todos` - Create
- `PUT /households/{hid}/subjects/{sid}/todos/{id}` - Update
- `DELETE /households/{hid}/subjects/{sid}/todos/{id}` - Soft delete

**Frontend Usage:**

- Managed by `todoService` and `todoRepository`
- State managed by React Query in `useToDoListController`
- UI in `ToDoScreen` and `ToDoItemCard`

### Habit

**Location:** `src/domain/models/habit.ts`

```typescript
interface IHabit extends IBaseEntity {
  title: string;
  counter?: string; // daily | weekly | monthly
  description?: string;
  difficulty?: string; // trivial | easy | medium | hard
  status?: string; // active | archived | deleted
  type?: string; // build | quit
}
```

**Counter Types:**

- `daily` - Track every day
- `weekly` - Track once per week
- `monthly` - Track once per month

**Habit Types:**

- `build` - Positive habit to develop (e.g., "Exercise daily")
- `quit` - Negative habit to eliminate (e.g., "Stop smoking")

**Status Lifecycle:**

```
active → archived (paused, not deleted)
  ↓
deleted (soft delete)
```

**API Endpoints:**

- `GET /households/{hid}/subjects/{sid}/habits` - List all
- `GET /households/{hid}/subjects/{sid}/habits/{id}` - Get one
- `POST /households/{hid}/subjects/{sid}/habits` - Create
- `PUT /households/{hid}/subjects/{sid}/habits/{id}` - Update
- `DELETE /households/{hid}/subjects/{sid}/habits/{id}` - Soft delete

**Frontend Status:**

- Repository exists but NOT scoped yet (needs update)
- No UI implementation yet
- Planned after ToDo feature is stable

### HabitEvent (Future)

**Purpose:** Log habit occurrences to track consistency

```typescript
interface IHabitEvent {
  id: string;
  householdId: string;
  subjectId: string;
  habitId: string;
  periodKey: string; // Auto-calculated: "2025-01-15" for daily
  status: string; // done | skipped | failed
  note?: string;
  dateCreated: string;
  dateModified: string;
}
```

**Key Concepts:**

- One event per period (enforced by backend)
- Period key calculated from habit counter type
- Idempotent by design (same action = same key)

**API Endpoints:**

- `POST /households/{hid}/subjects/{sid}/habits/{hid}/events` - Log event
- Returns 400 if event already exists for period

**Frontend Status:**

- Not implemented yet
- Next priority after Habits UI is complete

## Scope Management

### AppScope

**Location:** `src/scope/AppScopeContext.tsx`

```typescript
type AppScope = {
  userProfile: UserProfile | null;
  activeHouseholdId: string | null;
  activeSubjectId: string | null;
};
```

**Purpose:**

- Track which household/subject is currently active
- Persist selection across app restarts
- Provide scope to all API calls

**Storage:**

- Persisted to SecureStore
- Keys: `sg_active_household_id`, `sg_active_subject_id`, `sg_user_profile_json`

**Usage Pattern:**

```typescript
const { activeHouseholdId, activeSubjectId } = useAppScope();

// All API calls require scope
todoService.list(activeHouseholdId, activeSubjectId);
```

## Data Validation

### Frontend Validation

**Username:**

- 3-20 characters
- Alphanumeric + underscore only
- Validated on signup

**Email:**

- RFC-compliant format
- Validated on signup

**Phone:**

- 10-15 digits only
- Validated on signup

**Dates:**

- ISO 8601 format (YYYY-MM-DD)
- Validated before API calls

**Difficulty:**

- Must be one of: `trivial`, `easy`, `medium`, `hard`
- Dropdown selection enforces this

**Status Fields:**

- ToDo: `active`, `completed`, `deleted`
- Habit: `active`, `archived`, `deleted`
- HabitEvent: `done`, `skipped`, `failed`

### Backend Validation

Backend performs additional validation:

- Authorization checks (user has access to household/subject)
- Business rule validation
- Data integrity checks

Frontend should still validate to provide immediate feedback.

## Relationships

### User → Household (Many-to-Many)

**Current Implementation:**

- User can belong to multiple households (backend supports)
- Frontend assumes single household for now
- Future: Household selection screen

**Backend Table:**

- `HouseholdMembership` table (not exposed to frontend yet)

### Household → Subject (One-to-Many)

**Current Implementation:**

- Household contains multiple subjects
- Frontend assumes single subject for now
- Future: Subject selection/creation UI

**Backend Table:**

- Subjects have `householdId` foreign key

### Subject → ToDos/Habits (One-to-Many)

**Current Implementation:**

- Each todo/habit belongs to one subject
- Scoped API paths enforce this relationship
- Frontend passes scope to all operations

### Habit → HabitEvents (One-to-Many)

**Future Implementation:**

- Each habit can have many events
- One event per period enforced by backend
- Frontend will display streak/consistency data

## Data Lifecycle

### ToDo Lifecycle

```
1. User creates ToDo (status: active)
2. User toggles completion (status: completed)
3. User can toggle back to active
4. User deletes (status: deleted, soft delete)
```

**Soft Delete:**

- Record remains in database
- Filtered out of list views
- Can be restored (future feature)

### Habit Lifecycle

```
1. User creates Habit (status: active)
2. User logs events regularly
3. User archives when paused (status: archived)
4. User can reactivate
5. User deletes (status: deleted, soft delete)
```

### Profile Lifecycle

```
1. User signs up (Cognito user created)
2. User confirms email
3. User completes onboarding (UserProfile created)
4. Profile persists for app lifetime
```

## Future Enhancements

### Planned Entities

**Household (Full Model)**

- Name, description
- Created date
- Member list with roles

**Subject (Full Model)**

- Name, avatar
- Birth date (for age-appropriate tracking)
- Relationship to user

**HouseholdMembership**

- User → Household relationship
- Role (owner, member, caregiver)
- Permissions

**Reward System**

- Points for completed tasks
- Achievements/badges
- Gamification elements

### Planned Features

**Recurring ToDos**

- Template-based creation
- Auto-generation on schedule

**Habit Streaks**

- Consecutive days tracked
- Longest streak
- Visual streak calendar

**Family Dashboard**

- View all subjects at once
- Aggregate statistics
- Shared goals

**AI Insights**

- Pattern recognition
- Personalized suggestions
- Progress predictions
