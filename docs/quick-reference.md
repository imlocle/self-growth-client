# Quick Reference Guide

## Common Code Patterns

### Making an API Call

```typescript
// 1. Define model
interface IMyEntity {
  id: string;
  name: string;
}

// 2. Create repository
export const myRepository = {
  async list(householdId: string, subjectId: string) {
    const { data } = await apiClient.get(
      scopedPath(householdId, subjectId, '/my-entities')
    );
    return data;
  }
};

// 3. Create service
export const myService = {
  async list(householdId: string, subjectId: string) {
    return myRepository.list(householdId, subjectId);
  }
};

// 4. Create controller
export function useMyController() {
  const { activeHouseholdId, activeSubjectId } = useAppScope();

  const { data, isLoading } = useQuery({
    queryKey: ['my-entities', activeHouseholdId, activeSubjectId],
    queryFn: () => myService.list(activeHouseholdId!, activeSubjectId!),
    enabled: !!activeHouseholdId && !!activeSubjectId
  });

  return { items: data ?? [], isLoading };
}

// 5. Use in component
function MyScreen() {
  const { items, isLoading } = useMyController();

  if (isLoading) return <LoadingSpinner />;

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}
```

### Creating a Form

```typescript
function CreateItemScreen() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await myService.create(householdId, subjectId, { title });
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to create');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        error={error}
      />
      <AppButton
        title="Save"
        onPress={handleSubmit}
        disabled={isLoading}
      />
    </Screen>
  );
}
```

### Using Mutations

```typescript
function useMyMutations() {
  const queryClient = useQueryClient();
  const { activeHouseholdId, activeSubjectId } = useAppScope();

  const createMutation = useMutation({
    mutationFn: (data: ICreateInput) =>
      myService.create(activeHouseholdId!, activeSubjectId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-entities", activeHouseholdId, activeSubjectId],
      });
    },
  });

  return {
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
```

### Navigation

```typescript
// Navigate to screen
navigation.navigate("ScreenName");

// Navigate with params
navigation.navigate("EditItem", { item });

// Go back
navigation.goBack();

// Replace current screen
navigation.replace("ScreenName");

// Reset navigation stack
navigation.reset({
  index: 0,
  routes: [{ name: "Home" }],
});
```

### Styling

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
  },
});
```

## File Templates

### Repository Template

```typescript
// src/features/{feature}/repositories/{feature}Repository.ts
import { apiClient } from "../../../core/network/apiClient";
import { scopedPath } from "../../../scope/scopePath";
import {
  IEntity,
  ICreateInput,
  IUpdateInput,
} from "../../../domain/models/{feature}";

export const entityRepository = {
  async list(householdId: string, subjectId: string) {
    const { data } = await apiClient.get(
      scopedPath(householdId, subjectId, "/entities"),
    );
    return data;
  },

  async get(householdId: string, subjectId: string, id: string) {
    const { data } = await apiClient.get(
      scopedPath(householdId, subjectId, `/entities/${id}`),
    );
    return data;
  },

  async create(householdId: string, subjectId: string, payload: ICreateInput) {
    const { data } = await apiClient.post(
      scopedPath(householdId, subjectId, "/entities"),
      payload,
    );
    return data;
  },

  async update(householdId: string, subjectId: string, payload: IUpdateInput) {
    const { id, ...rest } = payload;
    const { data } = await apiClient.put(
      scopedPath(householdId, subjectId, `/entities/${id}`),
      rest,
    );
    return data;
  },

  async delete(householdId: string, subjectId: string, id: string) {
    await apiClient.delete(
      scopedPath(householdId, subjectId, `/entities/${id}`),
    );
  },
};
```

### Service Template

```typescript
// src/features/{feature}/services/{feature}Service.ts
import { entityRepository } from "../repositories/{feature}Repository";
import {
  IEntity,
  ICreateInput,
  IUpdateInput,
} from "../../../domain/models/{feature}";

export const entityService = {
  async list(householdId: string, subjectId: string): Promise<IEntity[]> {
    const response = await entityRepository.list(householdId, subjectId);
    return response.items;
  },

  async create(
    householdId: string,
    subjectId: string,
    payload: ICreateInput,
  ): Promise<IEntity> {
    // Add validation here
    return entityRepository.create(householdId, subjectId, payload);
  },

  async update(
    householdId: string,
    subjectId: string,
    payload: IUpdateInput,
  ): Promise<IEntity> {
    return entityRepository.update(householdId, subjectId, payload);
  },

  async delete(
    householdId: string,
    subjectId: string,
    id: string,
  ): Promise<void> {
    return entityRepository.delete(householdId, subjectId, id);
  },
};
```

### Controller Template

```typescript
// src/features/{feature}/controllers/use{Feature}Controller.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { entityService } from "../services/{feature}Service";
import { useAppScope } from "../../../scope/AppScopeContext";

