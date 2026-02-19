import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WelcomeScreen } from "./WelcomeScreen";
import { ProfileSetupScreen } from "./ProfileSetupScreen";
import { HouseholdSetupScreen } from "./HouseholdSetupScreen";
import { OnboardingCompleteScreen } from "./OnboardingCompleteScreen";
import { useAppScope } from "@scope/AppScopeContext";
import { colors } from "@ui/theme";

export type OnboardingParamList = {
  Welcome: undefined;
  ProfileSetup: undefined;
  HouseholdSetup: undefined;
  OnboardingComplete: { householdId: string; subjectId: string };
};

const Stack = createNativeStackNavigator<OnboardingParamList>();

/**
 * Onboarding navigation stack.
 *
 * Shown by RootNav when the user is authenticated but hasn't completed
 * setup (missing activeHouseholdId or activeSubjectId).
 *
 * Picks the initial route based on how far the user got:
 * - No userProfile → start at Welcome (brand new user)
 * - Has userProfile → skip to HouseholdSetup (profile already created)
 *
 * Uses a `key` tied to whether a profile exists so React Navigation
 * re-mounts the navigator if the profile state changes — this ensures
 * `initialRouteName` is re-evaluated rather than stuck on the first render.
 */
export function OnboardingStack() {
  const { userProfile, isScopeLoading } = useAppScope();

  if (isScopeLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const hasProfile = !!userProfile;
  const initialRoute: keyof OnboardingParamList = hasProfile
    ? "HouseholdSetup"
    : "Welcome";

  return (
    <Stack.Navigator
      key={hasProfile ? "has-profile" : "no-profile"}
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: "fade",
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="HouseholdSetup" component={HouseholdSetupScreen} />
      <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
