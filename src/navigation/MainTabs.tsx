import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ToDoStackNavigator } from "./ToDoStack";
import { HabitStackNavigator } from "./HabitStack";
import { ProfileScreen } from "@screens/ProfileScreen";
import { CustomTabBar } from "./CustomTabBar";

export type RootTabParamList = {
  ToDos: undefined;
  Habits: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        // header for individual screens (stack will override where needed)
        headerStyle: { backgroundColor: "#111827" },
        headerTintColor: "#f9fafb",
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="ToDos"
        component={ToDoStackNavigator}
        options={{ headerShown: false }} // stack handles its own header
      />
      <Tab.Screen
        name="Habits"
        component={HabitStackNavigator}
        options={{ headerShown: false }} // stack handles its own header
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
