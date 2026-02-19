import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { saveTokens, clearTokens, getAccessToken } from "./tokenStorage";
import * as authApi from "./authApi";
import { useAppScope } from "@scope/AppScopeContext";
import type { IUserProfile } from "@domain/models/profile";
import { profileService } from "@features/profile/services/profileService";

type AuthState = {
  isLoading: boolean;
  isAuthed: boolean;

  signup(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<void>;

  confirmAndLogin(
    email: string,
    password: string,
    confirmationCode: string
  ): Promise<void>;

  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  const { setUserProfile, clearScope } = useAppScope();

  /**
   * Fetches the user's profile from the API and stores it in app scope.
   *
   * Only touches `userProfile` — never overwrites `activeHouseholdId` or
   * `activeSubjectId`, because those are managed independently via
   * SecureStore hydration (cold start) and the onboarding flow (first time).
   *
   * If the profile doesn't exist yet (404), that's fine — the user will
   * land in the onboarding flow where they can create one.
   */
  const bootstrapScope = async () => {
    try {
      const profile: IUserProfile = await profileService.get();
      await setUserProfile(profile);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        // No profile yet — user will go through onboarding
        return;
      }
      throw error;
    }
  };

  /**
   * Runs once on app start.
   *
   * Checks SecureStore for a saved access token. If one exists, the user
   * is still authenticated — we set `isAuthed` and fetch their profile
   * from the API so the navigation tree can decide where to send them
   * (MainTabs vs OnboardingStack).
   *
   * `activeHouseholdId` and `activeSubjectId` are already restored by
   * `AppScopeProvider.hydrateScope()` which runs on its own mount, so
   * we don't need to touch those here.
   */
  useEffect(() => {
    (async () => {
      // DEV ONLY: uncomment to force logged out
      // await clearTokens();
      // await clearScope();

      const token = await getAccessToken();

      if (token) {
        setIsAuthed(true);

        // Fetch profile so OnboardingStack knows whether to skip ProfileSetup
        try {
          await bootstrapScope();
        } catch (error) {
          // Non-fatal — user will see onboarding if profile is missing
        }
      }

      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      isLoading,
      isAuthed,

      /**
       * Creates a new Cognito account. Does NOT authenticate the user —
       * they must confirm their email first, then call `login()`.
       */
      async signup(email, password, firstName, lastName) {
        await authApi.signup({ email, password, firstName, lastName });
      },

      /**
       * Authenticates with email + password, saves tokens, then fetches
       * the user's profile (if it exists) so navigation can route correctly.
       */
      async login(email, password) {
        const data = await authApi.login({ email, password });

        await saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          idToken: data.idToken,
        });

        setIsAuthed(true);

        try {
          await bootstrapScope();
        } catch (error) {
          // Non-fatal — user will see onboarding if profile is missing
        }
      },

      /**
       * Confirms the signup code, then immediately logs in and bootstraps
       * scope. Used right after the user enters their confirmation code.
       */
      async confirmAndLogin(email, password, confirmationCode) {
        await authApi.confirmSignup({ email, confirmationCode });

        const data = await authApi.login({ email, password });

        await saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          idToken: data.idToken,
        });

        setIsAuthed(true);

        try {
          await bootstrapScope();
        } catch (error) {
          // Non-fatal — user will see onboarding if profile is missing
        }
      },

      /**
       * Clears all tokens and scope, returning the user to the auth screens.
       */
      async logout() {
        await clearTokens();
        await clearScope();
        setIsAuthed(false);
      },
    }),
    [isLoading, isAuthed, clearScope, setUserProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
