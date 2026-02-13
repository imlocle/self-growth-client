# Onboarding and Scope Management

## Overview

The app requires users to have:

1. A UserProfile (application identity)
2. A Household (shared container)
3. A Subject (individual being tracked)

This document outlines how to implement the onboarding flow and scope management UI.

## Current State

### What Exists

- `AppScopeContext` for managing active household/subject
- Scope persistence to SecureStore
- Scoped API calls in repositories

### What's Missing

- Onboarding flow after signup
- Household creation/selection UI
- Subject creation/selection UI
- Auto-creation of default household/subject

## Onboarding Flow

### User Journey

```
1. Sign Up → Email Confirmation
2. Login (first time)
3. Check if profile exists
   ├─ No → Onboarding Flow
   │   ├─ Create Profile
   │   ├─ Create Household
   │   └─ Create Subject
   └─ Yes → Check if scope set
       ├─ No → Select Household/Subject
       └─ Yes → Main App
```

### Implementation Plan

#### Step 1: Create Backend Endpoints (If Not Exist)

**Household Endpoints:**

```
POST /households
GET /households (list user's households)
GET /households/{id}
```

**Subject Endpoints:**

```
POST /households/{hid}/subjects
GET /households/{hid}/subjects
GET /households/{hid}/subjects/{sid}
```

**Membership Endpoints:**

```
GET /user/memberships (list households user belongs to)
```

#### Step 2: Create Domain Models

**src/domain/models/household.ts:**

```typescript
export interface IHousehold {
  id: string;
  name: string;
  dateCreated: string;
  dateModified: string;
}

export interface ICreateHouseholdInput {
  name: string;
}

export interface IListHouseholdOutput {
  items: IHousehold[];
  lastEvaluatedKey?: string;
}
```

**src/domain/models/subject.ts:**

```typescript
export interface ISubject {
  id: string;
  householdId: string;
  name: string;
  dateCreated: string;
  dateModified: string;
}

export interface ICreateSubjectInput {
  name: string;
}

export interface IListSubjectOutput {
  items: ISubject[];
  lastEvaluatedKey?: string;
}
```

#### Step 3: Create Repositories

**src/features/household/repositories/householdRepository.ts:**

```typescript
import { apiClient } from "../../../core/network/apiClient";
import {
  IHousehold,
  ICreateHouseholdInput,
  IListHouseholdOutput,
} from "../../../domain/models/household";

export const householdRepository = {
  async list(): Promise<IListHouseholdOutput> {
    const { data } = await apiClient.get<IListHouseholdOutput>("/households");
    return data;
  },

  async get(id: string): Promise<IHousehold> {
    const { data } = await apiClient.get<IHousehold>(`/households/${id}`);
    return data;
  },

  async create(payload: ICreateHouseholdInput): Promise<IHousehold> {
    const { data } = await apiClient.post<IHousehold>("/households", payload);
    return data;
  },
};
```

**src/features/subject/repositories/subjectRepository.ts:**

```typescript
import { apiClient } from "../../../core/network/apiClient";
import {
  ISubject,
  ICreateSubjectInput,
  IListSubjectOutput,
} from "../../../domain/models/subject";

export const subjectRepository = {
  async list(householdId: string): Promise<IListSubjectOutput> {
    const { data } = await apiClient.get<IListSubjectOutput>(
      `/households/${householdId}/subjects`,
    );
    return data;
  },

  async get(householdId: string, subjectId: string): Promise<ISubject> {
    const { data } = await apiClient.get<ISubject>(
      `/households/${householdId}/subjects/${subjectId}`,
    );
    return data;
  },

  async create(
    householdId: string,
    payload: ICreateSubjectInput,
  ): Promise<ISubject> {
    const { data } = await apiClient.post<ISubject>(
      `/households/${householdId}/subjects`,
      payload,
    );
    return data;
  },
};
```

#### Step 4: Create Onboarding Screens

**src/screens/onboarding/OnboardingNavigator.tsx:**

