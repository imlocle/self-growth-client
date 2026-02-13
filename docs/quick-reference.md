# Quick Reference Guide

## Path Aliases

Use these aliases for cleaner imports:

```typescript
// Theme
import { colors, spacing, radius, typography } from "@ui/theme";

// Components
import { Screen, AppButton } from "@ui/components";

// Domain Models
import { IHabit, IToDo, IUserProfile } from "@domain/models";

// Features
import { useHabitListController } from "@features/habits/controllers/useHabitListController";
import { useToDoFormController } from "@features/todos/controllers/useToDoFormController";

// Navigation
import { MainTabs, AuthStack } from "@navigation";

// Auth
import { useAuth, AuthProvider } from "@auth";

// Scope
import { useAppScope, scopedPath } from "@scope";

// Core
import { apiClient, ENV } from "@core";

// Screens
import { LoginScreen } from "@screens/auth/LoginScreen";
```

## Project Structure

```
src/
├── auth/              # Authentication (useAuth, AuthProvider)
├── core/              # Core utilities (apiClient, ENV)
├── domain/            # Domain models (IHabit, IToDo, IUserProfile)
├── features/          # Feature modules
│   ├── habits/        # Habit tracking
│   ├── todos/         # To-do management
│   └── profile/       # User profiles
├── navigation/        # Navigation stacks
├── scope/             # Household/subject scoping
├── screens/           # Screen components
└── ui/                # UI components and theme
```

## Feature Module Pattern

```
feature/
├── components/       # UI components (HabitCard, ToDoItemCard)
├── controllers/      # React hooks (useHabitListController, useHabitFormController)
├── repositories/     # API layer (habitRepository)
├── services/         # Business logic (habitService)
└── index.ts          # Barrel export
```

## Common Commands

```bash
# Development
npm start              # Start Expo dev server
npm run ios            # Run on iOS
npm run android        # Run on Android
npx expo start -c      # Clear cache and start

# Type Checking
npx tsc --noEmit       # Check TypeScript errors

# Installation
npm install            # Install dependencies
```

## Code Standards

### Imports

```typescript
// ✅ Good - Use path aliases
import { colors } from "@ui/theme/colors";

// ❌ Bad - Don't use relative imports
import { colors } from "../../../ui/theme/colors";
```

### Styling

```typescript
// ✅ Good - Use theme tokens
const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
});

// ❌ Bad - Don't hardcode values
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
  },
});
```

### Documentation

````typescript
/**
 * Component description
 *
 * @param props - Component props
 * @returns JSX element
 *
 * @example
 * ```typescript
 * <MyComponent title="Hello" />
 * ```
 */
````

## Theme Tokens

### Colors

```typescript
colors.background; // Main background
colors.surface; // Card/surface background
colors.surfaceAlt; // Alternative surface
colors.primary; // Primary brand color
colors.text; // Primary text
colors.textSoft; // Secondary text
colors.textMuted; // Muted text
colors.border; // Border color
colors.danger; // Error/danger color
```

### Spacing

```typescript
spacing.xs; // 4px
spacing.sm; // 8px
spacing.md; // 16px
spacing.lg; // 24px
spacing.xl; // 32px
spacing.xxl; // 48px
```

### Radius

```typescript
radius.sm; // 4px
radius.md; // 8px
radius.lg; // 12px
radius.xl; // 16px
radius.full; // 9999px (circular)
```

## Data Flow

```
Screen → Controller → Service → Repository → API
                ↓
            React Query Cache
```

## Scoping

All data requires household and subject IDs:

```typescript
const { activeHouseholdId, activeSubjectId } = useAppScope();

// Use in API calls
const habits = await habitService.list(activeHouseholdId, activeSubjectId);
```

## React Query Keys

```typescript
// Habits
["habits", householdId, subjectId][
  // Todos
  ("todos", householdId, subjectId)
][
  // Profile
  ("profile", householdId, subjectId)
];
```

## Common Patterns

### Creating a New Feature

1. Create feature directory structure
2. Add domain models in `src/domain/models/`
3. Create repository for API calls
4. Create service for business logic
5. Create controllers for React hooks
6. Create components for UI
7. Create screens
8. Add to navigation
9. Export from `index.ts`

### Adding a New Screen

1. Create screen component in `src/screens/`
2. Use path aliases for imports
3. Use theme tokens for styling
4. Add JSDoc documentation
5. Add to navigation stack
6. Test TypeScript compilation

### Adding a New Component

1. Create component in appropriate directory
2. Use theme tokens
3. Add TypeScript types
4. Add JSDoc documentation
5. Export from `index.ts`
6. Use path alias when importing

## Troubleshooting

### Import Errors

- Clear Metro cache: `npx expo start -c`
- Restart TypeScript server in IDE
- Verify path alias in `tsconfig.json`

### TypeScript Errors

- Run `npx tsc --noEmit` to see all errors
- Check import paths
- Verify types are exported

### Build Errors

- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Expo cache: `npx expo start -c`
- Verify babel.config.js has module-resolver

## Documentation

- [README.md](../README.md) - Project overview
- [Architecture Overview](./architecture-overview.md) - System architecture
- [Domain Models](./domain-model-and-entities.md) - Data models
- [Development Workflow](./development-workflow.md) - Development process
- [Implementation Roadmap](./implementation-roadmap.md) - Feature roadmap
- [Testing Guide](./testing-guide.md) - Testing strategies
- [UI Components](./ui-components-and-theming.md) - UI documentation
- [Codebase Modernization](./codebase-modernization-summary.md) - Recent updates
- [ToDo Enhancement](./todo-enhancement-summary.md) - ToDo feature updates
- [Habit Implementation](./habit-ui-implementation-summary.md) - Habit feature updates
