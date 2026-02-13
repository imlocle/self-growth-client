# Implementation Roadmap

## Overview

This document outlines the tasks needed to complete the Self-Growth frontend application to match the backend API capabilities.

## Current Status

### ✅ Completed

- Authentication (signup, login, logout)
- Token storage with SecureStore
- Scope management context
- ToDo CRUD operations (fully scoped)
- Basic UI components and theme system
- Navigation structure
- API client with interceptors

### 🔄 In Progress

- Habit repository scoping
- Code documentation and standardization

### ❌ Not Started

- Onboarding flow
- Household/subject management
- Habit UI screens
- Habit events
- Error handling improvements
- Form validation
- Token refresh
- Offline support
- Testing

## Phase 1: Core Functionality (High Priority)

### 1.1 Fix Habit Repository ✅ (Complete)

**Status:** Complete
**Time Spent:** 1 hour

**Tasks:**

- [x] Update habitRepository.ts to use scoped paths
- [x] Add householdId and subjectId parameters to all methods
- [x] Update API endpoints to match backend
- [x] Add JSDoc documentation
- [x] Standardize code style

**Files Updated:**

- `src/features/habits/repositories/habitRepository.ts`

**Acceptance Criteria:**

- All methods accept householdId and subjectId ✅
- API paths use scopedPath helper ✅
- Matches ToDo repository pattern ✅
- Well-documented with JSDoc ✅

---

### 1.2 Create Habit Service ✅ (Complete)

**Status:** Complete
**Time Spent:** 45 minutes

**Tasks:**

- [x] Create `src/features/habits/services/habitService.ts`
- [x] Implement list, get, create, update, delete methods
- [x] Add business logic and validation
- [x] Add archive and reactivate convenience methods
- [x] Add JSDoc documentation

**Files Created:**

- `src/features/habits/services/habitService.ts`

**Dependencies:**

- Habit repository must be fixed first ✅

**Acceptance Criteria:**

- Service layer handles business logic ✅
- Validation for required fields ✅
- Error handling with meaningful messages ✅
- Follows ToDo service pattern ✅

---

### 1.3 Create Habit Controller ✅ (Complete)

**Status:** Complete
**Time Spent:** 1 hour

**Tasks:**

- [x] Create `src/features/habits/controllers/useHabitListController.ts`
- [x] Create `src/features/habits/controllers/useHabitFormController.ts`
- [x] Implement React Query hooks for list, create, update, delete
- [x] Add scope awareness
- [x] Handle loading and error states
- [x] Create barrel export file

**Files Created:**

- `src/features/habits/controllers/useHabitListController.ts`
- `src/features/habits/controllers/useHabitFormController.ts`
- `src/features/habits/index.ts`

**Dependencies:**

- Habit service must be created ✅

**Acceptance Criteria:**

- React Query integration ✅
- Proper cache invalidation ✅
- Scope-aware queries ✅
- Loading/error states exposed ✅

**Dependencies:**

- Habit service must be created

**Acceptance Criteria:**

- React Query integration
- Proper cache invalidation
- Scope-aware queries
- Loading/error states exposed

---

### 1.4 Implement Onboarding Flow

**Status:** Not Started
**Estimated Time:** 4-6 hours

**Tasks:**

- [ ] Create household domain model
- [ ] Create subject domain model
- [ ] Create household repository
- [ ] Create subject repository
- [ ] Create onboarding screens:
  - [ ] WelcomeScreen
  - [ ] CreateProfileScreen
  - [ ] CreateHouseholdScreen
  - [ ] CreateSubjectScreen
- [ ] Create OnboardingNavigator
- [ ] Update RootNavigator to check profile status
- [ ] Add profile check on first login

**Files to Create:**

- `src/domain/models/household.ts`
- `src/domain/models/subject.ts`
- `src/features/household/repositories/householdRepository.ts`
- `src/features/subject/repositories/subjectRepository.ts`
- `src/screens/onboarding/WelcomeScreen.tsx`
- `src/screens/onboarding/CreateProfileScreen.tsx`
- `src/screens/onboarding/CreateHouseholdScreen.tsx`
- `src/screens/onboarding/CreateSubjectScreen.tsx`
- `src/screens/onboarding/OnboardingNavigator.tsx`

**Files to Update:**

- `src/navigation/RootNavigator.tsx`

**Acceptance Criteria:**

- New users guided through profile/household/subject creation
- Scope automatically set after onboarding
- Smooth navigation flow
- Error handling for API failures
- Data persists to AppScopeContext

