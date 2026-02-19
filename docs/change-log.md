<!-- Last Updated: February 19, 2026 -->

# Change Log

## February 19, 2026

### Onboarding Flow Fix — WelcomeScreen Redirect Bug

- Fixed `bootstrapScope()` in AuthContext — was wiping `activeHouseholdId` and `activeSubjectId` by explicitly setting them to `null` on every login. Now only sets `userProfile`.
- Added `bootstrapScope()` call on cold app start (when token exists in SecureStore) so `userProfile` is populated before navigation renders.
- `AuthContext.useEffect` now waits for `bootstrapScope()` to complete before setting `isLoading=false`.
- Added `key` prop to `Stack.Navigator` in OnboardingStack tied to `hasProfile` boolean — forces React Navigation to re-mount and re-evaluate `initialRouteName` when profile state changes.
- Added docstrings throughout `AuthContext.tsx` and `OnboardingStack.tsx`.

### Onboarding Flow Simplification

- Combined HouseholdSetup and SubjectSetup into a single step: `HouseholdSetupScreen` now creates both the household AND a "self" subject, then passes both IDs to `OnboardingCompleteScreen`.
- Removed `SubjectSetupScreen` from `OnboardingStack` (file still exists but is unused).
- Updated `OnboardingCompleteScreen` to receive `{ householdId, subjectId }` params and call `setScope()` on finish.
- Updated `OnboardingParamList` type — removed `SubjectSetup` route, changed `OnboardingComplete` params.
- Onboarding is now 4 screens: Welcome → ProfileSetup → HouseholdSetup → OnboardingComplete.
- Removed debug `console.log` and `console.error` from `householdSubjectService.ts`.

### DEV Lines Fix

- Re-commented `clearTokens()` and `clearScope()` DEV-only lines in `AuthContext.tsx` that were causing tokens/scope to be wiped on every app start.

## February 18, 2026

### Domain Model Refactor to Match Backend API

- Refactored all domain models to match backend `api-reference.md`:
  - `IUserProfile`: Removed `userId`, `householdId`, `subjectId`. Added `id`, `username`, `entity`, `dateCreated`, `dateModified`. Removed `email`.
  - `IBaseEntity` in `todo.ts`: Fixed typo `dataCreated` → `dateCreated`, added `householdId` and `subjectId` fields.
  - `IHouseholdMember`: Changed `dateJoined` → `dateCreated`, added `entity` field.
  - `IHouseholdSubject`: Added `entity` field.
  - `IHousehold`: Added `entity` field.
- Added username `TextInput` to `ProfileSetupScreen`.
- Updated `AppScopeContext` to use `IUserProfile` instead of custom `UserProfile` type.
- Updated `AuthContext.bootstrapScope()` to only GET profile (not create).
- Updated `profileService.getOrCreate()` to require `ICreateUserProfileInput` (not optional).

### Household/Member/Subject Features Implementation

- Created domain models for Household, HouseholdMember, and HouseholdSubject.
- Implemented repositories for all three entities following existing patterns.
- Implemented services with validation for all three entities.
- Implemented React Query controllers for all three entities.
- Updated `HouseholdSetupScreen` to use `householdService`.
- Updated `SubjectSetupScreen` to use `householdSubjectService`.

### Field Naming Clarification

- Renamed all occurrences of `defaultHouseholdId` and `defaultSubjectId` to `householdId` and `subjectId`.

### Package Updates for Expo 54 Compatibility

- Updated `@types/jest` to 29.5.14
- Updated `react-native-worklets` to 0.5.1
- Updated `react-test-renderer` to 19.1.0 (to match react@19.1.0)
- Updated `expo` to ~54.0.33
- Updated `babel-preset-expo` to ~54.0.10
- Updated `jest` to ~29.7.0

### Bug Fixes

- Fixed ConfirmSignup navigation — moved `setIsAuthed(true)` before `bootstrapScope()`.
- Fixed onboarding navigation — app was going back to Create Account after ProfileSetup.

### Documentation Overhaul

- Audited and consolidated all docs in `/docs`.
- Removed 19 stale/redundant docs.
- Updated remaining docs with current project state.
- Added timestamps to all docs.
- Created `change-log.md`, `suggestions-improvements.md`, `bugs.md`.
- Created `fe-project-context.md` and `fe-source-of-truth.md` for backend team.

## February 16, 2026

### Bug Fix: ConfirmSignup Navigation

- Fixed issue where successful email confirmation didn't navigate to onboarding.
- Moved `setIsAuthed(true)` to execute before `bootstrapScope()` in AuthContext.
- Added try-catch around `bootstrapScope()` to prevent blocking navigation.

### Documentation Overhaul

- Audited and consolidated all docs in `/docs`.
- Removed 19 stale/redundant docs (one-time summaries, outdated roadmaps, duplicate design guides).
- Updated remaining docs with current project state.
- Added timestamps to all docs.
- Created `change-log.md`, `suggestions-improvements.md`, `bugs.md`.
- Updated root `README.md` with unit test instructions.

## February 2026 (Earlier)

### Unit Testing Setup

- Installed Jest ~29.7.0, ts-jest, @testing-library/react-native.
- Configured jest.config.js with ts-jest (Node environment) and path aliases.
- Created 7 test suites, 60 tests — all passing.
- Test coverage: services (habit, todo, profile), auth (authApi, tokenStorage), scope (scopePath), theme (colors, typography, spacing, shadows).
- Added npm scripts: `test`, `test:watch`, `test:coverage`.

### Onboarding Feature

- Built onboarding flow: Welcome → ProfileSetup → HouseholdSetup → OnboardingComplete.
- Each screen has elegant copy, info cards, and inspirational quotes.
- Shared `OnboardingLayout` component with step indicators.
- Updated `App.tsx` RootNav to conditionally show AuthStack, OnboardingStack, or MainTabs.

### Design System Overhaul

- Replaced bright green (#22c55e) with sage green (#7fb069).
- Added serene blue (#6b9bd1) and soft purple (#a78bca).
- Created comprehensive theme: colors, typography (ADHD-friendly line heights), spacing, shadows, animations, radius.
- Created components: Card (3 variants), Badge (6 variants), IconButton (4 variants).
- Enhanced AppButton (5 variants, 3 sizes, loading state) and Screen (scrollable, noPadding).
- Updated HabitCard and ToDoItemCard with new design system.

## February 2025

### Initial Codebase Modernization

- Added TypeScript path aliases (@auth, @core, @domain, @features, @navigation, @scope, @screens, @ui).
- Created barrel exports (index.ts) for all modules.

### Habit Feature Complete

- Fixed habit repository scoping (all methods now require householdId/subjectId).
- Created habitService with validation, controllers, screens, and HabitStack navigator.

### ToDo Feature Enhancement

- Created useToDoFormController, enhanced ToDoItemCard and all ToDo screens.

### Domain Model Improvements

- Added union types and UI constants for habits and todos.
- Comprehensive JSDoc documentation on all models.

### Core Infrastructure

- Enhanced apiClient, env config, tokenStorage, scopePath with JSDoc.
- Profile service with getOrCreate pattern.
