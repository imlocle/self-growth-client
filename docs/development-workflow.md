# Development Workflow

## Daily Development

### Starting Your Day

1. **Pull latest changes**

   ```bash
   git pull origin main
   ```

2. **Install any new dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   npm run ios    # iOS
   npm run android # Android
   ```

### Development Loop

```
1. Make code changes
2. Save file (hot reload happens automatically)
3. Test in simulator/device
4. Check for errors in terminal
5. Repeat
```

### Hot Reload

- **Fast Refresh**: Automatically reloads on save
- **Manual Reload**: Shake device → "Reload"
- **Clear Cache**: `expo start -c`

## Project Setup

### First Time Setup

```bash
# Install Node.js 18+ from nodejs.org

# Install Expo CLI globally
npm install -g expo-cli

# Clone repository
git clone <repository-url>
cd self-growth-app

# Install dependencies
npm install

# Configure environment
# Edit src/core/config/env.ts with your API URL

# Start development
npm start
```

### iOS Setup (Mac only)

```bash
# Install Xcode from App Store

# Install Xcode Command Line Tools
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods

# Install iOS dependencies
cd ios && pod install && cd ..

# Run on iOS simulator
npm run ios
```

### Android Setup

```bash
# Install Android Studio from developer.android.com

# Set up Android SDK
# Open Android Studio → Preferences → Android SDK
# Install SDK Platform 33 and SDK Build-Tools

# Set environment variables in ~/.zshrc or ~/.bash_profile:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Create virtual device in Android Studio
# Tools → AVD Manager → Create Virtual Device

# Run on Android emulator
npm run android
```

## Feature Development

### Creating a New Feature

**Example: Adding a "Notes" feature**

#### 1. Create Domain Model

```typescript
// src/domain/models/note.ts
export interface INote {
  id: string;
  title: string;
  content: string;
  householdId: string;
  subjectId: string;
  dateCreated: string;
  dateModified: string;
}

export interface ICreateNoteInput {
  title: string;
  content: string;
}

export interface IUpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
}
```

#### 2. Create Repository

```typescript
// src/features/notes/repositories/noteRepository.ts
import { apiClient } from "../../../core/network/apiClient";
import { scopedPath } from "../../../scope/scopePath";
import {
  INote,
  ICreateNoteInput,
  IUpdateNoteInput,
} from "../../../domain/models/note";

export const noteRepository = {
  async list(householdId: string, subjectId: string): Promise<INote[]> {
    const { data } = await apiClient.get(
      scopedPath(householdId, subjectId, "/notes"),
    );
    return data.items;
  },

  async create(
    householdId: string,
    subjectId: string,
    payload: ICreateNoteInput,
  ): Promise<INote> {
    const { data } = await apiClient.post(
      scopedPath(householdId, subjectId, "/notes"),
      payload,
    );
    return data;
  },

  async update(
    householdId: string,
    subjectId: string,
    payload: IUpdateNoteInput,
  ): Promise<INote> {
    const { id, ...rest } = payload;
    const { data } = await apiClient.put(
      scopedPath(householdId, subjectId, `/notes/${id}`),
      rest,
    );
    return data;
  },

  async delete(
    householdId: string,
    subjectId: string,
    id: string,
  ): Promise<void> {
    await apiClient.delete(scopedPath(householdId, subjectId, `/notes/${id}`));
  },
};
```

#### 3. Create Service

```typescript
// src/features/notes/services/noteService.ts
import { noteRepository } from "../repositories/noteRepository";
import {
  INote,
  ICreateNoteInput,
  IUpdateNoteInput,
} from "../../../domain/models/note";