---

### 1.5 Add Error Handling System

**Status:** Not Started
**Estimated Time:** 3-4 hours

**Tasks:**

- [ ] Install react-native-toast-message
- [ ] Create ErrorBoundary component
- [ ] Create Toast configuration
- [ ] Add error interceptor to apiClient
- [ ] Update all mutations to show toast on error
- [ ] Add retry logic to React Query
- [ ] Create network status hook
- [ ] Add offline detection

**Files to Create:**

- `src/ui/components/ErrorBoundary.tsx`
- `src/ui/components/Toast.tsx`
- `src/core/network/networkStatus.ts`

**Files to Update:**

- `src/core/network/apiClient.ts`
- `App.tsx` (wrap with ErrorBoundary)
- All controller hooks (add error handling)

**Acceptance Criteria:**

- Global error boundary catches unhandled errors
- Toast notifications for user-facing errors
- Network errors detected and displayed
- Retry mechanism for failed requests
- Graceful degradation when offline

---

### 1.6 Add Form Validation

**Status:** Not Started
**Estimated Time:** 3-4 hours

**Tasks:**

- [ ] Install react-hook-form and zod
- [ ] Create validation schemas for:
  - [ ] ToDo creation/editing
  - [ ] Habit creation/editing
  - [ ] Profile creation
  - [ ] Household creation
  - [ ] Subject creation
- [ ] Create reusable form components
- [ ] Update all form screens to use validation

**Files to Create:**

- `src/features/todos/validation/todoSchema.ts`
- `src/features/habits/validation/habitSchema.ts`
- `src/features/profile/validation/profileSchema.ts`
- `src/ui/components/FormInput.tsx`
- `src/ui/components/FormSelect.tsx`

**Files to Update:**

- `src/screens/todos/CreateToDoScreen.tsx`
- `src/screens/todos/EditToDoScreen.tsx`
- All other form screens

**Acceptance Criteria:**

- Client-side validation before API calls
- Clear error messages
- Real-time validation feedback
- Consistent validation across all forms

---

## Phase 2: Habit Management (Medium Priority)

### 2.1 Create Habit UI Components

**Status:** Not Started
**Estimated Time:** 2-3 hours

**Tasks:**

- [ ] Create HabitCard component
- [ ] Add habit difficulty display
- [ ] Add habit type (build/quit) indicator
- [ ] Add habit counter display
- [ ] Add habit status visual states

**Files to Create:**

- `src/features/habits/components/HabitCard.tsx`

**Acceptance Criteria:**

- Displays all habit information
- Visual distinction for build vs quit habits
- Shows counter type (daily/weekly/monthly)
- Tap to edit functionality

---

### 2.2 Create Habit Screens

**Status:** Not Started
**Estimated Time:** 4-5 hours

**Tasks:**

- [ ] Create HabitListScreen
- [ ] Create CreateHabitScreen
- [ ] Create EditHabitScreen
- [ ] Add navigation stack for habits
- [ ] Add FAB button for creating habits

**Files to Create:**

- `src/screens/habits/HabitListScreen.tsx`
- `src/screens/habits/CreateHabitScreen.tsx`
- `src/screens/habits/EditHabitScreen.tsx`
- `src/navigation/HabitStack.tsx`

**Files to Update:**

- `src/navigation/MainTabs.tsx` (update Habits tab)

**Acceptance Criteria:**

- List displays all habits
- Create/edit forms with validation
- Delete functionality with confirmation
- Loading and error states
- Empty state when no habits

---

### 2.3 Implement Habit Events (Future)

**Status:** Not Started
**Estimated Time:** 6-8 hours

**Tasks:**

- [ ] Create habit event domain model
- [ ] Create habit event repository
- [ ] Create habit event service
- [ ] Create habit event controller
- [ ] Add "Log Event" button to habit cards
- [ ] Create event logging modal
- [ ] Display streak information
- [ ] Create calendar view for events

**Dependencies:**

- Backend habit events API must be complete

**Acceptance Criteria:**

- Users can log habit occurrences
- One event per period enforced
- Streak calculation displayed
- Visual calendar showing completed days

---

## Phase 3: Enhanced UX (Medium Priority)

### 3.1 Add Missing UI Components

**Status:** Not Started
**Estimated Time:** 4-5 hours

**Tasks:**

- [ ] Create TextInput component
- [ ] Create Modal component
- [ ] Create LoadingSpinner component
- [ ] Create EmptyState component
- [ ] Create ErrorMessage component
- [ ] Create ConfirmDialog component
- [ ] Create Select/Dropdown component
- [ ] Create DatePicker component

