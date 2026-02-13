# Coding Patterns and Improvements

## Current Patterns

### 1. Feature Module Structure

Each feature follows this structure:

```
features/
└── todos/
    ├── components/       # Feature-specific UI components
    ├── controllers/      # React Query hooks
    ├── repositories/     # API layer
    └── services/         # Business logic
```

**Benefits:**

- Clear separation of concerns
- Easy to locate related code
- Scalable as features grow

### 2. Scoped API Calls

All data operations require explicit scope:

```typescript
// ✅ Correct pattern
todoService.list(householdId, subjectId);

// ❌ Avoid implicit scope
todoService.list(); // Where does scope come from?
```

**Why:**

- Explicit ownership
- No hidden dependencies
- Backend can validate access

### 3. React Query for Server State

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["todos", householdId, subjectId],
  queryFn: () => todoService.list(householdId, subjectId),
  enabled: hasScope,
});
```

**Benefits:**

- Automatic caching
- Background refetching
- Loading/error states built-in
- Optimistic updates support

### 4. Context for Global State

```typescript
// Authentication state
const { isAuthed, login, logout } = useAuth();

// Scope state
const { activeHouseholdId, activeSubjectId } = useAppScope();
```

**Benefits:**

- Avoid prop drilling
- Single source of truth
- Persistent across navigation

## Critical Issues to Fix

### 1. Habit Repository Not Scoped

**Problem:**

```typescript
// ❌ Current implementation
habitRepository.list();
habitRepository.create(payload);
```

**Solution:**

```typescript
// ✅ Should be
habitRepository.list(householdId, subjectId);
habitRepository.create(householdId, subjectId, payload);
```

**Files to Update:**

- `src/features/habits/repositories/habitRepository.ts`
- Any habit service that uses it (when created)

### 2. Missing Onboarding Flow

**Problem:**

- After signup confirmation, user is logged in but has no profile
- No household/subject created
- App shows "No scope selected" message

**Solution:**
Create onboarding flow:

```typescript
// OnboardingScreen.tsx
1. Welcome screen
2. Create profile (first name, last name)
3. Create household (auto-create or let user name it)
4. Create subject (yourself)
5. Set scope in AppScopeContext
6. Navigate to main app
```

**Files to Create:**

- `src/screens/onboarding/OnboardingScreen.tsx`
- `src/screens/onboarding/CreateProfileStep.tsx`
- `src/screens/onboarding/CreateHouseholdStep.tsx`

### 3. No Household/Subject Management

**Problem:**

- Users can't create households
- Users can't create subjects
- Users can't switch between households/subjects

**Solution:**

**Phase 1: Auto-create on first login**

```typescript
// After login, check if user has profile
const profile = await profileRepository.get();

if (!profile) {
  // Navigate to onboarding
  navigation.navigate("Onboarding");
} else if (!profile.defaultHouseholdId) {
  // Auto-create household and subject
  const household = await householdRepository.create({
    name: `${profile.firstName}'s Household`,
  });
  const subject = await subjectRepository.create(household.id, {
    name: profile.firstName,
  });
  // Set scope
  await setScope({
    activeHouseholdId: household.id,
    activeSubjectId: subject.id,
  });
}
```

**Phase 2: Selection UI**

```typescript
// HouseholdSelectScreen.tsx
- List user's households
- Allow selection
- Persist to AppScopeContext

// SubjectSelectScreen.tsx
- List household's subjects
- Allow selection
- Persist to AppScopeContext
```

### 4. No Error Handling Strategy

**Problem:**

- Errors shown as raw messages
- No retry mechanism
- No offline handling

**Solution:**

**A. Create Error Boundary**

```typescript
// src/ui/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error tracking service
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

**B. Add Toast Notifications**

```typescript
// Install: react-native-toast-message
import Toast from "react-native-toast-message";

// In mutation
onError: (error) => {
  Toast.show({
    type: "error",
    text1: "Failed to save",
    text2: error.message,
    position: "bottom",
  });
};
```

**C. Add Retry Logic**

```typescript
// In React Query config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

**D. Network Error Detection**

```typescript
// src/core/network/networkStatus.ts
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });
    return unsubscribe;
  }, []);

  return isOnline;
}

// In screens
const isOnline = useNetworkStatus();
if (!isOnline) {
  return <OfflineMessage />;
}
```

### 5. No Token Refresh Logic

**Problem:**

- Access tokens expire after 24 hours
- No automatic refresh
- User forced to re-login

**Solution:**

```typescript
// src/auth/tokenRefresh.ts
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const response = await axios.post(`${ENV.API_BASE_URL}/auth/refresh`, {
    refreshToken,
  });

  const { accessToken } = response.data;
  await saveTokens({ accessToken, refreshToken });
  return accessToken;
}

