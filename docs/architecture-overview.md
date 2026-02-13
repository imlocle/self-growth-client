# Architecture Overview

## Technology Stack

### Core Framework

- **React Native** (0.81.5) with **Expo** (~54.0.29)
- **TypeScript** (~5.9.2) with strict mode enabled
- **React** (19.1.0)

### Navigation

- **React Navigation** (v7)
  - Native Stack Navigator for screen transitions
  - Bottom Tabs Navigator for main app navigation
  - Custom tab bar component

### State Management

- **React Query** (@tanstack/react-query v5.90.12)
  - Server state management
  - Automatic caching and refetching
  - Optimistic updates
- **React Context**
  - Authentication state (AuthContext)
  - App scope state (AppScopeContext)

### Data Persistence

- **Expo SecureStore** - Encrypted storage for tokens and sensitive data
- **AsyncStorage** - Local storage for non-sensitive data

### HTTP Client

- **Axios** (v1.13.2) with interceptors for authentication

### UI Components

- Custom component library built on React Native primitives
- Centralized theme system (colors, spacing, typography, radius)

## Architecture Patterns

### Layered Architecture

The app follows a clean, layered architecture:

```
┌─────────────────────────────────────┐
│         Screens (UI Layer)          │  ← User-facing screens
├─────────────────────────────────────┤
│    Controllers (Presentation)       │  ← React Query hooks, UI logic
├─────────────────────────────────────┤
│      Services (Business Logic)      │  ← Domain logic, transformations
├─────────────────────────────────────┤
│    Repositories (Data Access)       │  ← API calls, data mapping
├─────────────────────────────────────┤
│      API Client (Network)           │  ← HTTP client, interceptors
└─────────────────────────────────────┘
```

### Key Principles

1. **Separation of Concerns**
   - Screens handle UI rendering only
   - Controllers manage state and user interactions
   - Services contain business logic
   - Repositories handle API communication

2. **Explicit Scope Management**
   - Every data operation requires: User → Household → Subject → Entity
   - Scope is managed globally via AppScopeContext
   - API paths are built using scope helpers

3. **Type Safety**
   - TypeScript strict mode enforced
   - Domain models define data contracts
   - Interface-driven development

4. **Declarative Data Fetching**
   - React Query manages all server state
   - Automatic background refetching
   - Built-in loading and error states

## Project Structure

```
src/
├── auth/                    # Authentication logic
│   ├── AuthContext.tsx      # Auth state provider
│   ├── authApi.ts           # Auth API calls
│   └── tokenStorage.ts      # Secure token management
│
├── core/                    # Core infrastructure
│   ├── config/
│   │   └── env.ts           # Environment configuration
│   └── network/
│       └── apiClient.ts     # Axios instance with interceptors
│
├── domain/                  # Domain models (data contracts)
│   └── models/
│       ├── habit.ts
│       ├── profile.ts
│       └── todo.ts
│
├── features/                # Feature modules
│   ├── habits/
│   │   └── repositories/
│   ├── profile/
│   │   ├── api/
│   │   └── services/
│   └── todos/
│       ├── components/      # Feature-specific components
│       ├── controllers/     # React Query hooks
│       ├── repositories/    # API layer
│       └── services/        # Business logic
│
├── navigation/              # Navigation configuration
│   ├── AuthStack.tsx        # Unauthenticated screens
│   ├── MainTabs.tsx         # Main app tabs
│   ├── ToDoStack.tsx        # ToDo feature stack
│   ├── CustomTabBar.tsx     # Custom tab bar UI
│   └── RootNavigator.tsx    # Root navigation logic
│
├── scope/                   # Scope management system
│   ├── AppScopeContext.tsx  # Global scope state
│   ├── scopePath.ts         # URL path builders
│   └── useScopedApi.ts      # Scoped API hook
│
├── screens/                 # Screen components
│   ├── auth/                # Authentication screens
│   ├── habits/
│   ├── todos/
│   └── ProfileScreen.tsx
│
└── ui/                      # Shared UI system
    ├── components/          # Reusable components
    └── theme/               # Design tokens
```

## Data Flow

### Authentication Flow

```
1. User enters credentials
2. AuthContext.login() called
3. authApi.login() makes API request
4. Tokens saved to SecureStore
5. AuthContext updates isAuthed state
6. Navigation switches to MainTabs
```

### Data Fetching Flow (Example: ToDos)

```
1. ToDoScreen renders
2. useToDoListController() hook called
3. React Query checks cache
4. If stale, calls todoService.list()
5. Service calls todoRepository.list()
6. Repository makes API request via apiClient
7. Response flows back up the chain
8. React Query caches result
9. Component re-renders with data
```

### Scope-Aware API Calls

```
1. User selects household/subject (stored in AppScopeContext)
2. Controller reads scope from context
3. Passes householdId + subjectId to service
4. Service passes to repository
5. Repository uses scopedPath() to build URL:
   /households/{householdId}/subjects/{subjectId}/todos
6. API request made with scoped path
```

## State Management Strategy

### Server State (React Query)

- All backend data (todos, habits, profiles)
- Automatic caching with configurable TTL
- Background refetching
- Optimistic updates for mutations

### Client State (React Context)

- Authentication state (tokens, user status)
- App scope (active household/subject)
- UI state (theme, preferences)

### Local State (useState/useReducer)

- Form inputs
- Modal visibility
- Temporary UI state

## Security Architecture

### Token Management

- JWT tokens stored in Expo SecureStore (encrypted)
- Access token automatically attached to requests via Axios interceptor
- Refresh token stored for future token renewal (not yet implemented)

### API Security

- All authenticated endpoints require Bearer token
- Token validation happens on backend
- Frontend never stores passwords

### Scope Validation

- Backend validates user has access to household/subject
- Frontend enforces scope selection before API calls
- Path parameters include scope identifiers

## Offline Support Strategy (Planned)

### Current State

- App requires internet connection
- No offline data persistence
- No request queuing

### Planned Implementation

- React Query persistence plugin for offline cache
- AsyncStorage for cached data
- Request queue for offline mutations
- Sync strategy when connection restored

## Performance Considerations

### Current Optimizations

- React Query caching reduces redundant API calls
- FlatList for efficient list rendering
- Memoization in context providers
- Lazy loading of screens via React Navigation

### Future Optimizations

- Image optimization and caching
- Code splitting for feature modules
- Background data prefetching
- Pagination for large lists

## Development Workflow

### Environment Setup

1. Install dependencies: `npm install`
2. Configure API_BASE_URL in `src/core/config/env.ts`
3. Start Expo: `npm start`
4. Run on device/simulator: `npm run ios` or `npm run android`

### Build Process

- Expo handles bundling and compilation
- TypeScript compilation checked at build time
- No separate build configuration needed for development

### Deployment

- Expo EAS Build for production builds
- Over-the-air updates via Expo Updates
- App store deployment via EAS Submit

## Testing Strategy (To Be Implemented)

### Unit Tests

- Service layer logic
- Utility functions
- Custom hooks

### Integration Tests

- API repository layer
- Context providers
- Navigation flows

### E2E Tests

- Critical user journeys
- Authentication flow
- CRUD operations

## Known Limitations

1. **No Refresh Token Flow**: Access tokens expire but no automatic refresh
2. **No Offline Support**: App requires active internet connection
3. **Limited Error Handling**: Basic error states, no retry logic
4. **No Analytics**: No user behavior tracking
5. **No Push Notifications**: No real-time updates
6. **Habit Repository Not Scoped**: habitRepository doesn't use scope paths yet (needs update)

## Next Steps

See `coding-patterns-and-improvements.md` for detailed improvement recommendations.