**Files to Create:**

- `src/ui/components/TextInput.tsx`
- `src/ui/components/Modal.tsx`
- `src/ui/components/LoadingSpinner.tsx`
- `src/ui/components/EmptyState.tsx`
- `src/ui/components/ErrorMessage.tsx`
- `src/ui/components/ConfirmDialog.tsx`
- `src/ui/components/Select.tsx`
- `src/ui/components/DatePicker.tsx`

**Acceptance Criteria:**

- All components follow design system
- Accessible with proper labels
- Reusable across features
- Well-documented with JSDoc

---

### 3.2 Implement Scope Selection UI

**Status:** Not Started
**Estimated Time:** 3-4 hours

**Tasks:**

- [ ] Create SubjectDropdown component
- [ ] Create HouseholdSelectScreen
- [ ] Add subject switcher to header
- [ ] Add household management to ProfileScreen
- [ ] Handle scope changes gracefully

**Files to Create:**

- `src/ui/components/SubjectDropdown.tsx`
- `src/screens/settings/HouseholdSelectScreen.tsx`

**Files to Update:**

- `src/screens/ProfileScreen.tsx`
- `src/navigation/MainTabs.tsx` (add dropdown to header)

**Acceptance Criteria:**

- Easy switching between subjects
- Household selection available
- Scope changes invalidate queries
- Visual indication of active subject

---

### 3.3 Add Token Refresh Logic

**Status:** Not Started
**Estimated Time:** 2-3 hours

**Tasks:**

- [ ] Create token refresh function
- [ ] Add response interceptor for 401 errors
- [ ] Implement automatic token refresh
- [ ] Handle refresh token expiration
- [ ] Add token expiration tracking

**Files to Create:**

- `src/auth/tokenRefresh.ts`

**Files to Update:**

- `src/core/network/apiClient.ts`
- `src/auth/AuthContext.tsx`

**Acceptance Criteria:**

- Tokens automatically refresh before expiration
- Failed refresh logs user out
- No duplicate refresh requests
- Seamless user experience

---

### 3.4 Implement Offline Support

**Status:** Not Started
**Estimated Time:** 6-8 hours

**Tasks:**

- [ ] Install React Query persistence plugin
- [ ] Configure AsyncStorage for cache
- [ ] Create offline request queue
- [ ] Add network status detection
- [ ] Implement sync strategy
- [ ] Add offline indicator UI
- [ ] Handle conflicts on sync

**Files to Create:**

- `src/core/network/offlineQueue.ts`
- `src/core/network/networkStatus.ts`
- `src/ui/components/OfflineIndicator.tsx`

**Files to Update:**

- `App.tsx` (configure persistence)
- All mutation hooks (add to queue when offline)

**Acceptance Criteria:**

- App works offline with cached data
- Mutations queued when offline
- Automatic sync when online
- User notified of offline status
- Conflict resolution strategy

---

### 3.5 Add UX Enhancements

**Status:** Not Started
**Estimated Time:** 4-6 hours

**Tasks:**

- [ ] Add loading skeletons
- [ ] Add pull-to-refresh
- [ ] Add optimistic updates
- [ ] Add swipe actions for delete
- [ ] Add animations (fade in/out)
- [ ] Add search/filter functionality
- [ ] Add sorting options
- [ ] Add pagination for large lists

**Files to Update:**

- All list screens
- All controller hooks

**Acceptance Criteria:**

- Smooth loading transitions
- Instant feedback on actions
- Intuitive gestures
- Performant with large datasets

---

## Phase 4: Quality & Testing (Low Priority)

### 4.1 Set Up Testing Infrastructure

**Status:** Not Started
**Estimated Time:** 3-4 hours

**Tasks:**

- [ ] Install testing dependencies
- [ ] Configure Jest
- [ ] Set up testing utilities
- [ ] Create test helpers
- [ ] Add test scripts to package.json

**Files to Create:**

- `jest.config.js`
- `jest.setup.js`
- `src/test/testUtils.tsx`

**Acceptance Criteria:**

- Tests can run successfully
- Mocks configured for Expo modules
- Test coverage reporting enabled

---

### 4.2 Write Unit Tests

**Status:** Not Started
**Estimated Time:** 8-10 hours

**Tasks:**

- [ ] Test all services
- [ ] Test all repositories
- [ ] Test utility functions
- [ ] Test custom hooks
- [ ] Achieve 70%+ coverage

