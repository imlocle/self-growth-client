<!-- Last Updated: February 19, 2026 -->

# Suggestions & Improvements

Prioritized list of improvements to consider for the Self Growth app.

## High Priority

### Token Refresh

Access tokens expire but there's no automatic refresh. Users are forced to re-login. Add a response interceptor that catches 401s, calls a refresh endpoint, and retries the original request.

### Error Handling

No global error boundary, no toast notifications, no retry logic. Consider:

- `react-native-toast-message` for user-facing errors
- React Error Boundary wrapping the app
- React Query retry config (3 retries with exponential backoff)
- Network status detection with `@react-native-community/netinfo`

### Form Validation

No client-side validation library. Users only see backend errors. Consider `react-hook-form` + `zod` for schema-based validation with real-time feedback.

## Medium Priority

### Offline Support

App requires active internet. Consider:

- React Query persistence plugin with AsyncStorage
- Request queue for offline mutations
- Sync strategy when connection restores

### Missing UI Components

Several common components are still built inline in screens:

- TextInput (with label, error state)
- Modal/Dialog
- LoadingSpinner
- EmptyState
- ConfirmDialog
- Select/Dropdown

### Custom Font

The design system uses system fonts. A custom font like Inter, SF Pro, or Manrope would elevate the premium feel.

### Scope Switching UI

Users can't switch between households/subjects after onboarding. Need a subject dropdown in the header and a household selection screen.

## Low Priority

### Performance

- Loading skeletons instead of spinners
- Optimistic updates for mutations
- Pull-to-refresh on list screens
- Pagination for large lists
- `React.memo` on list item components

### Animations

- Screen transition animations
- List item enter/exit animations with react-native-reanimated
- Haptic feedback on interactions

### Analytics & Monitoring

- Sentry for error tracking
- Firebase Analytics for user behavior
- Performance monitoring

### Habit Events

Backend support needed. Would enable:

- Logging habit occurrences
- Streak tracking
- Calendar view
- Statistics

### Dark/Light Mode Toggle

Currently dark-only. The theme system supports it but needs a toggle and persistence.