export function useEntityController() {
  const queryClient = useQueryClient();
  const { activeHouseholdId, activeSubjectId } = useAppScope();

  const hasScope = !!activeHouseholdId && !!activeSubjectId;

  const { data, isLoading, error } = useQuery({
    queryKey: ["entities", activeHouseholdId, activeSubjectId],
    queryFn: () => entityService.list(activeHouseholdId!, activeSubjectId!),
    enabled: hasScope,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      entityService.delete(activeHouseholdId!, activeSubjectId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["entities", activeHouseholdId, activeSubjectId],
      });
    },
  });

  return {
    entities: data ?? [],
    isLoading,
    error,
    hasScope,
    deleteEntity: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
```

### Screen Template

```typescript
// src/screens/{feature}/{Feature}Screen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Screen } from '../../ui/components/Screen';
import { LoadingSpinner } from '../../ui/components/LoadingSpinner';
import { EmptyState } from '../../ui/components/EmptyState';
import { ErrorMessage } from '../../ui/components/ErrorMessage';
import { useEntityController } from '../../features/{feature}/controllers/use{Feature}Controller';
import { colors } from '../../ui/theme/colors';
import { spacing } from '../../ui/theme/spacing';
import { typography } from '../../ui/theme/typography';

export function EntityScreen() {
  const { entities, isLoading, error, hasScope } = useEntityController();

  if (!hasScope) {
    return (
      <Screen>
        <Text style={styles.message}>No scope selected</Text>
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen>
        <LoadingSpinner text="Loading..." />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ErrorMessage message="Failed to load data" />
      </Screen>
    );
  }

  if (entities.length === 0) {
    return (
      <Screen>
        <EmptyState
          icon="document-outline"
          title="No Items Yet"
          message="Create your first item to get started"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={entities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  message: {
    color: colors.textSoft,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  item: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
  },
  itemText: {
    color: colors.text,
    fontSize: 16,
  }
});
```

## Cheat Sheet

### Import Paths

```typescript
// Theme
import { colors } from "@/ui/theme/colors";
import { spacing } from "@/ui/theme/spacing";
import { typography } from "@/ui/theme/typography";
import { radius } from "@/ui/theme/radius";

// Components
import { Screen } from "@/ui/components/Screen";
import { AppButton } from "@/ui/components/AppButton";

// Scope
import { useAppScope } from "@/scope/AppScopeContext";
import { scopedPath } from "@/scope/scopePath";

// Auth
import { useAuth } from "@/auth/AuthContext";

// Navigation
import { useNavigation } from "@react-navigation/native";

// React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
```

### Common Hooks

```typescript
// Scope
const { activeHouseholdId, activeSubjectId, setActiveHousehold } =
  useAppScope();

// Auth
const { isAuthed, login, logout } = useAuth();

// Navigation
const navigation = useNavigation();

// Query
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["key"],
  queryFn: fetchData,
});

// Mutation
const mutation = useMutation({
  mutationFn: updateData,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["key"] }),
});
```

### Theme Values

```typescript
// Colors
colors.background; // #020617
colors.surface; // #111827
colors.primary; // #22c55e
colors.text; // #f9fafb
colors.textMuted; // #9ca3af
colors.danger; // #f97373

// Spacing
spacing.xs; // 4
spacing.sm; // 8
spacing.md; // 12
spacing.lg; // 16
spacing.xl; // 24
spacing.xxl; // 32

// Radius
radius.sm; // 4
radius.md; // 8
radius.lg; // 12
radius.xl; // 16
radius.full; // 9999
```

### TypeScript Types

```typescript
// Component Props
interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Navigation Types
type StackParamList = {
  Home: undefined;
  Details: { id: string };
};

type ScreenProps = NativeStackNavigationProp<StackParamList, "Home">;

// API Types
interface IEntity {
  id: string;
  name: string;
  dateCreated: string;
  dateModified: string;
}

interface ICreateInput {
  name: string;
}

interface IUpdateInput {
  id: string;
  name?: string;
}
```

### Useful Commands

```bash
# Start dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Clear cache
expo start -c

# Type check
npx tsc --noEmit

# Install package
npm install package-name

# Remove package
npm uninstall package-name
```

### Git Commands

```bash
# Create branch
git checkout -b feature/my-feature

# Stage changes
git add .

# Commit
git commit -m "feat: Add new feature"

# Push
git push origin feature/my-feature

# Pull latest
git pull origin main

# Merge main into branch
git merge main
```

### Debugging

```typescript
// Console logging
console.log("Value:", value);
console.error("Error:", error);
console.warn("Warning:", warning);

// React Query DevTools
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Network logging
apiClient.interceptors.request.use((config) => {
  console.log("Request:", config.method, config.url);
  return config;
});
```

## Common Errors and Solutions

### Error: "No scope selected"

**Solution:** Ensure household and subject are set in AppScopeContext

### Error: "Network request failed"

**Solution:** Check API_BASE_URL, verify backend is running, check token

### Error: "Cannot read property 'navigate' of undefined"

**Solution:** Ensure component is inside NavigationContainer, use useNavigation hook

### Error: "Invariant Violation: requireNativeComponent"

**Solution:** Clear cache with `expo start -c`, reinstall dependencies

### Error: "Unable to resolve module"

**Solution:** Check import path, ensure file exists, restart bundler

### Warning: "Can't perform a React state update on an unmounted component"

**Solution:** Clean up subscriptions in useEffect, check async operations

## Performance Tips

1. **Use FlatList for long lists** (not ScrollView)
2. **Memoize expensive computations** (useMemo)
3. **Memoize callbacks** (useCallback)
4. **Use React.memo for components** that don't change often
5. **Optimize images** (use appropriate sizes)
6. **Lazy load screens** (React Navigation does this by default)
7. **Avoid inline styles** (use StyleSheet.create)
8. **Use key prop correctly** in lists

## Security Checklist

- [ ] Use SecureStore for sensitive data
- [ ] Never log tokens or passwords
- [ ] Use HTTPS for API calls
- [ ] Validate all user inputs
- [ ] Sanitize data before display
- [ ] Use proper authentication
- [ ] Handle errors gracefully
- [ ] Don't expose sensitive info in error messages