**Acceptance Criteria:**

- All services have tests
- All repositories have tests
- Edge cases covered
- 70%+ code coverage

---

### 4.3 Write Integration Tests

**Status:** Not Started
**Estimated Time:** 6-8 hours

**Tasks:**

- [ ] Test context providers
- [ ] Test navigation flows
- [ ] Test form submissions
- [ ] Test API interactions

**Acceptance Criteria:**

- Critical flows tested
- Context providers tested
- Navigation tested

---

### 4.4 Write E2E Tests

**Status:** Not Started
**Estimated Time:** 8-10 hours

**Tasks:**

- [ ] Set up Detox
- [ ] Test authentication flow
- [ ] Test onboarding flow
- [ ] Test todo CRUD
- [ ] Test habit CRUD

**Acceptance Criteria:**

- Critical user journeys tested
- Tests run in CI/CD
- Stable and reliable tests

---

## Phase 5: Polish & Optimization (Low Priority)

### 5.1 Performance Optimization

**Status:** Not Started
**Estimated Time:** 4-6 hours

**Tasks:**

- [ ] Add memoization where needed
- [ ] Optimize FlatList rendering
- [ ] Implement code splitting
- [ ] Optimize images
- [ ] Add performance monitoring

**Acceptance Criteria:**

- Smooth 60fps scrolling
- Fast app startup
- Efficient memory usage

---

### 5.2 Accessibility Improvements

**Status:** Not Started
**Estimated Time:** 3-4 hours

**Tasks:**

- [ ] Add accessibility labels
- [ ] Test with screen readers
- [ ] Ensure proper focus management
- [ ] Add keyboard navigation
- [ ] Verify color contrast

**Acceptance Criteria:**

- Screen reader compatible
- WCAG AA compliant
- Keyboard accessible

---

### 5.3 Analytics & Monitoring

**Status:** Not Started
**Estimated Time:** 3-4 hours

**Tasks:**

- [ ] Add Firebase Analytics
- [ ] Add error tracking (Sentry)
- [ ] Add performance monitoring
- [ ] Track key user actions

**Acceptance Criteria:**

- User behavior tracked
- Errors logged to Sentry
- Performance metrics collected

---

## Timeline Estimates

### Phase 1: Core Functionality

**Total Time:** 15-20 hours
**Priority:** HIGH
**Target:** Complete first

### Phase 2: Habit Management

**Total Time:** 12-16 hours
**Priority:** MEDIUM
**Target:** Complete second

### Phase 3: Enhanced UX

**Total Time:** 19-27 hours
**Priority:** MEDIUM
**Target:** Complete third

### Phase 4: Quality & Testing

**Total Time:** 25-32 hours
**Priority:** LOW
**Target:** Ongoing

### Phase 5: Polish & Optimization

**Total Time:** 10-14 hours
**Priority:** LOW
**Target:** Before launch

**Grand Total:** 81-109 hours

## Success Metrics

### Phase 1 Complete When:

- [ ] Users can complete onboarding
- [ ] Habits fully functional (CRUD)
- [ ] Errors handled gracefully
- [ ] Forms validated properly

### Phase 2 Complete When:

- [ ] Habit UI matches ToDo quality
- [ ] Users can manage habits easily
- [ ] Habit events can be logged

### Phase 3 Complete When:

- [ ] App works offline
- [ ] UX feels polished
- [ ] Tokens refresh automatically
- [ ] Scope switching is smooth

### Phase 4 Complete When:

- [ ] 70%+ test coverage
- [ ] Critical flows tested
- [ ] CI/CD running tests

### Phase 5 Complete When:

- [ ] App performs smoothly
- [ ] Accessible to all users
- [ ] Monitoring in place

## Notes

- Each task includes estimated time for planning purposes
- Dependencies are clearly marked
- Acceptance criteria ensure quality
- Phases can be worked on in parallel where dependencies allow
- Testing should be added incrementally, not all at once
- This is a living document - update as priorities change

## Current Focus

**Week 1:**

1. ✅ Fix Habit Repository
2. Create Habit Service
3. Create Habit Controller
4. Start Onboarding Flow

**Week 2:**

1. Complete Onboarding Flow
2. Add Error Handling System
3. Add Form Validation

**Week 3:**

1. Create Habit UI Components
2. Create Habit Screens
3. Implement Scope Selection UI

---

**Last Updated:** February 2025
**Next Review:** After Phase 1 completion
