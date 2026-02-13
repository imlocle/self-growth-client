# Service and Repository Reference

## Architecture Pattern

The app uses a layered data access pattern:

```
Controller (React Query Hook)
    ↓
Service (Business Logic)
    ↓
Repository (API Calls)
    ↓
API Client (HTTP)
```

## Why This Pattern?

**Separation of Concerns:**

- Controllers manage UI state and user interactions
- Services contain business logic and transformations
- Repositories handle raw API communication
- API Client manages authentication and networking

**Benefits:**

- Easy to test each layer independently
- Business logic reusable across components
- API changes isolated to repository layer
- Type safety enforced at boundaries

## API Client

**Location:** `src/core/network/apiClient.ts`

### Configuration

```typescript
export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
});
```

### Request Interceptor

Automatically attaches JWT token to all requests:

```typescript
apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Format

Backend returns JSON with this structure:

```typescript
// Success
{
  statusCode: 200,
  body: "{\"id\": \"...\", \"title\": \"...\"}"
}

// Error
{
  statusCode: 400,
  body: "{\"error\": \"Invalid input\"}"
}
```

**Note:** Current implementation assumes direct JSON response. May need to parse `body` field if backend format changes.

## Scope Helpers

**Location:** `src/scope/scopePath.ts`

### buildScopePrefix()

Builds the base path for scoped resources:

```typescript
buildScopePrefix(householdId: string, subjectId: string): string

// Example
buildScopePrefix("hh-123", "sub-456")
// Returns: "/households/hh-123/subjects/sub-456"
```

### scopedPath()

Builds complete scoped API path:

```typescript
scopedPath(
  householdId: string,
  subjectId: string,
  relativePath: string
): string

// Example
scopedPath("hh-123", "sub-456", "/todos")
// Returns: "/households/hh-123/subjects/sub-456/todos"

scopedPath("hh-123", "sub-456", "todos/todo-789")
// Returns: "/households/hh-123/subjects/sub-456/todos/todo-789"
```

**URL Encoding:**

- IDs are automatically URL-encoded
- Handles special characters safely

## Authentication API

**Location:** `src/auth/authApi.ts`

### signup()

Register new user account:

```typescript
async function signup(payload: {
  email: string;
  password: string;
  phone_number: string;
  first_name: string;
  last_name: string;
}): Promise<SignupResponse>;
```

**Response:**

```typescript
{
  userSub: string;
  userConfirmed: boolean;
  codeDelivery: {
    deliveryMedium: "EMAIL";
    destination: string;
  }
  message: string;
}
```

**Error Codes:**

- 400: Invalid input (weak password, invalid email)
- 409: Email already exists

### confirmSignup()

Confirm email with verification code:

```typescript
async function confirmSignup(payload: {
  email: string;
  confirmationCode: string;
}): Promise<void>;
```

**Error Codes:**

- 400: Invalid confirmation code
- 404: User not found

### login()

Authenticate and receive tokens:

```typescript
async function login(payload: {
  email: string;
  password: string;
}): Promise<LoginResponse>;
```

**Response:**

```typescript
{
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}
```

**Error Codes:**

- 401: Invalid credentials
- 400: User not confirmed

## Profile Repository

**Location:** `src/features/profile/api/profileRepository.ts`

### get()

Get current user's profile:

```typescript
async get(): Promise<IUserProfile>
```

**Endpoint:** `GET /user-profile`

**Response:**

```typescript
{
  userId: string;
  firstName?: string;
  lastName?: string;
  defaultHouseholdId?: string;
  defaultSubjectId?: string;
}
```

### create()

Create user profile after signup:

```typescript
async create(payload: ICreateUserProfileInput): Promise<IUserProfile>
```

**Endpoint:** `POST /user-profile`

**Payload:**

```typescript
{
  firstName?: string;
  lastName?: string;
}
```

**Error Codes:**

- 400: Invalid input
- 409: Profile already exists

### update()

Update user profile:

```typescript
async update(payload: Partial<IUserProfile>): Promise<IUserProfile>
```

**Endpoint:** `PUT /user-profile`

**Payload:** Any subset of profile fields

## Profile Service

**Location:** `src/features/profile/services/profileService.ts`

**Status:** Not yet implemented

**Planned Methods:**

```typescript
// Get profile with error handling
async getProfile(): Promise<IUserProfile>

// Create profile with validation
async createProfile(input: ICreateUserProfileInput): Promise<IUserProfile>

