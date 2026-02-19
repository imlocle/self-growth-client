# Self Growth App

A React Native mobile application for personal growth tracking, built with Expo and TypeScript.

## Features

- **Habit Tracking**: Create, track, and manage daily/weekly/monthly habits
- **To-Do Management**: Organize tasks with checklists, due dates, and difficulty levels
- **User Profiles**: Personalized user profiles with household and subject scoping
- **Household Management**: Multi-user households with member roles and subject tracking
- **Authentication**: Secure login and signup with JWT tokens via AWS Cognito
- **Onboarding**: 4-screen guided setup (Welcome → Profile → Household → Complete)

## Tech Stack

- **Framework**: React Native (0.81.5) with Expo (~54.0.33)
- **Language**: TypeScript (~5.9.2)
- **State Management**: React Query (TanStack Query v5), React Context
- **Navigation**: React Navigation v7
- **Styling**: StyleSheet with theme tokens
- **API Client**: Axios (v1.13.2)
- **Storage**: Expo SecureStore (tokens, scope, profile)
- **Testing**: Jest (~29.7.0) with ts-jest

## Project Structure

```
src/
├── auth/              # Authentication (AuthContext, authApi, tokenStorage)
├── core/              # Core utilities (API client, env config)
├── domain/models/     # Domain models (profile, household, householdMember,
│                      #   householdSubject, habit, todo)
├── features/
│   ├── habits/        # components, controllers, repositories, services
│   ├── households/    # controllers, repositories, services
│   │                  #   (household, householdMember, householdSubject)
│   ├── profile/       # repositories, services
│   └── todos/         # components, controllers, repositories, services
├── navigation/        # AuthStack, MainTabs, ToDoStack, HabitStack, CustomTabBar
├── scope/             # AppScopeContext, scopePath, useScopedApi
├── screens/
│   ├── auth/          # Login, Signup, ConfirmSignup
│   ├── habits/        # HabitList, CreateHabit, EditHabit, HabitScreen
│   ├── onboarding/    # Welcome, ProfileSetup, HouseholdSetup, OnboardingComplete
│   ├── todos/         # ToDo, CreateToDo, EditToDo
│   └── ProfileScreen.tsx
└── ui/
    ├── components/    # AppButton, Card, Badge, IconButton, Screen
    └── theme/         # colors, typography, spacing, radius, shadows, animations
```

## Path Aliases

```typescript
import { colors } from "@ui/theme/colors";
import { IHabit } from "@domain/models/habit";
import { useHabitListController } from "@features/habits/controllers/useHabitListController";
```

Available aliases: `@auth/*`, `@core/*`, `@domain/*`, `@features/*`, `@navigation/*`, `@scope/*`, `@screens/*`, `@ui/*`

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
git clone <repository-url>
cd self-growth-client
npm install
```

### Development

```bash
npm start              # Start Expo dev server
npm run ios            # iOS Simulator
npm run android        # Android Emulator
npx expo start -c      # Clear cache and start
```

### Testing

```bash
npm test               # Run all tests (single run)
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

60 tests across 7 suites covering services, auth, scope, and theme.

### Type Checking

```bash
npx tsc --noEmit
```

## Architecture

### Feature Module Pattern

```
feature/
├── components/       # UI components
├── controllers/      # React Query hooks
├── repositories/     # API communication layer
├── services/         # Business logic layer
└── index.ts          # Barrel export
```

### Data Flow

```
Screen → Controller → Service → Repository → API Client → Backend
                ↓
            React Query Cache
```

### Scoping

All data is scoped by household and subject: `/households/{hid}/subjects/{sid}/todos`

### Navigation Flow

```
RootNav
├── Not authenticated → AuthStack (Signup, Login, ConfirmSignup)
├── Authenticated, missing scope → OnboardingStack (4 screens)
└── Fully set up → MainTabs (ToDos, Habits, Profile)
```

## Design System

Elegant, calming design for adults focused on personal development. Special consideration for ADHD and anxiety.

- **Calming Palette**: Sage green, serene blue, soft purple
- **ADHD-Friendly**: Generous spacing, clear hierarchy, high line heights
- **Accessible**: 44x44px touch targets, high contrast

```typescript
import { colors, spacing, typography } from "@ui/theme";
import { AppButton, Card, Badge } from "@ui/components";
```

## Documentation

- [Architecture Overview](docs/architecture-overview.md)
- [Domain Models](docs/domain-model-and-entities.md)
- [Service & Repository Reference](docs/service-and-repository-reference.md)
- [Coding Patterns](docs/coding-patterns.md)
- [Design System](docs/design-system.md)
- [Testing Guide](docs/testing-guide.md)
- [Change Log](docs/change-log.md)
- [Suggestions & Improvements](docs/suggestions-improvements.md)
- [Known Bugs](docs/bugs.md)
- [Frontend Project Context](docs/fe-project-context.md) (for backend team)
- [Frontend Source of Truth](docs/fe-source-of-truth.md) (API contract)
