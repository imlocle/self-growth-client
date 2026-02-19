<!-- Last Updated: February 19, 2026 -->

# Coding Patterns

## Feature Module Structure

```
features/{name}/
├── components/       # Feature-specific UI components
├── controllers/      # React Query hooks
├── repositories/     # API layer
├── services/         # Business logic
└── index.ts          # Barrel export
```

Both Habits, ToDos, and Households follow this pattern. Profile has repositories and services only (no controllers or components yet).

## Path Aliases

```typescript
import { colors, spacing } from "@ui/theme";
import { AppButton, Card } from "@ui/components";
import { IHabit } from "@domain/models/habit";
import { useHabitListController } from "@features/habits/controllers/useHabitListController";
import { useAppScope } from "@scope/AppScopeContext";
```

Configured in `tsconfig.json` and `babel.config.js` (module-resolver plugin).

## Scoped API Calls

All data operations require explicit scope:

```typescript
const { activeHouseholdId, activeSubjectId } = useAppScope();
todoService.list(activeHouseholdId, activeSubjectId);
```

## React Query for Server State

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["todos", householdId, subjectId],
  queryFn: () => todoService.list(householdId, subjectId),
  enabled: hasScope,
});
```

## Styling with Theme Tokens

```typescript
// Always use theme tokens, never hardcode values
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
});
```

## Component Patterns

Use the design system components (`AppButton`, `Card`, `Badge`, `IconButton`, `Screen`) instead of building custom ones. See [design-system.md](./design-system.md) for full component docs.

## File Naming

- `ToDoScreen.tsx` — PascalCase for components
- `todoService.ts` — camelCase for utilities
- `useToDoListController.ts` — camelCase with `use` prefix for hooks

## Barrel Exports

Each feature and module has an `index.ts`:

```typescript
// src/features/habits/index.ts
export { habitRepository } from "./repositories/habitRepository";
export { habitService } from "./services/habitService";
export { useHabitListController } from "./controllers/useHabitListController";
export { useHabitFormController } from "./controllers/useHabitFormController";
```

## Development Commands

```bash
npm start              # Start Expo dev server
npm run ios            # Run on iOS
npm run android        # Run on Android
npx expo start -c      # Clear cache and start
npx tsc --noEmit       # TypeScript check
npm test               # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

## Security

- Store tokens in SecureStore, never AsyncStorage
- Never log sensitive data (tokens, passwords)
- Use HTTPS only for API_BASE_URL
- Validate all user inputs before API calls

## Performance Tips

- Use `FlatList` with `keyExtractor` for lists
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback`
- Use `React.memo` for pure components
- React Query caching reduces redundant API calls

## Remaining Improvements

- **Token refresh** — Access tokens expire but no automatic refresh exists yet
- **Error handling** — No global error boundary or toast notifications
- **Form validation** — No react-hook-form/zod integration yet
- **Offline support** — No React Query persistence or request queuing
- **Optimistic updates** — Mutations wait for server response before updating UI

## Related Docs

- [Architecture Overview](./architecture-overview.md)
- [Service & Repository Reference](./service-and-repository-reference.md)
- [Testing Guide](./testing-guide.md)
- [Design System](./design-system.md)