// Update profile with validation
async updateProfile(updates: Partial<IUserProfile>): Promise<IUserProfile>
```

## ToDo Repository

**Location:** `src/features/todos/repositories/todoRepository.ts`

### list()

Get all todos for a subject:

```typescript
async list(
  householdId: string,
  subjectId: string
): Promise<IListToDoOutput>
```

**Endpoint:** `GET /households/{hid}/subjects/{sid}/todos`

**Query Parameters:**

- `sortBy`: `date_due` or `date_modified` (default: `date_modified`)

**Response:**

```typescript
{
  items: IToDo[];
  lastEvaluatedKey?: string; // For pagination (not used yet)
}
```

### get()

Get single todo by ID:

```typescript
async get(
  householdId: string,
  subjectId: string,
  id: string
): Promise<IToDo>
```

**Endpoint:** `GET /households/{hid}/subjects/{sid}/todos/{id}`

### create()

Create new todo:

```typescript
async create(
  householdId: string,
  subjectId: string,
  payload: ICreateToDoInput
): Promise<IToDo>
```

**Endpoint:** `POST /households/{hid}/subjects/{sid}/todos`

**Payload:**

```typescript
{
  title: string;
  checklist?: string[];
  description?: string;
  difficulty?: string;
  dateDue?: string; // ISO date
}
```

### update()

Update existing todo:

```typescript
async update(
  householdId: string,
  subjectId: string,
  payload: IUpdateToDoInput
): Promise<IToDo>
```

**Endpoint:** `PUT /households/{hid}/subjects/{sid}/todos/{id}`

**Payload:**

```typescript
{
  id: string;
  title?: string;
  checklist?: string[];
  description?: string;
  dateDue?: string;
  difficulty?: string;
  status?: string;
}
```

### delete()

Soft delete todo:

```typescript
async delete(
  householdId: string,
  subjectId: string,
  id: string
): Promise<void>
```

**Endpoint:** `DELETE /households/{hid}/subjects/{sid}/todos/{id}`

**Note:** Backend performs soft delete (sets status to "deleted")

## ToDo Service

**Location:** `src/features/todos/services/todoService.ts`

### list()

Get todos with business logic:

```typescript
async list(
  householdId: string,
  subjectId: string
): Promise<IToDo[]>
```

**Logic:**

- Calls repository.list()
- Extracts items array from response
- Could add filtering/sorting here

### create()

Create todo with validation:

```typescript
async create(
  householdId: string,
  subjectId: string,
  payload: ICreateToDoInput
): Promise<IToDo>
```

**Logic:**

- Could add validation here (e.g., title length)
- Calls repository.create()

### update()

Update todo:

```typescript
async update(
  householdId: string,
  subjectId: string,
  payload: IUpdateToDoInput
): Promise<IToDo>
```

### toggleComplete()

Toggle todo between active and completed:

```typescript
async toggleComplete(
  householdId: string,
  subjectId: string,
  todo: IToDo
): Promise<IToDo>
```

**Logic:**

```typescript
const status = todo.status === "active" ? "completed" : "active";
return repository.update(householdId, subjectId, {
  id: todo.id,
  status: status,
});
```

### delete()

Delete todo:

```typescript
async delete(
  householdId: string,
  subjectId: string,
  id: string
): Promise<void>
```

## Habit Repository

**Location:** `src/features/habits/repositories/habitRepository.ts`

**⚠️ WARNING:** This repository is NOT scoped yet. It needs to be updated to match the ToDo pattern.

### Current Implementation (Incorrect)

```typescript
// ❌ Missing householdId and subjectId parameters
async list(): Promise<IListHabitOutput>
async get(id: string): Promise<IHabit>
async create(payload: ICreateHabitInput): Promise<IHabit>
async update(payload: IUpdateHabitInput): Promise<IHabit>
async delete(id: string): Promise<void>
```

### Required Changes

```typescript
// ✅ Should match ToDo pattern
async list(
  householdId: string,
  subjectId: string
): Promise<IListHabitOutput>

async get(
  householdId: string,
  subjectId: string,
  id: string
): Promise<IHabit>

async create(
  householdId: string,
  subjectId: string,
  payload: ICreateHabitInput
): Promise<IHabit>

async update(
  householdId: string,
  subjectId: string,
  payload: IUpdateHabitInput
): Promise<IHabit>

async delete(
  householdId: string,
  subjectId: string,
  id: string
): Promise<void>
```

**Endpoints should be:**

- `GET /households/{hid}/subjects/{sid}/habits`
- `POST /households/{hid}/subjects/{sid}/habits`
- etc.

## Controllers (React Query Hooks)

### useToDoListController

**Location:** `src/features/todos/controllers/useToDoListController.ts`

Manages todo list state and operations:

```typescript
function useToDoListController() {
  // Returns
  return {
    // Scope
    hasScope: boolean;
    activeHouseholdId: string | null;
    activeSubjectId: string | null;

    // Data
    todos: IToDo[];
    isLoading: boolean;
    error: Error | null;

    // Actions
    refresh: () => void;
    toggleComplete: (todo: IToDo) => void;
    deleteTodo: (id: string) => void;

    // Mutation states
    isToggling: boolean;
    isDeleting: boolean;
  };
}
```

**React Query Configuration:**

```typescript
// Query key includes scope for proper caching
queryKey: ["todos", householdId, subjectId];

