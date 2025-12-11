import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ToDoStackParamList } from "../../navigation/ToDoStack";
import { todoService } from "../../features/todos/services/todoService";
import { ICreateToDoInput } from "../../features/todos/repositories/todoRepository";

type Props = NativeStackScreenProps<ToDoStackParamList, "CreateToDo">;

export const CreateToDoScreen: React.FC<Props> = ({ navigation }) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const createMutation = useMutation({
    mutationFn: (input: ICreateToDoInput) => todoService.create(input),
    onSuccess: () => {
      // refresh list and go back
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      navigation.goBack();
    },
  });

  const dateDue = date ? date.toISOString().split("T")[0] : undefined;

  const handleSave = () => {
    if (!title.trim()) return;
    createMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      dateDue,
    });
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        placeholderTextColor="#6b7280"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Enter description"
        placeholderTextColor="#6b7280"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Due Date</Text>
      <View style={styles.dateRow}>
        <Text style={styles.dateText}>
          {dateDue ?? "No date selected"}
        </Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateButtonText}>Pick Date</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={date ?? new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity
        style={[
          styles.saveButton,
          (!title.trim() || createMutation.isPending) && styles.saveButtonDisabled,
        ]}
        onPress={handleSave}
        disabled={!title.trim() || createMutation.isPending}
      >
        <Text style={styles.saveButtonText}>
          {createMutation.isPending ? "Saving..." : "Save ToDo"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
  },
  label: {
    color: "#e5e7eb",
    fontSize: 14,
    marginBottom: 4,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#111827",
    color: "#f9fafb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  dateText: {
    flex: 1,
    color: "#9ca3af",
  },
  dateButton: {
    backgroundColor: "#1d4ed8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateButtonText: {
    color: "#eff6ff",
    fontWeight: "600",
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#022c22",
    fontWeight: "700",
    fontSize: 16,
  },
});
