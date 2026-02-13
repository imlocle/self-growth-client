import React from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IToDo } from "../../domain/models/todo";
import { useToDoListController } from "../../features/todos/controllers/useToDoListController";
import ToDoItemCard from "../../features/todos/components/ToDoItemCard";
import { Screen } from "../../ui/components/Screen";
import { colors } from "../../ui/theme/colors";
import { spacing } from "../../ui/theme/spacing";
import { ToDoStackParamList } from "../../navigation/ToDoStack";

type ToDoNav = NativeStackNavigationProp<ToDoStackParamList, "ToDoList">;

/**
 * ToDo List Screen
 *
 * Displays a list of all todos for the active subject.
 * Supports toggling completion and navigating to edit screen.
 *
 * Features:
 * - List of active and completed todos
 * - Toggle completion functionality
 * - Tap to edit
 * - Loading and error states
 * - Empty state
 * - Scope validation
 */
export const ToDoScreen: React.FC = () => {
  const {
    todos,
    isLoading,
    error,
    toggleComplete,
    hasScope,
    isToggling,
  } = useToDoListController();

  const navigation = useNavigation<ToDoNav>();

  /**
   * Filters todos to show only active and completed (not deleted)
   */
  const visibleTodos = todos.filter((todo) => todo.status !== "deleted");

  /**
   * No scope selected - show message
   */
  if (!hasScope) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.text}>No household/subject selected yet.</Text>
          <Text style={styles.text}>
            Create/select one to start tracking todos.
          </Text>
        </View>
      </Screen>
    );
  }

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.text}>Loading todos...</Text>
        </View>
      </Screen>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={[styles.text, styles.error]}>
            Failed to load todos. Check your connection.
          </Text>
        </View>
      </Screen>
    );
  }

  /**
   * Renders a single todo card
   */
  const renderItem = ({ item }: { item: IToDo }) => (
    <ToDoItemCard
      todo={item}
      onToggle={() => toggleComplete(item)}
      onPress={() => navigation.navigate("EditToDo", { todo: item })}
    />
  );

  /**
   * Empty state
   */
  if (visibleTodos.length === 0) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No todos yet. Tap the + to create one.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Loading overlay for mutations */}
      {isToggling && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      <FlatList
        data={visibleTodos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  text: {
    color: colors.textSoft,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  error: {
    color: colors.danger,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 16,
  },
  loadingOverlay: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    zIndex: 1000,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: 20,
  },
});

export default ToDoScreen;
