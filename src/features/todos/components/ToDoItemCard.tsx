import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IToDo } from "../../../domain/models/todo";

interface Props {
  todo: IToDo;
  onToggle(): void;
  onDelete(): void; // still in interface if you use it elsewhere, but not used here
  onPress(): void;
}

const ToDoItemCard: React.FC<Props> = ({ todo, onToggle, onPress }) => {
  const isCompleted = todo.status === "completed"
  const isDeleted = todo.status === "deleted";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={false}
    >
      <View
        style={[
          styles.card,
          isCompleted && styles.cardCompleted,
          isDeleted && styles.cardDeleted,
        ]}
      >
        {/* Checkbox on the left */}
        <TouchableOpacity
          onPress={onToggle}
          style={styles.checkboxContainer}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              isCompleted && styles.checkboxCompleted,
            ]}
          />
        </TouchableOpacity>

        {/* Text area - tap here will trigger onPress (because of outer touchable) */}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              (isCompleted || isDeleted) && styles.titleCompleted,
            ]}
            numberOfLines={2}
          >
            {todo.title}
          </Text>

          {todo.description ? (
            <Text
              style={styles.description}
              numberOfLines={3}
            >
              {todo.description}
            </Text>
          ) : null}

          {todo.dateDue ? (
            <Text style={styles.meta}>{todo.dateDue}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#1f2933",
    flexDirection: "row",
    alignItems: "center",
  },
  cardCompleted: {
    backgroundColor: "#111827",
    opacity: 0.8,
  },
  cardDeleted: {
    backgroundColor: "#020617",
    opacity: 0.5,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#9ca3af",
  },
  checkboxCompleted: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
  title: {
    color: "#f9fafb",
    fontSize: 16,
    fontWeight: "600",
  },
  titleCompleted: {
    color: "#9ca3af",
  },
  description: {
    color: "#d1d5db",
    marginTop: 2,
  },
  meta: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },
});

export default ToDoItemCard;
