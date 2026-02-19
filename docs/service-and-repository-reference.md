<!-- Last Updated: February 19, 2026 -->

# Service and Repository Reference

## Architecture

```
Controller (React Query Hook)  →  Service (Business Logic)  →  Repository (API Calls)  →  API Client (HTTP)
```

## API Client

**Location:** `src/core/network/apiClient.ts`

- Axios instance with `ENV.API_BASE_URL`
- Request interceptor attaches JWT Bearer token from SecureStore
- 10s timeout

## Scope Helpers

**Location:** `src/scope/scopePath.ts`

```typescript
scopedPath("hh-123", "sub-456", "/todos");
// → "/households/hh-123/subjects/sub-456/todos"
```

IDs are URL-encoded automatically.

## Authentication API

**Location:** `src/auth/authApi.ts`

| Method                   | Endpoint             | Description                      |
| ------------------------ | -------------------- | -------------------------------- |
| `signup(payload)`        | `POST /auth/signup`  | Register new user                |
| `confirmSignup(payload)` | `POST /auth/confirm` | Confirm email with code          |
| `login(payload)`         | `POST /auth/login`   | Authenticate, returns JWT tokens |

## Profile

**Repository:** `src/features/profile/repositories/profileRepository.ts`
**Service:** `src/features/profile/services/profileService.ts`

| Method                 | Endpoint                        | Description                                    |
| ---------------------- | ------------------------------- | ---------------------------------------------- |
| `get()`                | `GET /user-profile`             | Get current user profile                       |
| `getOrCreate(payload)` | `GET` then `POST /user-profile` | Get profile, create if 404 (requires username) |
| `create(payload)`      | `POST /user-profile`            | Create profile (requires username)             |
| `update(payload)`      | `PUT /user-profile`             | Update profile                                 |

**Note:** `getOrCreate` requires `ICreateUserProfileInput` (with `username`) — it is not optional.

## Household

**Repository:** `src/features/households/repositories/householdRepository.ts`
**Service:** `src/features/households/services/householdService.ts`
**Controller:** `useHouseholdController`

| Method            | Endpoint                  | Description                                |
| ----------------- | ------------------------- | ------------------------------------------ |
| `list()`          | `GET /households`         | List user's households                     |
| `get(id)`         | `GET /households/{id}`    | Get single household                       |
| `create(payload)` | `POST /households`        | Create household (validates name, max 100) |
| `update(payload)` | `PUT /households/{id}`    | Update household                           |
| `delete(id)`      | `DELETE /households/{id}` | Soft delete (owner only)                   |

## Household Member

**Repository:** `src/features/households/repositories/householdMemberRepository.ts`
**Service:** `src/features/households/services/householdMemberService.ts`
**Controller:** `useHouseholdMemberController`

| Method                    | Endpoint                                   | Description   |
| ------------------------- | ------------------------------------------ | ------------- |
| `list(householdId)`       | `GET /households/{id}/members`             | List members  |
| `add(householdId, input)` | `POST /households/{id}/members`            | Add member    |
| `remove(householdId, id)` | `DELETE /households/{id}/members/{userId}` | Remove member |

## Household Subject

**Repository:** `src/features/households/repositories/householdSubjectRepository.ts`
**Service:** `src/features/households/services/householdSubjectService.ts`
**Controller:** `useHouseholdSubjectController`

| Method                         | Endpoint                                | Description                                  |
| ------------------------------ | --------------------------------------- | -------------------------------------------- |
| `list(householdId)`            | `GET /households/{id}/subjects`         | List subjects                                |
| `get(householdId, id)`         | `GET /households/{id}/subjects/{id}`    | Get single subject                           |
| `create(householdId, payload)` | `POST /households/{id}/subjects`        | Create subject (validates type, displayName) |
| `update(householdId, payload)` | `PUT /households/{id}/subjects/{id}`    | Update subject                               |
| `delete(householdId, id)`      | `DELETE /households/{id}/subjects/{id}` | Soft delete                                  |

**Validation (householdSubjectService):**

- Type required, must be one of: `self`, `child`, `adult`, `pet`
- Display name max 50 chars
- DOB must be YYYY-MM-DD format if provided

## ToDo

**Repository:** `src/features/todos/repositories/todoRepository.ts`
**Service:** `src/features/todos/services/todoService.ts`
**Controllers:** `useToDoListController`, `useToDoFormController`

All methods require `householdId` and `subjectId`.

| Method                           | Endpoint                | Description              |
| -------------------------------- | ----------------------- | ------------------------ |
| `list(hid, sid)`                 | `GET .../todos`         | List all todos           |
| `get(hid, sid, id)`              | `GET .../todos/{id}`    | Get single todo          |
| `create(hid, sid, payload)`      | `POST .../todos`        | Create todo              |
| `update(hid, sid, payload)`      | `PUT .../todos/{id}`    | Update todo              |
| `delete(hid, sid, id)`           | `DELETE .../todos/{id}` | Soft delete              |
| `toggleComplete(hid, sid, todo)` | Service method          | Toggles active/completed |

## Habit

**Repository:** `src/features/habits/repositories/habitRepository.ts`
**Service:** `src/features/habits/services/habitService.ts`
**Controllers:** `useHabitListController`, `useHabitFormController`

All methods require `householdId` and `subjectId`.

| Method                        | Endpoint                 | Description                    |
| ----------------------------- | ------------------------ | ------------------------------ |
| `list(hid, sid)`              | `GET .../habits`         | List all habits                |
| `get(hid, sid, id)`           | `GET .../habits/{id}`    | Get single habit               |
| `create(hid, sid, payload)`   | `POST .../habits`        | Create habit (validates title) |
| `update(hid, sid, payload)`   | `PUT .../habits/{id}`    | Update habit                   |
| `delete(hid, sid, id)`        | `DELETE .../habits/{id}` | Soft delete                    |
| `archive(hid, sid, habit)`    | Service method           | Sets status to "archived"      |
| `reactivate(hid, sid, habit)` | Service method           | Sets status to "active"        |

**Validation (habitService):**

- Title required, max 200 chars
- Description max 1000 chars

## Controllers (React Query Hooks)

Controllers expose data, loading/error states, and mutation functions.

```typescript
const { todos, isLoading, error, toggleComplete, hasScope } =
  useToDoListController();
const { habits, archiveHabit, deleteHabit } = useHabitListController();
const { createHabit, isCreating } = useHabitFormController();
```

**Query keys include scope** for proper cache isolation:

```typescript
queryKey: ["todos", householdId, subjectId];
queryKey: ["habits", householdId, subjectId];
```

Queries are disabled when `hasScope` is false. Mutations invalidate the relevant query key on success.

## Best Practices

1. **Always pass scope explicitly** — no implicit scope
2. **Use typed payloads** — `ICreateToDoInput`, `ICreateHabitInput`, `ICreateHouseholdInput`
3. **Handle loading/error states** in UI
4. **Invalidate queries after mutations** (controllers do this automatically)

## Related Docs

- [Architecture Overview](./architecture-overview.md)
- [Domain Models](./domain-model-and-entities.md)
- [Coding Patterns](./coding-patterns.md)
