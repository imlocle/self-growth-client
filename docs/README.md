# Self-Growth Frontend Documentation

Welcome to the Self-Growth React Native app documentation. This guide will help you understand, develop, and maintain the frontend application.

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd self-growth-app

# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Environment Configuration

Update the API base URL in `src/core/config/env.ts`:

```typescript
export const ENV = {
  API_BASE_URL: "https://your-api-url.com",
};
```

## Documentation Structure

### Core Documentation

1. **[Architecture Overview](./architecture-overview.md)**
   - Technology stack
   - Architecture patterns
   - Project structure
   - Data flow
   - State management

2. **[Domain Model and Entities](./domain-model-and-entities.md)**
   - Core concepts (User, Household, Subject)
   - Entity models (ToDo, Habit, Profile)
   - Data relationships
   - Validation rules

3. **[Service and Repository Reference](./service-and-repository-reference.md)**
   - API client configuration
   - Repository patterns
   - Service layer
   - Controllers (React Query hooks)
   - Error handling

4. **[UI Components and Theming](./ui-components-and-theming.md)**
   - Design system
   - Theme tokens (colors, spacing, typography)
   - Core components
   - Component patterns
   - Accessibility

5. **[Coding Patterns and Improvements](./coding-patterns-and-improvements.md)**
   - Current patterns
   - Critical issues to fix
   - Recommended improvements
   - Best practices
   - Performance optimization

6. **[Testing Guide](./testing-guide.md)**
   - Testing strategy
   - Unit testing
   - Integration testing
   - E2E testing
   - Test coverage

7. **[Onboarding and Scope Management](./onboarding-and-scope-management.md)**
   - Onboarding flow implementation
   - Household/subject management
   - Scope selection UI
   - Best practices

## Key Concepts

### Hierarchical Ownership Model

```
User (Cognito Identity)
  └── UserProfile (App Identity)
       └── Household (Shared Container)
            └── Subject (Individual Being Tracked)
                 ├── ToDos
                 ├── Habits
                 └── HabitEvents (future)
```

### Scope Management

Every data operation requires explicit scope:

```typescript
const { activeHouseholdId, activeSubjectId } = useAppScope();
todoService.list(activeHouseholdId, activeSubjectId);
```

### Layered Architecture

```
Screens → Controllers → Services → Repositories → API Client
```

## Current Status

### ✅ Implemented

- Authentication (signup, login, logout)
- Token storage (SecureStore)
- Scope management (AppScopeContext)
- ToDo CRUD operations
- Basic UI components
- Navigation structure
- Theme system

### ⚠️ Partially Implemented

- Habit repository (not scoped yet)
- Profile management (basic only)
- Error handling (needs improvement)

### ❌ Not Implemented

- Onboarding flow
- Household/subject creation UI
- Token refresh logic
- Offline support
- Form validation
- Testing
- Habit events
- Push notifications

## Priority Tasks

### High Priority (Do First)

1. **Fix Habit Repository Scoping**
   - Update `habitRepository.ts` to match ToDo pattern
   - Add householdId and subjectId parameters
   - Update API paths

2. **Implement Onboarding Flow**
   - Create profile screen
   - Create household screen
   - Create subject screen
   - Update RootNavigator logic

3. **Add Error Handling**
   - Error boundary component
   - Toast notifications
   - Retry logic
   - Network status detection

4. **Add Form Validation**
   - Install react-hook-form + zod
   - Create validation schemas
   - Update form screens

### Medium Priority (Do Next)

5. **Implement Token Refresh**
   - Add refresh endpoint call
   - Update API interceptor
   - Handle token expiration

6. **Add Missing UI Components**
   - TextInput component
   - Modal component
   - LoadingSpinner component
   - EmptyState component

7. **Implement Habit UI**
   - Habit list screen
   - Create/edit habit screens
   - Habit card component

8. **Add Offline Support**
   - React Query persistence
   - Request queue
   - Sync strategy

### Low Priority (Nice to Have)

9. **Add Testing**
   - Unit tests for services
   - Integration tests for repositories
   - Component tests
   - E2E tests

10. **Performance Optimizations**
    - Memoization
    - List virtualization
    - Image optimization
    - Code splitting

11. **Enhanced UX**
    - Loading skeletons
    - Pull-to-refresh
    - Optimistic updates
    - Animations

## Common Tasks

### Adding a New Feature

1. Create domain model in `src/domain/models/`
2. Create repository in `src/features/{feature}/repositories/`
3. Create service in `src/features/{feature}/services/`
4. Create controller hook in `src/features/{feature}/controllers/`
5. Create UI components in `src/features/{feature}/components/`
6. Create screens in `src/screens/{feature}/`
7. Add navigation routes

### Adding a New Screen

1. Create screen component in `src/screens/`
2. Add to navigation stack
3. Add navigation types
4. Use `Screen` wrapper component
5. Implement loading/error states

### Adding a New API Endpoint

1. Add method to repository
2. Add business logic to service
3. Create/update controller hook
4. Update UI to use new hook

### Updating Theme

1. Update tokens in `src/ui/theme/`
2. Changes automatically apply to all components using theme

## Troubleshooting

### App won't start

- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node version: `node -v` (should be 18+)

### API calls failing

- Check `ENV.API_BASE_URL` is correct
- Verify backend is running
- Check network connectivity
- Inspect token in SecureStore

### Navigation not working

- Ensure all screens are registered in navigator
- Check navigation types are correct
- Verify route names match

### Scope errors

- Check if household/subject are set in AppScopeContext
- Verify scope is passed to all API calls
- Check SecureStore for persisted scope

## Resources

### React Native

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)

### Libraries

- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [React Query](https://tanstack.com/query/latest/docs/react/overview)
- [Axios](https://axios-http.com/docs/intro)

### Design

- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Expo Icons](https://icons.expo.fyi/)

## Contributing

### Code Style

- Use TypeScript strict mode
- Follow existing patterns
- Use theme tokens (no magic numbers)
- Add JSDoc comments for complex logic
- Keep components small and focused

### Git Workflow

1. Create feature branch from `main`
2. Make changes
3. Write tests (when testing is set up)
4. Create pull request
5. Get review
6. Merge to `main`

### Commit Messages

```
feat: Add habit creation screen
fix: Fix todo toggle not updating UI
refactor: Extract form validation to hook
docs: Update architecture documentation
test: Add tests for todoService
```

## Getting Help

### Common Questions

**Q: How do I add a new field to ToDo?**
A: Update `IToDo` interface, update repository/service, update UI components.

**Q: How do I change the theme colors?**
A: Update `src/ui/theme/colors.ts`.

**Q: How do I add a new screen?**
A: See "Adding a New Screen" section above.

**Q: Why is my API call not working?**
A: Check scope is set, verify endpoint URL, check token is valid.

**Q: How do I test my changes?**
A: Currently no tests. See testing-guide.md for setup instructions.

### Need More Help?

- Review the detailed documentation files
- Check the backend API reference
- Review the PROJECT_CONTEXT.md for design philosophy
- Ask the team

## Next Steps

1. Read [Architecture Overview](./architecture-overview.md) to understand the system
2. Review [Domain Model](./domain-model-and-entities.md) to understand data structures
3. Check [Coding Patterns](./coding-patterns-and-improvements.md) for best practices
4. Start with high-priority tasks listed above
5. Refer to specific documentation as needed

---

**Last Updated:** February 2025
**Version:** 1.0.0
