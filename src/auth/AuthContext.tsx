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

  const { setScope, clearScope } = useAppScope();

  useEffect(() => {
    (async () => {
      // DEV ONLY: uncomment to force logged out
      // await clearTokens();
      // await clearScope();

      const token = await getAccessToken();
      setIsAuthed(!!token);
      setIsLoading(false);
    })();
  }, [clearScope]);

  const bootstrapScope = async (fallbackProfileInput?: {
    firstName?: string;
    lastName?: string;
  }) => {
    // getOrCreate handles 404 and creates profile if missing
    const profile: IUserProfile = await profileService.getOrCreate({
      firstName: fallbackProfileInput?.firstName,
      lastName: fallbackProfileInput?.lastName,
    });

    await setScope({
      userProfile: profile,
      activeHouseholdId: profile.defaultHouseholdId ?? null,
      activeSubjectId: profile.defaultSubjectId ?? null,
    });
  };

  const value = useMemo<AuthState>(
    () => ({
      isLoading,
      isAuthed,

      async signup(email, password, firstName, lastName) {
        await authApi.signup({ email, password, firstName, lastName });
        // Signup does not set isAuthed. User must confirm then login.
      },

      async login(email, password) {
        const data = await authApi.login({ email, password });

        await saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          idToken: data.idToken,
        });

        await bootstrapScope();
        setIsAuthed(true);
      },

      async confirmAndLogin(email, password, confirmationCode) {
        await authApi.confirmSignup({ email, confirmationCode });

        const data = await authApi.login({ email, password });

        await saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          idToken: data.idToken,
        });

        // If your profile create endpoint uses names, you can pass them here,
        // but typically you won't have them on confirm screen.
        await bootstrapScope();
        setIsAuthed(true);
      },

      async logout() {
        await clearTokens();
        await clearScope();
        setIsAuthed(false);
      },
    }),
    [isLoading, isAuthed, clearScope, setScope]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
