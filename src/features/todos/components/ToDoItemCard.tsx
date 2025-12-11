import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IToDo } from "../../../domain/models/todo";

interface Props {
  todo: IToDo;
  onToggle(): void;
  onDelete(): void;
}

const ToDoItemCard: React.FC<Props> = ({ todo, onToggle, onDelete }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onToggle} style={styles.row}>
        <View style={styles.checkbox} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {todo.title}
          </Text>
          <Text style={styles.description}>Description: {todo.description || "None"}</Text>
          <Text style={styles.description}>Due: {todo.dateDue|| "None"}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
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
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
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
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#f9fafb",
    fontSize: 16,
    fontWeight: "600",
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  description: {
    color: "#d1d5db",
    marginTop: 2,
  },
  deleteText: {
    color: "#f97373",
    marginLeft: 12,
  },
});

export default ToDoItemCard;
