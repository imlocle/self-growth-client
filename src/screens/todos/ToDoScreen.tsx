import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { IToDo } from "../../domain/models/todo";
import { useToDoListController } from "../../features/todos/controllers/useToDoListController";
import ToDoItemCard from "../../features/todos/components/ToDoItemCard";

export const ToDoScreen: React.FC = () => {
  const {
    todos,
    isLoading,
    error,
    toggleComplete,
    deleteTodo,
  } = useToDoListController();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.text}>Loading todos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.text, styles.error]}>
          Failed to load todos. Check API_BASE_URL or your backend.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IToDo }) => (
    <ToDoItemCard
      todo={item}
      onToggle={() => toggleComplete(item)}
      onDelete={() => deleteTodo(item.id)}
      />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No To Dos yet. Add your first one!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
  },
  center: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: "#f9fafb",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  text: {
    color: "#e5e7eb",
    marginTop: 8,
  },
  error: {
    color: "#fca5a5",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#111827",
    color: "#f9fafb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: "#022c22",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 32,
  },
  todoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  todoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#9ca3af",
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  todoTextContainer: {
    flex: 1,
  },
  todoTitle: {
    color: "#f9fafb",
    fontSize: 16,
    fontWeight: "600",
  },
  todoTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  todoDescription: {
    color: "#d1d5db",
    marginTop: 2,
  },
  deleteText: {
    color: "#f97373",
    marginLeft: 12,
  },
  emptyText: {
    color: "#6b7280",
    textAlign: "center",
    marginTop: 24,
  },
});
