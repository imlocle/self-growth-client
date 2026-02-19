<!-- Last Updated: February 19, 2026 -->

# Known Bugs

## Backend

### Lambda Import Error

**Status:** Open
**Error:** `Runtime.ImportModuleError: Unable to import module 'handlers.auth.login': No module named 'src'`
**Context:** Backend Lambda deployment issue. Not a frontend problem. The Lambda handler can't resolve the `src` module — likely a packaging/path issue in the deployment artifact.

## Frontend

### Onboarding Flow — Redirected to WelcomeScreen After Login

**Status:** Fixed (February 19, 2026)
**Issue:** After logging in with an existing profile, the app showed WelcomeScreen instead of HouseholdSetupScreen. Profile data was fetched successfully but the navigation still started at Welcome.
**Root Cause:** Two bugs:

1. `bootstrapScope()` in AuthContext was calling `setScope({ userProfile, activeHouseholdId: null, activeSubjectId: null })` — the explicit `null` values wiped any previously-saved household/subject IDs from SecureStore on every login.
2. On cold app start, the `useEffect` checked for a token but never called `bootstrapScope()`, so `userProfile` was null when OnboardingStack mounted. Since `initialRouteName` in React Navigation only takes effect on first render, it locked to "Welcome".
   **Fix:**

- `bootstrapScope()` now only calls `setUserProfile(profile)` — never touches household/subject IDs.
- Cold start `useEffect` now calls `bootstrapScope()` before setting `isLoading=false`.
- Added `key` prop to `Stack.Navigator` in OnboardingStack tied to `hasProfile` to force re-mount when profile state changes.
  **Files Modified:** `src/auth/AuthContext.tsx`, `src/screens/onboarding/OnboardingStack.tsx`

### Onboarding Flow — Navigated Back to Create Account After ProfileSetup

**Status:** Fixed (February 18, 2026)
**Issue:** After creating a profile during onboarding, the app navigated back to the Create Account screen instead of proceeding to HouseholdSetup. Console showed `Bootstrap scope failed: [AxiosError: Request failed with status code 400]`.
**Root Cause:** `bootstrapScope()` was calling `setScope()` with `activeHouseholdId: null` which triggered a 400 error from the API, and the error handling caused navigation to reset.
**Fix:** Updated `bootstrapScope()` to only set `userProfile` and not touch scope IDs. Updated OnboardingStack to determine initial route based on `userProfile` existence.
**Files Modified:** `src/auth/AuthContext.tsx`, `src/screens/onboarding/OnboardingStack.tsx`

### DEV Lines Clearing Tokens on Every App Start

**Status:** Fixed (February 18, 2026)
**Issue:** The DEV-only `clearTokens()` and `clearScope()` lines in AuthContext were uncommented, causing all tokens and scope to be wiped on every app start. Users appeared logged out after every restart.
**Fix:** Re-commented the DEV lines.
**Files Modified:** `src/auth/AuthContext.tsx`

### ConfirmSignup Navigation Issue

**Status:** Fixed (February 16, 2026)
**Issue:** After successful email confirmation, the app wasn't navigating to onboarding screens.
**Root Cause:** `AuthContext.confirmAndLogin()` was calling `setIsAuthed(true)` AFTER `bootstrapScope()`. If `bootstrapScope()` threw an error or took time, the user stayed on ConfirmSignupScreen.
**Fix:** Moved `setIsAuthed(true)` to execute BEFORE `bootstrapScope()`, wrapped `bootstrapScope()` in try-catch.
**Files Modified:** `src/auth/AuthContext.tsx`

---

No other known bugs at this time. If you find one, add it here with:

- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Relevant file paths
- Status (Open / In Progress / Fixed)
