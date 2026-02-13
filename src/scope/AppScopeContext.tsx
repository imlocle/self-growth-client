import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";

export type UserProfile = {
  userId: string; // maps to Cognito sub
  firstName?: string;
  lastName?: string;

  householdId?: string;
  subjectId?: string;

  // If your backend returns memberships etc later, you can add them
};

type AppScope = {
  userProfile: UserProfile | null;
  activeHouseholdId: string | null;
  activeSubjectId: string | null;
};

type AppScopeState = AppScope & {
  isScopeLoading: boolean;

  hydrateScope(): Promise<void>;
  setUserProfile(profile: UserProfile | null): Promise<void>;

  setActiveHousehold(householdId: string | null): Promise<void>;
  setActiveSubject(subjectId: string | null): Promise<void>;

  setScope(next: Partial<AppScope>): Promise<void>;
  clearScope(): Promise<void>;
};

const STORAGE_KEYS = {
  activeHouseholdId: "sg_active_household_id",
  activeSubjectId: "sg_active_subject_id",
  userProfile: "sg_user_profile_json",
};

const AppScopeContext = createContext<AppScopeState | null>(null);

export function AppScopeProvider({ children }: { children: React.ReactNode }) {
  const [isScopeLoading, setIsScopeLoading] = useState(true);

  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [activeHouseholdId, setActiveHouseholdIdState] = useState<string | null>(null);
  const [activeSubjectId, setActiveSubjectIdState] = useState<string | null>(null);

  const hydrateScope = async () => {
    setIsScopeLoading(true);
    try {
      const [householdId, subjectId, profileJson] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.activeHouseholdId),
        SecureStore.getItemAsync(STORAGE_KEYS.activeSubjectId),
        SecureStore.getItemAsync(STORAGE_KEYS.userProfile),
      ]);

      setActiveHouseholdIdState(householdId ?? null);
      setActiveSubjectIdState(subjectId ?? null);

      if (profileJson) {
        try {
          setUserProfileState(JSON.parse(profileJson));
        } catch {
          setUserProfileState(null);
        }
      } else {
        setUserProfileState(null);
      }
    } finally {
      setIsScopeLoading(false);
    }
  };

  useEffect(() => {
    // Hydrate once on app start
    hydrateScope();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistUserProfile = async (profile: UserProfile | null) => {
    if (!profile) {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.userProfile);
      return;
    }
    await SecureStore.setItemAsync(STORAGE_KEYS.userProfile, JSON.stringify(profile));
  };

  const persistHouseholdId = async (householdId: string | null) => {
    if (!householdId) {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.activeHouseholdId);
      return;
    }
    await SecureStore.setItemAsync(STORAGE_KEYS.activeHouseholdId, householdId);
  };

  const persistSubjectId = async (subjectId: string | null) => {
    if (!subjectId) {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.activeSubjectId);
      return;
    }
    await SecureStore.setItemAsync(STORAGE_KEYS.activeSubjectId, subjectId);
  };

  const value = useMemo<AppScopeState>(
    () => ({
      isScopeLoading,
      userProfile,
      activeHouseholdId,
      activeSubjectId,

      hydrateScope,

      async setUserProfile(profile) {
        setUserProfileState(profile);
        await persistUserProfile(profile);
      },

      async setActiveHousehold(householdId) {
        setActiveHouseholdIdState(householdId);
        await persistHouseholdId(householdId);

        // Optional safety: if household changes, subject may no longer be valid
        setActiveSubjectIdState(null);
        await persistSubjectId(null);
      },

      async setActiveSubject(subjectId) {
        setActiveSubjectIdState(subjectId);
        await persistSubjectId(subjectId);
      },

      async setScope(next) {
        // Apply partial updates, persist only what changed
        if ("userProfile" in next) {
          setUserProfileState(next.userProfile ?? null);
          await persistUserProfile(next.userProfile ?? null);
        }
        if ("activeHouseholdId" in next) {
          const hid = next.activeHouseholdId ?? null;
          setActiveHouseholdIdState(hid);
          await persistHouseholdId(hid);
        }
        if ("activeSubjectId" in next) {
          const sid = next.activeSubjectId ?? null;
          setActiveSubjectIdState(sid);
          await persistSubjectId(sid);
        }
      },

      async clearScope() {
        setUserProfileState(null);
        setActiveHouseholdIdState(null);
        setActiveSubjectIdState(null);

        await Promise.all([
          SecureStore.deleteItemAsync(STORAGE_KEYS.userProfile),
          SecureStore.deleteItemAsync(STORAGE_KEYS.activeHouseholdId),
          SecureStore.deleteItemAsync(STORAGE_KEYS.activeSubjectId),
        ]);
      },
    }),
    [isScopeLoading, userProfile, activeHouseholdId, activeSubjectId]
  );

  return <AppScopeContext.Provider value={value}>{children}</AppScopeContext.Provider>;
}

export function useAppScope() {
  const ctx = useContext(AppScopeContext);
  if (!ctx) throw new Error("useAppScope must be used within AppScopeProvider");
  return ctx;
}
