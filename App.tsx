import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MainTabs } from "@navigation/MainTabs";
import { AuthProvider, useAuth } from "@auth/AuthContext";
import { AuthStack } from "@navigation/AuthStack";
import { AppScopeProvider, useAppScope } from "@scope/AppScopeContext";
import { OnboardingStack } from "@screens/onboarding/OnboardingStack";
import { colors } from "@ui/theme/colors";

const queryClient = new QueryClient();

function RootNav() {
  const { isLoading: isAuthLoading, isAuthed } = useAuth();
  const { isScopeLoading, activeHouseholdId, activeSubjectId } = useAppScope();

  if (isAuthLoading || isScopeLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Not authenticated — show auth screens
  if (!isAuthed) {
    return <AuthStack />;
  }

  // Authenticated but missing scope — show onboarding
  if (!activeHouseholdId || !activeSubjectId) {
    return <OnboardingStack />;
  }

  // Fully set up — show main app
  return <MainTabs />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppScopeProvider>
          <AuthProvider>
            <NavigationContainer>
              <RootNav />
            </NavigationContainer>
          </AuthProvider>
        </AppScopeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
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
