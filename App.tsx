import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MainTabs } from "@navigation/MainTabs";
import { AuthProvider, useAuth } from "@auth/AuthContext";
import { AuthStack } from "@navigation/AuthStack";
import { AppScopeProvider } from "@scope/AppScopeContext";

const queryClient = new QueryClient();

function RootNav() {
  const { isLoading, isAuthed } = useAuth();
  if (isLoading) return null;
  return isAuthed ? <MainTabs /> : <AuthStack />;
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