// Only fetch when scope exists
enabled: hasScope;

// Mutations invalidate cache on success
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ["todos", householdId, subjectId],
  });
};
```

**Usage in Components:**

```typescript
const {
  todos,
  isLoading,
  toggleComplete,
  hasScope
} = useToDoListController();

if (!hasScope) {
  return <NoScopeMessage />;
}

if (isLoading) {
  return <LoadingSpinner />;
}

return (
  <FlatList
    data={todos}
    renderItem={({ item }) => (
      <ToDoItem
        todo={item}
        onToggle={() => toggleComplete(item)}
      />
    )}
  />
);
```

## Error Handling

### Current Implementation

**Repository Level:**

- Axios throws on non-2xx responses
- Errors bubble up to controller

**Controller Level:**

- React Query captures errors
- Exposed via `error` property

**UI Level:**

- Components check `error` state
- Display error message to user

### Recommended Improvements

**1. Typed Error Responses:**

```typescript
interface ApiError {
  statusCode: number;
  message: string;
  details?: any;
}

// In repository
try {
  const { data } = await apiClient.get(url);
  return data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    throw {
      statusCode: error.response?.status,
      message: error.response?.data?.error || error.message,
      details: error.response?.data,
    } as ApiError;
  }
  throw error;
}
```

**2. Service-Level Error Handling:**

```typescript
// In service
async list(householdId: string, subjectId: string): Promise<IToDo[]> {
  try {
    const response = await todoRepository.list(householdId, subjectId);
    return response.items;
  } catch (error) {
    // Log error, transform message, etc.
    console.error("Failed to fetch todos:", error);
    throw new Error("Unable to load your to-dos. Please try again.");
  }
}
```

**3. Global Error Boundary:**

```typescript
// Catch unhandled errors
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>
```

**4. Toast Notifications:**

```typescript
// Show non-blocking error messages
onError: (error) => {
  Toast.show({
    type: "error",
    text1: "Something went wrong",
    text2: error.message,
  });
};
```

## Testing Strategy

### Repository Tests

```typescript
// Mock axios
jest.mock("../../../core/network/apiClient");

describe("todoRepository", () => {
  it("should fetch todos with correct scope", async () => {
    const mockData = {
      items: [
        /* ... */
      ],
    };
    apiClient.get.mockResolvedValue({ data: mockData });

    const result = await todoRepository.list("hh-1", "sub-1");

    expect(apiClient.get).toHaveBeenCalledWith(
      "/households/hh-1/subjects/sub-1/todos",
    );
    expect(result).toEqual(mockData);
  });
});
```

### Service Tests

```typescript
// Mock repository
jest.mock("../repositories/todoRepository");

describe("todoService", () => {
  it("should toggle todo status", async () => {
    const todo = { id: "1", status: "active" };
    todoRepository.update.mockResolvedValue({ ...todo, status: "completed" });

    const result = await todoService.toggleComplete("hh-1", "sub-1", todo);

    expect(result.status).toBe("completed");
  });
});
```

### Controller Tests

```typescript
// Use React Query testing utilities
import { renderHook, waitFor } from "@testing-library/react-hooks";

describe("useToDoListController", () => {
  it("should fetch todos on mount", async () => {
    const { result } = renderHook(() => useToDoListController());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.todos).toHaveLength(3);
  });
});
```

## Best Practices

### 1. Always Pass Scope

```typescript
// ✅ Good
todoService.list(householdId, subjectId);

// ❌ Bad - scope should not be implicit
todoService.list(); // Where does it get scope from?
```

### 2. Use Type-Safe Payloads

```typescript
// ✅ Good
const payload: ICreateToDoInput = {
  title: "Buy milk",
  difficulty: "easy",
};

// ❌ Bad - no type safety
const payload = {
  title: "Buy milk",
  difficutly: "easy", // Typo not caught
};
```

### 3. Handle Loading States

```typescript
// ✅ Good
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage />;
return <DataView data={todos} />;

// ❌ Bad - no loading feedback
return <DataView data={todos} />;
```

### 4. Invalidate Queries After Mutations

```typescript
// ✅ Good
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["todos", hid, sid] });
};

// ❌ Bad - stale data
onSuccess: () => {
  // Nothing - UI won't update
};
```

### 5. Use Optimistic Updates for Better UX

```typescript
// ✅ Good
onMutate: async (newTodo) => {
  await queryClient.cancelQueries({ queryKey: ["todos"] });
  const previous = queryClient.getQueryData(["todos"]);
  queryClient.setQueryData(["todos"], (old) => [...old, newTodo]);
  return { previous };
},
onError: (err, newTodo, context) => {
  queryClient.setQueryData(["todos"], context.previous);
}
```