```typescript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from './WelcomeScreen';
import { CreateProfileScreen } from './CreateProfileScreen';
import { CreateHouseholdScreen } from './CreateHouseholdScreen';
import { CreateSubjectScreen } from './CreateSubjectScreen';

export type OnboardingStackParamList = {
  Welcome: undefined;
  CreateProfile: undefined;
  CreateHousehold: { profileId: string };
  CreateSubject: { householdId: string };
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
      <Stack.Screen name="CreateHousehold" component={CreateHouseholdScreen} />
      <Stack.Screen name="CreateSubject" component={CreateSubjectScreen} />
    </Stack.Navigator>
  );
}
```

**src/screens/onboarding/WelcomeScreen.tsx:**

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './OnboardingNavigator';
import { Screen } from '../../ui/components/Screen';
import { AppButton } from '../../ui/components/AppButton';
import { colors } from '../../ui/theme/colors';
import { spacing } from '../../ui/theme/spacing';
import { typography } from '../../ui/theme/typography';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;
};

export function WelcomeScreen({ navigation }: Props) {
  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Self-Growth</Text>
        <Text style={styles.subtitle}>
          Track habits and todos for yourself and your family
        </Text>
      </View>

      <AppButton
        title="Get Started"
        onPress={() => navigation.navigate('CreateProfile')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.heading,
    color: colors.text,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSoft,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
```

**src/screens/onboarding/CreateProfileScreen.tsx:**

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './OnboardingNavigator';
import { Screen } from '../../ui/components/Screen';
import { TextInput } from '../../ui/components/TextInput';
import { AppButton } from '../../ui/components/AppButton';
import { profileRepository } from '../../features/profile/api/profileRepository';
import { useAppScope } from '../../scope/AppScopeContext';
import { colors } from '../../ui/theme/colors';
import { spacing } from '../../ui/theme/spacing';
import { typography } from '../../ui/theme/typography';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'CreateProfile'>;
};

export function CreateProfileScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { setUserProfile } = useAppScope();

  const handleSubmit = async () => {
    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const profile = await profileRepository.create({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
      });

      await setUserProfile({
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
      });

      navigation.navigate('CreateHousehold', { profileId: profile.userId });
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Create Your Profile</Text>
      <Text style={styles.subtitle}>Tell us a bit about yourself</Text>

      <View style={styles.form}>
        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="John"
          autoCapitalize="words"
          error={error && !firstName ? error : undefined}
        />

        <TextInput
          label="Last Name (Optional)"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Doe"
          autoCapitalize="words"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <AppButton
          title={isLoading ? 'Creating...' : 'Continue'}
          onPress={handleSubmit}
          disabled={isLoading}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSoft,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
  button: {
    marginTop: spacing.lg,
  },
});
```

**src/screens/onboarding/CreateHouseholdScreen.tsx:**

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from './OnboardingNavigator';
import { Screen } from '../../ui/components/Screen';
import { TextInput } from '../../ui/components/TextInput';
import { AppButton } from '../../ui/components/AppButton';
import { householdRepository } from '../../features/household/repositories/householdRepository';
import { useAppScope } from '../../scope/AppScopeContext';
import { colors } from '../../ui/theme/colors';
import { spacing } from '../../ui/theme/spacing';
import { typography } from '../../ui/theme/typography';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'CreateHousehold'>;
  route: RouteProp<OnboardingStackParamList, 'CreateHousehold'>;
};

export function CreateHouseholdScreen({ navigation, route }: Props) {
  const { userProfile } = useAppScope();
  const [householdName, setHouseholdName] = useState(
    `${userProfile?.firstName}'s Household`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { setActiveHousehold } = useAppScope();

  const handleSubmit = async () => {
    if (!householdName.trim()) {
      setError('Household name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const household = await householdRepository.create({
        name: householdName.trim(),
      });

      await setActiveHousehold(household.id);

      navigation.navigate('CreateSubject', { householdId: household.id });
    } catch (err: any) {
      setError(err.message || 'Failed to create household');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Create Your Household</Text>
      <Text style={styles.subtitle}>
        A household is a shared space for tracking habits and todos
      </Text>

      <View style={styles.form}>
        <TextInput
          label="Household Name"
          value={householdName}
          onChangeText={setHouseholdName}
          placeholder="My Family"
          error={error && !householdName ? error : undefined}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <AppButton
          title={isLoading ? 'Creating...' : 'Continue'}
          onPress={handleSubmit}
          disabled={isLoading}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSoft,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
  button: {
    marginTop: spacing.lg,
  },
});
```

**src/screens/onboarding/CreateSubjectScreen.tsx:**

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from './OnboardingNavigator';
import { Screen } from '../../ui/components/Screen';
import { TextInput } from '../../ui/components/TextInput';
import { AppButton } from '../../ui/components/AppButton';
import { subjectRepository } from '../../features/subject/repositories/subjectRepository';
import { useAppScope } from '../../scope/AppScopeContext';
import { colors } from '../../ui/theme/colors';
import { spacing } from '../../ui/theme/spacing';
import { typography } from '../../ui/theme/typography';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'CreateSubject'>;
  route: RouteProp<OnboardingStackParamList, 'CreateSubject'>;
};

export function CreateSubjectScreen({ navigation, route }: Props) {
  const { householdId } = route.params;
  const { userProfile, setActiveSubject } = useAppScope();

  const [subjectName, setSubjectName] = useState(
    userProfile?.firstName || 'Me'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!subjectName.trim()) {
      setError('Name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const subject = await subjectRepository.create(householdId, {
        name: subjectName.trim(),
      });

      await setActiveSubject(subject.id);

      // Onboarding complete - navigation will switch to MainTabs
      // because scope is now set
    } catch (err: any) {
      setError(err.message || 'Failed to create subject');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Who are you tracking?</Text>
      <Text style={styles.subtitle}>
        Create a profile for yourself or someone you're caring for
      </Text>

      <View style={styles.form}>
        <TextInput
          label="Name"
          value={subjectName}
          onChangeText={setSubjectName}
          placeholder="Me"
          error={error && !subjectName ? error : undefined}
        />

        <Text style={styles.hint}>
          You can add more people later from the Profile screen
        </Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <AppButton
          title={isLoading ? 'Creating...' : 'Get Started'}
          onPress={handleSubmit}
          disabled={isLoading}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSoft,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 14,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
  button: {
    marginTop: spacing.lg,
  },
});
```

#### Step 5: Update Root Navigation

**src/navigation/RootNavigator.tsx:**

```typescript
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useAppScope } from '../scope/AppScopeContext';
import { profileRepository } from '../features/profile/api/profileRepository';
import { AuthStack } from './AuthStack';
import { OnboardingNavigator } from '../screens/onboarding/OnboardingNavigator';
import { MainTabs } from './MainTabs';

export function RootNavigator() {
  const { isLoading: isAuthLoading, isAuthed } = useAuth();
  const {
    isScopeLoading,
    userProfile,
    activeHouseholdId,
    activeSubjectId,
    setUserProfile
  } = useAppScope();

  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      if (!isAuthed || userProfile) return;

      setIsCheckingProfile(true);
      try {
        const profile = await profileRepository.get();
        await setUserProfile({
          userId: profile.userId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          householdId: profile.defaultHouseholdId,
          subjectId: profile.defaultSubjectId,
        });
        setNeedsOnboarding(false);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Profile doesn't exist, needs onboarding
          setNeedsOnboarding(true);
        }
      } finally {
        setIsCheckingProfile(false);
      }
    }

    checkProfile();
  }, [isAuthed, userProfile, setUserProfile]);

  // Show loading while checking auth or profile
  if (isAuthLoading || isScopeLoading || isCheckingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Not authenticated - show auth screens
  if (!isAuthed) {
    return <AuthStack />;
  }

  // Authenticated but needs onboarding
  if (needsOnboarding || !userProfile) {
    return <OnboardingNavigator />;
  }

  // Authenticated but no scope selected
  if (!activeHouseholdId || !activeSubjectId) {
    // TODO: Show household/subject selection screen
    // For now, show onboarding to create one
    return <OnboardingNavigator />;
  }

  // Fully set up - show main app
  return <MainTabs />;
}
```

## Scope Selection UI

### Household Selection

**src/screens/settings/HouseholdSelectScreen.tsx:**

```typescript
import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { householdRepository } from '../../features/household/repositories/householdRepository';
import { useAppScope } from '../../scope/AppScopeContext';
import { Screen } from '../../ui/components/Screen';
import { LoadingSpinner } from '../../ui/components/LoadingSpinner';
import { colors } from '../../ui/theme/colors';
import { spacing } from '../../ui/theme/spacing';
import { radius } from '../../ui/theme/radius';

export function HouseholdSelectScreen() {
  const { activeHouseholdId, setActiveHousehold } = useAppScope();

  const { data, isLoading } = useQuery({
    queryKey: ['households'],
    queryFn: () => householdRepository.list(),
  });

  if (isLoading) {
    return (
      <Screen>
        <LoadingSpinner text="Loading households..." />
      </Screen>
    );
  }

  const households = data?.items || [];

  return (
    <Screen>
      <Text style={styles.title}>Select Household</Text>

      <FlatList
        data={households}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.item,
              item.id === activeHouseholdId && styles.itemActive
            ]}
            onPress={() => setActiveHousehold(item.id)}
          >
            <Text style={styles.itemText}>{item.name}</Text>
            {item.id === activeHouseholdId && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  item: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemActive: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  itemText: {
    color: colors.text,
    fontSize: 16,
  },
  checkmark: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
});
```

### Subject Dropdown

**src/ui/components/SubjectDropdown.tsx:**

```typescript
import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { subjectRepository } from '../../features/subject/repositories/subjectRepository';
import { useAppScope } from '../../scope/AppScopeContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';

export function SubjectDropdown() {
  const { activeHouseholdId, activeSubjectId, setActiveSubject } = useAppScope();
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['subjects', activeHouseholdId],
    queryFn: () => subjectRepository.list(activeHouseholdId!),
    enabled: !!activeHouseholdId,
  });

  const subjects = data?.items || [];
  const activeSubject = subjects.find(s => s.id === activeSubjectId);

  return (
    <View>
      <Pressable
        style={styles.trigger}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.triggerText}>
          {activeSubject?.name || 'Select Subject'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Select Subject</Text>

            <FlatList
              data={subjects}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.option,
                    item.id === activeSubjectId && styles.optionActive
                  ]}
                  onPress={() => {
                    setActiveSubject(item.id);
                    setIsOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.name}</Text>
                  {item.id === activeSubjectId && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radius.md,
    minWidth: 150,
  },
  triggerText: {
    color: colors.text,
    fontSize: 16,
    marginRight: spacing.sm,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  option: {
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: colors.surfaceAlt,
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
  },
  checkmark: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
});
```

### Add to Profile Screen

**Update src/screens/ProfileScreen.tsx:**

```typescript
import { SubjectDropdown } from '../ui/components/SubjectDropdown';

// In render:
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Active Subject</Text>
  <SubjectDropdown />
</View>
```

## Best Practices

### 1. Graceful Degradation

Always check if scope exists before making API calls:

```typescript
const { activeHouseholdId, activeSubjectId } = useAppScope();

if (!activeHouseholdId || !activeSubjectId) {
  return <NoScopeMessage />;
}
```

### 2. Persist Scope

Scope should persist across app restarts:

```typescript
// Already implemented in AppScopeContext
await setActiveHousehold(householdId); // Saves to SecureStore
await setActiveSubject(subjectId); // Saves to SecureStore
```

### 3. Validate Scope on Backend

Backend should always validate that user has access to the household/subject in the request path.

### 4. Handle Scope Changes

When household changes, clear subject selection:

```typescript
async setActiveHousehold(householdId) {
  setActiveHouseholdIdState(householdId);
  await persistHouseholdId(householdId);

  // Clear subject since it may not belong to new household
  setActiveSubjectIdState(null);
  await persistSubjectId(null);
}
```

### 5. Loading States

Show appropriate loading states during onboarding:

```typescript
if (isCreatingProfile) {
  return <LoadingSpinner text="Creating your profile..." />;
}
```

## Future Enhancements

### Multi-Subject Quick Switch

Add a quick switcher in the header:

```typescript
// In MainTabs header
<SubjectDropdown />
```

### Household Invitations

Allow users to invite others to their household:

```
POST /households/{id}/invitations
{
  "email": "family@example.com",
  "role": "member"
}
```

### Subject Avatars

Add avatar support for subjects:

```typescript
interface ISubject {
  id: string;
  name: string;
  avatarUrl?: string;
  // ...
}
```

### Household Roles

Implement role-based permissions:

```typescript
type HouseholdRole = "owner" | "admin" | "member" | "viewer";

interface IHouseholdMembership {
  userId: string;
  householdId: string;
  role: HouseholdRole;
}
```