// In apiClient interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        await logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
```

### 6. Missing Form Validation

**Problem:**

- No client-side validation
- Users see backend errors only
- Poor UX

**Solution:**

**Install validation library:**

```bash
npm install react-hook-form zod @hookform/resolvers
```

**Create validation schemas:**

```typescript
// src/features/todos/validation/todoSchema.ts
import { z } from "zod";

export const createToDoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  difficulty: z.enum(["trivial", "easy", "medium", "hard"]).optional(),
  dateDue: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional(),
});
```

**Use in forms:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function CreateToDoScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createToDoSchema)
  });

  const onSubmit = (data) => {
    createTodo(data);
  };

  return (
    <Controller
      control={control}
      name="title"
      render={({ field }) => (
        <>
          <TextInput {...field} />
          {errors.title && <Text>{errors.title.message}</Text>}
        </>
      )}
    />
  );
}
```

## Recommended Improvements

### 1. Add Loading Skeletons

Instead of blank screens while loading:

```typescript
// src/ui/components/ToDoSkeleton.tsx
export function ToDoSkeleton() {
  return (
    <View style={styles.skeleton}>
      <View style={styles.skeletonCircle} />
      <View style={styles.skeletonLine} />
    </View>
  );
}

// In ToDoScreen
if (isLoading) {
  return (
    <Screen>
      <ToDoSkeleton />
      <ToDoSkeleton />
      <ToDoSkeleton />
    </Screen>
  );
}
```

### 2. Add Pull-to-Refresh

```typescript
// In ToDoScreen
const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await refetch();
  setRefreshing(false);
};

return (
  <FlatList
    data={todos}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  />
);
```

### 3. Add Optimistic Updates

```typescript
// In useToDoListController
const toggleMutation = useMutation({
  mutationFn: (todo: IToDo) =>
    todoService.toggleComplete(householdId!, subjectId!, todo),

  // Optimistically update UI before API call
  onMutate: async (todo) => {
    await queryClient.cancelQueries({ queryKey: todosKey });

    const previousTodos = queryClient.getQueryData(todosKey);

    queryClient.setQueryData(todosKey, (old: IToDo[]) =>
      old.map((t) =>
        t.id === todo.id
          ? { ...t, status: t.status === "active" ? "completed" : "active" }
          : t,
      ),
    );

    return { previousTodos };
  },

  // Rollback on error
  onError: (err, todo, context) => {
    queryClient.setQueryData(todosKey, context.previousTodos);
  },

  // Refetch to ensure consistency
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: todosKey });
  },
});
```

### 4. Add Pagination

```typescript
// In useToDoListController
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
} = useInfiniteQuery({
  queryKey: todosKey,
  queryFn: ({ pageParam = null }) =>
    todoService.list(householdId!, subjectId!, pageParam),
  getNextPageParam: (lastPage) => lastPage.lastEvaluatedKey
});

// In ToDoScreen
<FlatList
  data={data?.pages.flatMap(page => page.items)}
  onEndReached={() => hasNextPage && fetchNextPage()}
  onEndReachedThreshold={0.5}
  ListFooterComponent={
    isFetchingNextPage ? <ActivityIndicator /> : null
  }
/>
```

### 5. Add Search/Filter

```typescript
// In useToDoListController
const [searchQuery, setSearchQuery] = useState("");
const [filterStatus, setFilterStatus] = useState<ToDoStatus | "all">("all");

const filteredTodos = useMemo(() => {
  let result = todos;

  if (searchQuery) {
    result = result.filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  if (filterStatus !== "all") {
    result = result.filter((todo) => todo.status === filterStatus);
  }

  return result;
}, [todos, searchQuery, filterStatus]);

return {
  todos: filteredTodos,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
};
```

### 6. Add Swipe Actions

```typescript
// Install: react-native-gesture-handler
import Swipeable from 'react-native-gesture-handler/Swipeable';

function ToDoItemCard({ todo, onDelete, onToggle }) {
  const renderRightActions = () => (
    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
      <Text>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.card}>
        {/* Todo content */}
      </View>
    </Swipeable>
  );
}
```

### 7. Add Animations

```typescript
// Install: react-native-reanimated (already installed)
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

function ToDoItemCard({ todo }) {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.card}
    >
      {/* Content */}
    </Animated.View>
  );
}
```

### 8. Add Empty States

```typescript
// src/ui/components/EmptyState.tsx
export function EmptyState({ icon, title, message, action }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action && (
        <AppButton title={action.label} onPress={action.onPress} />
      )}
    </View>
  );
}

// In ToDoScreen
if (todos.length === 0) {
  return (
    <EmptyState
      icon="checkbox-outline"
      title="No To-Dos Yet"
      message="Create your first to-do to get started"
      action={{
        label: "Create To-Do",
        onPress: () => navigation.navigate('CreateToDo')
      }}
    />
  );
}
```

### 9. Add Confirmation Dialogs

