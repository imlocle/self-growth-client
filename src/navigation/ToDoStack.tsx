import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ToDoScreen } from "@screens/todos/ToDoScreen";
import { CreateToDoScreen } from "@screens/todos/CreateToDoScreen";
import { EditToDoScreen } from "@screens/todos/EditToDoScreen";
import { IToDo } from "@domain/models/todo";

/**
 * ToDo Stack Navigation Parameter List
 *
 * Defines the routes and their parameters for the ToDo feature stack.
 *
 * Routes:
 * - ToDoList: Main list view of all todos
 * - CreateToDo: Form for creating a new todo
 * - EditToDo: Form for editing an existing todo (requires todo object)
 */
export type ToDoStackParamList = {
  ToDoList: undefined;
  CreateToDo: undefined;
  EditToDo: { todo: IToDo };
};

const Stack = createNativeStackNavigator<ToDoStackParamList>();

/**
 * ToDo Stack Navigator
 *
 * Navigation stack for the ToDo feature containing:
 * - List screen with all todos
 * - Create screen for new todos
 * - Edit screen for updating existing todos
 *
 * Features:
 * - Consistent header styling
 * - Proper type safety with TypeScript
 * - Seamless navigation between screens
 *
 * @returns React Navigation stack navigator component
 *
 * @example
 * ```typescript
 * // In MainTabs.tsx
 * <Tab.Screen
 *   name="ToDos"
 *   component={ToDoStackNavigator}
 *   options={{ headerShown: false }}
 * />
 * ```
 */
export const ToDoStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#020617" },
        headerTintColor: "#f9fafb",
      }}
    >
      <Stack.Screen
        name="ToDoList"
        component={ToDoScreen}
        options={{
          title: "To Dos",
        }}
      />
      <Stack.Screen
        name="CreateToDo"
        component={CreateToDoScreen}
        options={{ title: "New To Do" }}
      />
      <Stack.Screen
        name="EditToDo"
        component={EditToDoScreen}
        options={{ title: "Edit To Do" }}
      />
    </Stack.Navigator>
  );
};