export const noteService = {
  async list(householdId: string, subjectId: string): Promise<INote[]> {
    return noteRepository.list(householdId, subjectId);
  },

  async create(
    householdId: string,
    subjectId: string,
    payload: ICreateNoteInput,
  ): Promise<INote> {
    // Add validation here if needed
    if (!payload.title.trim()) {
      throw new Error("Title is required");
    }
    return noteRepository.create(householdId, subjectId, payload);
  },

  async update(
    householdId: string,
    subjectId: string,
    payload: IUpdateNoteInput,
  ): Promise<INote> {
    return noteRepository.update(householdId, subjectId, payload);
  },

  async delete(
    householdId: string,
    subjectId: string,
    id: string,
  ): Promise<void> {
    return noteRepository.delete(householdId, subjectId, id);
  },
};
```

#### 4. Create Controller Hook

```typescript
// src/features/notes/controllers/useNoteListController.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "../services/noteService";
import { useAppScope } from "../../../scope/AppScopeContext";

export function useNoteListController() {
  const queryClient = useQueryClient();
  const { activeHouseholdId, activeSubjectId } = useAppScope();

  const hasScope = !!activeHouseholdId && !!activeSubjectId;

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", activeHouseholdId, activeSubjectId],
    queryFn: () => noteService.list(activeHouseholdId!, activeSubjectId!),
    enabled: hasScope,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      noteService.delete(activeHouseholdId!, activeSubjectId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", activeHouseholdId, activeSubjectId],
      });
    },
  });

  return {
    notes: data ?? [],
    isLoading,
    error,
    hasScope,
    deleteNote: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
```

#### 5. Create UI Components

```typescript
// src/features/notes/components/NoteCard.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { INote } from '../../../domain/models/note';
import { colors } from '../../../ui/theme/colors';
import { spacing } from '../../../ui/theme/spacing';
import { radius } from '../../../ui/theme/radius';

interface Props {
  note: INote;
  onPress: () => void;
}

export function NoteCard({ note, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.content} numberOfLines={3}>
        {note.content}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  content: {
    color: colors.textSoft,
    fontSize: 14,
  }
});
```

#### 6. Create Screens

```typescript
// src/screens/notes/NoteListScreen.tsx
import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../ui/components/Screen';
import { NoteCard } from '../../features/notes/components/NoteCard';
import { useNoteListController } from '../../features/notes/controllers/useNoteListController';
import { LoadingSpinner } from '../../ui/components/LoadingSpinner';
import { EmptyState } from '../../ui/components/EmptyState';

export function NoteListScreen() {
  const navigation = useNavigation();
  const { notes, isLoading, hasScope } = useNoteListController();

  if (!hasScope) {
    return (
      <Screen>
        <Text>No scope selected</Text>
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen>
        <LoadingSpinner text="Loading notes..." />
      </Screen>
    );
  }

  if (notes.length === 0) {
    return (
      <Screen>
        <EmptyState
          icon="document-text-outline"
          title="No Notes Yet"
          message="Create your first note to get started"
          action={{
            label: "Create Note",
            onPress: () => navigation.navigate('CreateNote')
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => navigation.navigate('EditNote', { note: item })}
          />
        )}
      />
    </Screen>
  );
}
```

#### 7. Add Navigation

```typescript
// Update navigation stack to include Notes screens
// Add to MainTabs or create NoteStack similar to ToDoStack
```

## Debugging

### React Native Debugger

1. **Install React Native Debugger**

   ```bash
   brew install --cask react-native-debugger
   ```

2. **Open debugger**
   - Launch React Native Debugger app
   - In simulator: Cmd+D (iOS) or Cmd+M (Android)
   - Select "Debug"

3. **Use Chrome DevTools**
   - Console for logs
   - Network tab for API calls
   - React DevTools for component inspection

### Common Debugging Techniques

**Console Logging:**

```typescript
console.log("User data:", user);
console.error("API error:", error);
console.warn("Deprecated function");
```

**React Query Devtools:**

```typescript
// Add to App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

**Network Inspection:**

```typescript
// Add to apiClient.ts
apiClient.interceptors.request.use((config) => {
  console.log("Request:", config.method, config.url);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("Error:", error.response?.status, error.message);
    return Promise.reject(error);
  },
);
```

### Common Issues

**Issue: White screen on launch**

- Check for JavaScript errors in console
- Verify all imports are correct
- Clear cache: `expo start -c`

**Issue: API calls failing**

- Check network tab in debugger
- Verify API_BASE_URL is correct
- Check token is being sent
- Verify backend is running

