import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ToDoScreen } from "../screens/todos/ToDoScreen";

// import HabitListScreen from "../../features/habits/handlers/HabitListScreen";
// import BlogListScreen from "../../features/blog/handlers/BlogListScreen";
// import ProfileScreen from "../../features/profile/handlers/ProfileScreen";

const Tab = createBottomTabNavigator();

export const RootNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen name="ToDos" component={ToDoScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);
