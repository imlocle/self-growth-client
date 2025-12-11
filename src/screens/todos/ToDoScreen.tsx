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
import { Screen } from "../../ui/components/Screen"
import { colors } from "../../ui/theme/colors";
import { spacing } from "../../ui/theme/spacing";
import { typography } from "../../ui/theme/typography";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ToDoStackParamList } from "../../navigation/ToDoStack";

type ToDoNav = NativeStackNavigationProp<ToDoStackParamList, "ToDoList">;

export const ToDoScreen: React.FC = () => {
  const {
    todos,
    isLoading,
    error,
    toggleComplete,
    deleteTodo,
  } = useToDoListController();

  const navigation = useNavigation<ToDoNav>();

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.text}>Loading todos...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={[styles.text, styles.error]}>
            Failed to load todos. Check API_BASE_URL or your backend.
          </Text>
        </View>
      </Screen>
    );
  }

  const renderItem = ({ item }: { item: IToDo }) => (
    <ToDoItemCard
      todo={item}
      onToggle={() => toggleComplete(item)}
      onDelete={() => deleteTodo(item.id)}
      onPress={() => navigation.navigate("EditToDo", {todo: item})}
      />
  );

  return (
    <Screen>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No To Dos yet. Tap the + to create one.</Text>
        }
        />
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: colors.text,
    ...typography.heading,
    marginBottom: spacing.lg,
  },
  text: {
    color: colors.textSoft,
    marginTop: spacing.sm,
  },
  error: {
    color: "#fca5a5",
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});

export default ToDoScreen;
