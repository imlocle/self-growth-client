import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ToDoScreen } from "../screens/todos/ToDoScreen";
import { CreateToDoScreen } from "../screens/todos/CreateToDoScreen";

export type ToDoStackParamList = {
  ToDoList: undefined;
  CreateToDo: undefined;
};

const Stack = createNativeStackNavigator<ToDoStackParamList>();

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
        options={{ title: "New ToDo" }}
      />
    </Stack.Navigator>
  );
};