```typescript
// src/ui/components/ConfirmDialog.tsx
export function ConfirmDialog({ visible, title, message, onConfirm, onCancel }) {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <AppButton title="Cancel" onPress={onCancel} />
            <AppButton title="Confirm" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Usage
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

<ConfirmDialog
  visible={showDeleteConfirm}
  title="Delete To-Do?"
  message="This action cannot be undone."
  onConfirm={() => {
    deleteTodo(todo.id);
    setShowDeleteConfirm(false);
  }}
  onCancel={() => setShowDeleteConfirm(false)}
/>
```

### 10. Add Offline Queue

```typescript
// src/core/network/offlineQueue.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

interface QueuedRequest {
  id: string;
  method: string;
  url: string;
  data: any;
  timestamp: number;
}

export async function queueRequest(request: QueuedRequest) {
  const queue = await getQueue();
  queue.push(request);
  await AsyncStorage.setItem("offline_queue", JSON.stringify(queue));
}

export async function processQueue() {
  const queue = await getQueue();

  for (const request of queue) {
    try {
      await apiClient.request({
        method: request.method,
        url: request.url,
        data: request.data,
      });
      // Remove from queue on success
      await removeFromQueue(request.id);
    } catch (error) {
      // Keep in queue, will retry later
      console.error("Failed to process queued request:", error);
    }
  }
}

// In App.tsx
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      processQueue();
    }
  });
  return unsubscribe;
}, []);
```

## Code Organization Best Practices

### 1. Consistent File Naming

```
✅ Good:
- ToDoScreen.tsx (PascalCase for components)
- todoService.ts (camelCase for utilities)
- useToDos.ts (camelCase with 'use' prefix for hooks)

❌ Avoid:
- todo-screen.tsx (kebab-case)
- TodoService.ts (inconsistent)
```

### 2. Barrel Exports

```typescript
// src/features/todos/index.ts
export { todoService } from "./services/todoService";
export { todoRepository } from "./repositories/todoRepository";
export { useToDoListController } from "./controllers/useToDoListController";
export * from "./components";

// Usage
import { todoService, useToDoListController } from "@/features/todos";
```

### 3. Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/features/*": ["src/features/*"],
      "@/ui/*": ["src/ui/*"]
    }
  }
}

// Usage
import { AppButton } from '@/ui/components/AppButton';
import { todoService } from '@/features/todos';
```

### 4. Separate Business Logic from UI

```typescript
// ✅ Good: Logic in hook
function useToDoForm() {
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { title, setTitle, errors, validate };
}

// UI component stays simple
function CreateToDoScreen() {
  const { title, setTitle, errors, validate } = useToDoForm();
  // ...
}

// ❌ Bad: Logic mixed with UI
function CreateToDoScreen() {
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  // Validation logic here...
  // Form submission logic here...
  // API calls here...
}
```

### 5. Use TypeScript Strictly

```typescript
// ✅ Good: Explicit types
interface Props {
  todo: IToDo;
  onPress: (id: string) => void;
}

function ToDoItem({ todo, onPress }: Props) {
  // ...
}

// ❌ Bad: Any types
function ToDoItem({ todo, onPress }: any) {
  // ...
}
```

## Performance Optimization

### 1. Memoize Expensive Computations

```typescript
const sortedTodos = useMemo(() => {
  return todos.sort(
    (a, b) => new Date(a.dateDue).getTime() - new Date(b.dateDue).getTime(),
  );
}, [todos]);
```

### 2. Memoize Callbacks

```typescript
const handleToggle = useCallback(
  (todo: IToDo) => {
    toggleComplete(todo);
  },
  [toggleComplete],
);
```

### 3. Use React.memo for Components

```typescript
export const ToDoItemCard = React.memo(
  ({ todo, onToggle, onPress }) => {
    // ...
  },
  (prevProps, nextProps) => {
    return (
      prevProps.todo.id === nextProps.todo.id &&
      prevProps.todo.status === nextProps.todo.status
    );
  },
);
```

### 4. Optimize FlatList

```typescript
<FlatList
  data={todos}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={10}
/>
```

## Security Best Practices

### 1. Never Log Sensitive Data

```typescript
// ❌ Bad
console.log("User token:", accessToken);

// ✅ Good
console.log("User authenticated");
```

### 2. Validate All Inputs

```typescript
// ✅ Good
const sanitizedTitle = title.trim().slice(0, 200);
```

### 3. Use HTTPS Only

```typescript
// ✅ Good
API_BASE_URL: "https://api.example.com";

// ❌ Bad
API_BASE_URL: "http://api.example.com";
```

### 4. Secure Storage for Tokens

```typescript
// ✅ Good: Using SecureStore
await SecureStore.setItemAsync("access_token", token);

// ❌ Bad: Using AsyncStorage
await AsyncStorage.setItem("access_token", token);
```