**Issue: State not updating**

- Check React Query cache
- Verify mutation invalidates queries
- Check component is re-rendering

**Issue: Navigation not working**

- Verify screen is registered in navigator
- Check navigation types match
- Ensure navigation prop is available

## Testing Your Changes

### Manual Testing Checklist

Before committing:

- [ ] Feature works on iOS simulator
- [ ] Feature works on Android emulator
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Empty states display correctly
- [ ] Navigation works as expected
- [ ] Data persists across app restarts
- [ ] No console errors or warnings
- [ ] UI looks good on different screen sizes
- [ ] Accessibility labels are present

### Testing on Real Device

**iOS:**

```bash
# Connect iPhone via USB
# Trust computer on device
npm run ios -- --device
```

**Android:**

```bash
# Enable USB debugging on device
# Connect via USB
adb devices  # Verify device is connected
npm run android
```

## Code Review

### Before Creating PR

1. **Self-review your code**
   - Remove console.logs
   - Remove commented code
   - Check for TODOs
   - Verify formatting

2. **Test thoroughly**
   - Run through manual testing checklist
   - Test edge cases
   - Test error scenarios

3. **Update documentation**
   - Add JSDoc comments
   - Update README if needed
   - Document breaking changes

### PR Description Template

```markdown
## What

Brief description of what this PR does

## Why

Why is this change needed?

## How

How does this change work?

## Testing

- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Added/updated tests (when testing is set up)

## Screenshots

[Add screenshots if UI changes]

## Notes

Any additional context or concerns
```

## Deployment

### Building for Production

**iOS:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios
```

**Android:**

```bash
# Build for Android
eas build --platform android
```

### Over-the-Air Updates

```bash
# Publish update
eas update --branch production --message "Fix login bug"
```

### App Store Submission

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

## Performance Monitoring

### Flipper (Development)

```bash
# Install Flipper
brew install --cask flipper

# Launch Flipper
# Connect to running app
# Use Network, Layout, and Performance plugins
```

### Production Monitoring

Consider adding:

- **Sentry** for error tracking
- **Firebase Analytics** for user behavior
- **Firebase Performance** for performance metrics

## Useful Commands

```bash
# Clear all caches
expo start -c
rm -rf node_modules
npm install

# Reset iOS simulator
xcrun simctl erase all

# Reset Android emulator
adb shell pm clear <package-name>

# View logs
# iOS
xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "SelfGrowth"'

# Android
adb logcat *:S ReactNative:V ReactNativeJS:V

# Check bundle size
npx react-native-bundle-visualizer

# Type check
npx tsc --noEmit

# Lint (if ESLint is set up)
npx eslint src/
```

## Tips and Tricks

### Faster Development

1. **Use Fast Refresh**: Save files to see changes instantly
2. **Use TypeScript**: Catch errors before runtime
3. **Use React Query DevTools**: Inspect cache and queries
4. **Use component libraries**: Don't reinvent the wheel
5. **Use snippets**: Create code snippets for common patterns

### Code Organization

1. **Keep files small**: Max 200-300 lines
2. **Extract custom hooks**: Reuse logic across components
3. **Use barrel exports**: Clean imports
4. **Colocate related files**: Keep feature files together
5. **Use consistent naming**: Follow established patterns

### Performance

1. **Memoize expensive computations**: Use `useMemo`
2. **Memoize callbacks**: Use `useCallback`
3. **Optimize lists**: Use `FlatList` with proper keys
4. **Lazy load screens**: Use React Navigation's lazy loading
5. **Optimize images**: Use appropriate sizes and formats

### Debugging

1. **Use TypeScript**: Catch errors at compile time
2. **Use React Query DevTools**: Debug data fetching
3. **Use console.log strategically**: Don't overuse
4. **Use breakpoints**: In React Native Debugger
5. **Check network tab**: Verify API calls

## Learning Resources

### React Native

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Native Express](http://www.reactnativeexpress.com/)

### React

- [React Docs](https://react.dev/)
- [React Hooks](https://react.dev/reference/react)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Libraries

- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/)

### Design

- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://material.io/design)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
