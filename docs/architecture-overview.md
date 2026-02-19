<!-- Last Updated: February 19, 2026 -->

# Architecture Overview

## Technology Stack

### Core Framework

- **React Native** (0.81.5) with **Expo** (~54.0.33)
- **TypeScript** (~5.9.2) with strict mode enabled
- **React** (19.1.0)

### Navigation

- **React Navigation** (v7)
  - Native Stack Navigator for screen transitions
  - Bottom Tabs Navigator for main app navigation
  - Custom tab bar component

### State Management

- **React Query** (@tanstack/react-query v5)
  - Server state management
  - Automatic caching and refetching
- **React Context**
  - Authentication state (AuthContext)
  - App scope state (AppScopeContext)

### Data Persistence

- **Expo SecureStore** — Encrypted storage for tokens, scope IDs, and user profile
- **AsyncStorage** — Local storage for non-sensitive data

### HTTP Client

- **Axios** (v1.13.2) with interceptors for authentication

### Testing

- **Jest** (~29.7.0) with **ts-jest** — Unit testing
- 60 tests across 7 suites (services, auth, scope, theme)

### Design System

- Custom component library (AppButton, Card, Badge, IconButton, Screen)
- Centralized theme tokens (colors, spacing, typography, radius, shadows, animations)
- Calming palette: sage green, serene blue, soft purple

## Architecture Patterns

### Layered Architecture

```
Screens (UI Layer)
    ↓
Controllers (React Query hooks, UI logic)
    ↓
Services (Validation, business logic)
    ↓
Repositories (API calls, data mapping)
    ↓
API Client (HTTP, interceptors)
```

### Key Principles

1. **Separation of Concerns** — Screens render UI, controllers manage state, services hold logic, repositories talk to the API.
2. **Explicit Scope Management** — Every data operation requires User → Household → Subject → Entity. Scope is managed globally via AppScopeContext and persisted in SecureStore.
3. **Type Safety** — TypeScript strict mode, domain model interfaces, no `any` types.
4. **Declarative Data Fetching** — React Query manages all server state with built-in loading/error states.

## Project Structure

```
src/
├── auth/                    # Authentication (AuthContext, authApi, tokenStorage)
├── core/                    # Core infrastructure (apiClient, env config)
├── domain/models/           # Domain models (profile, household, householdMember,
│                            #   householdSubject, habit, todo)
├── features/
│   ├── habits/              # components, controllers, repositories, services
│   ├── households/          # controllers, repositories, services
│   │                        #   (household, householdMember, householdSubject)
│   ├── profile/             # repositories, services
│   └── todos/               # components, controllers, repositories, services
├── navigation/              # AuthStack, MainTabs, ToDoStack, HabitStack, CustomTabBar
├── scope/                   # AppScopeContext, scopePath, useScopedApi
├── screens/
│   ├── auth/                # Login, Signup, ConfirmSignup
│   ├── habits/              # HabitList, CreateHabit, EditHabit, HabitScreen
│   ├── onboarding/          # Welcome, ProfileSetup, HouseholdSetup, OnboardingComplete
│   ├── todos/               # ToDo, CreateToDo, EditToDo
│   └── ProfileScreen.tsx
├── ui/
│   ├── components/          # AppButton, Card, Badge, IconButton, Screen
│   └── theme/               # colors, typography, spacing, radius, shadows, animations
└── __tests__/               # Unit tests (auth, features, scope, ui)
```

## Navigation Flow

```
App.tsx (RootNav)
├── Not authenticated → AuthStack (Signup, Login, ConfirmSignup)
├── Authenticated, missing scope → OnboardingStack
│   ├── No userProfile → Welcome → ProfileSetup → HouseholdSetup → OnboardingComplete
│   └── Has userProfile → HouseholdSetup → OnboardingComplete
└── Fully set up (has householdId + subjectId) → MainTabs
    ├── ToDos tab → ToDoStack (List, Create, Edit)
    ├── Habits tab → HabitStack (List, Create, Edit)
    └── Profile tab → ProfileScreen
```

### Navigation Decision Logic (RootNav)

1. `isAuthLoading || isScopeLoading` → Loading spinner
2. `!isAuthed` → AuthStack
3. `!activeHouseholdId || !activeSubjectId` → OnboardingStack
4. Otherwise → MainTabs

### OnboardingStack Initial Route Logic

- `userProfile` is null → starts at Welcome (brand new user)
- `userProfile` exists → starts at HouseholdSetup (profile already created)
- Uses a React `key` prop tied to profile existence to force re-mount when profile state changes

## Data Flow

### Fetching (e.g., ToDos)

```
ToDoScreen → useToDoListController() → todoService.list() → todoRepository.list() → apiClient.get()
                                                                                         ↓
                                                                              React Query cache
```

### Scope-Aware API Calls

All data endpoints are scoped: `/households/{hid}/subjects/{sid}/todos`

```typescript
const { activeHouseholdId, activeSubjectId } = useAppScope();
todoService.list(activeHouseholdId, activeSubjectId);
```

## Authentication & Scope Bootstrap

### Cold Start (token in SecureStore)

1. `AppScopeProvider` hydrates scope from SecureStore (userProfile, householdId, subjectId)
2. `AuthProvider` checks for access token → if found, sets `isAuthed=true`
3. `AuthProvider` calls `bootstrapScope()` to fetch fresh profile from API
4. `bootstrapScope()` only sets `userProfile` — never touches `activeHouseholdId` or `activeSubjectId`
5. `isLoading` set to `false` only after bootstrap completes
6. RootNav evaluates navigation based on final state

### Login Flow

1. `login()` saves tokens to SecureStore
2. Sets `isAuthed=true`
3. Calls `bootstrapScope()` to fetch profile
4. If profile exists → scope has userProfile, navigation checks household/subject IDs
5. If profile 404 → user goes through full onboarding

### Onboarding Completion

1. HouseholdSetupScreen creates household + "self" subject in one step
2. Passes both IDs to OnboardingCompleteScreen
3. OnboardingCompleteScreen calls `setScope({ activeHouseholdId, activeSubjectId })`
4. RootNav detects both IDs present → switches to MainTabs

## Security

- JWT tokens stored in Expo SecureStore (encrypted)
- Access token attached to requests via Axios interceptor
- Backend validates user access to household/subject
- Frontend enforces scope selection before API calls

## Known Limitations

1. No token refresh flow — access tokens expire, user must re-login
2. No offline support — app requires active internet
3. No push notifications
4. No analytics/error tracking

## Related Docs

- [Domain Models](./domain-model-and-entities.md)
- [Service & Repository Reference](./service-and-repository-reference.md)
- [Coding Patterns](./coding-patterns.md)
- [Design System](./design-system.md)
- [Testing Guide](./testing-guide.md)
