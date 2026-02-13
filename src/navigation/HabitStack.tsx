import React from "react";
import { Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { IHabit } from "@domain/models/habit";
import HabitListScreen from "@screens/habits/HabitListScreen";
import CreateHabitScreen from "@screens/habits/CreateHabitScreen";
import EditHabitScreen from "@screens/habits/EditHabitScreen";
import { colors } from "@ui/theme/colors";

/**
 * Habit Stack Parameter List
 *
 * Defines the screens and their parameters in the Habit stack.
 */
export type HabitStackParamList = {
  HabitList: undefined;
  CreateHabit: undefined;
  EditHabit: { habit: IHabit };
};

const Stack = createNativeStackNavigator<HabitStackParamList>();

/**
 * Habit Stack Navigator
 *
 * Navigation stack for the Habits feature.
 * Includes list, create, and edit screens.
 *
 * Features:
 * - List screen with FAB button to create
 * - Create screen with form
 * - Edit screen with update/delete
 * - Consistent header styling
 */
export const HabitStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="HabitList"
        component={HabitListScreen}
        options={({ navigation }) => ({
          title: "Habits",
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("CreateHabit")}
              style={{ padding: 8 }}
            >
              <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="CreateHabit"
        component={CreateHabitScreen}
        options={{
          title: "Create Habit",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="EditHabit"
        component={EditHabitScreen}
        options={{
          title: "Edit Habit",
        }}
      />
    </Stack.Navigator>
  );
};
