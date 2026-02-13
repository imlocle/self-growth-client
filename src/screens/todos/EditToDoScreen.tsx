import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { ToDoStackParamList } from "../../navigation/ToDoStack";
import { todoService } from "../../features/todos/services/todoService";
import { Difficulty, DIFFICULTY_OPTIONS, IToDo, IUpdateToDoInput } from "../../domain/models/todo";

import { Screen } from "../../ui/components/Screen";
import { AppButton } from "../../ui/components/AppButton";
import { colors } from "../../ui/theme/colors";
import { spacing } from "../../ui/theme/spacing";
import { radius } from "../../ui/theme/radius";
import { useAppScope } from "../../scope/AppScopeContext";

type Props = NativeStackScreenProps<ToDoStackParamList, "EditToDo">

export const EditToDoScreen: React.FC<Props> = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const todo: IToDo = route.params.todo;

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [date, setDate] = useState<Date | null>(
    todo.dateDue ? new Date(todo.dateDue) : null
  );
  const [showPicker, setShowPicker] = useState(false);

  const [checklistInput, setChecklistInput] = useState("");
  const [checklistItems, setChecklistItems] = useState<string[]>(
    todo.checklist ?? []
  );

  const [difficulty, setDifficulty] = useState<Difficulty | null>(
    (todo.difficulty as Difficulty) ?? null
  );
  const { activeHouseholdId, activeSubjectId } = useAppScope();
  const hasScope = !!activeHouseholdId && !!activeSubjectId;

  const updateMutation = useMutation({
    mutationFn: (input: IUpdateToDoInput) =>
      todoService.update(activeHouseholdId!, activeSubjectId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos", activeHouseholdId, activeSubjectId],
      });
      navigation.goBack();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      todoService.delete(activeHouseholdId!, activeSubjectId!, todo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos", activeHouseholdId, activeSubjectId],
      });
      navigation.goBack();
    },
  });

  const dateDue = date ? date.toISOString().split("T")[0] : undefined;

  const handleSave = () => {
    if (!title.trim()) return;

    const payload: IUpdateToDoInput = {
      id: todo.id,
      title: title.trim(),
      description: description.trim() || undefined,
      dateDue,
      checklist: checklistItems.length ? checklistItems : undefined,
      difficulty: difficulty ?? undefined,
    };

    updateMutation.mutate(payload);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete To Do",
      "Are you sure you want to delete this To Do?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleAddChecklistItem = () => {
    const value = checklistInput.trim();
    if (!value) return;
    setChecklistItems((prev) => [...prev, value]);
    setChecklistInput("");
  };

  const handleRemoveChecklistItem = (index: number) => {
    setChecklistItems((prev) => prev.filter((_, i) => i !== index));
  };

  const isSaveDisabled = !hasScope || !title.trim() || updateMutation.isPending;
  const isDeleteDisabled = !hasScope || deleteMutation.isPending;


  return (
    <Screen>
      {/* TITLE */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.requiredStar}>*</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter title"
        placeholderTextColor={colors.textMuted}
        value={title}
        onChangeText={setTitle}
      />

      {/* DESCRIPTION */}
      <Text style={[styles.label, { marginTop: spacing.lg }]}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Enter description (optional)"
        placeholderTextColor={colors.textMuted}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* CHECKLIST */}
      <Text style={[styles.label, { marginTop: spacing.lg }]}>
        Checklist
      </Text>

      <View style={styles.checklistRow}>
        <TextInput
          style={[styles.input, styles.checklistInput]}
          placeholder="Add checklist item"
          placeholderTextColor={colors.textMuted}
          value={checklistInput}
          onChangeText={setChecklistInput}
        />
        <TouchableOpacity
          style={styles.checklistAddButton}
          onPress={handleAddChecklistItem}
        >
          <Text style={styles.checklistAddText}>Add</Text>
        </TouchableOpacity>
      </View>

      {checklistItems.length > 0 && (
        <View style={styles.checklistList}>
          {checklistItems.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.checklistItemRow}>
              <Text style={styles.checklistBullet}>•</Text>
              <Text style={styles.checklistText}>{item}</Text>
              <TouchableOpacity
                style={styles.checklistRemoveButton}
                onPress={() => handleRemoveChecklistItem(index)}
              >
                <Ionicons name="close" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* DIFFICULTY */}
      <Text style={[styles.label, { marginTop: spacing.lg }]}>Difficulty</Text>
      <View style={styles.difficultyRow}>
        {DIFFICULTY_OPTIONS.map((opt) => {
          const selected = difficulty === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.difficultyItem,
                selected && styles.difficultyItemSelected,
              ]}
              onPress={() =>
                setDifficulty((prev) => (prev === opt.key ? null : opt.key))
              }
              activeOpacity={0.8}
            >
              <View style={styles.starsRow}>
                {Array.from({ length: opt.stars }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={18}
                    color={selected ? "#22c55e" : colors.textMuted}
                    style={styles.starIcon}
                  />
                ))}
              </View>
              <Text
                style={[
                  styles.difficultyLabel,
                  selected && styles.difficultyLabelSelected,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* DUE DATE */}
      <Text style={[styles.label, { marginTop: spacing.lg }]}>Due Date</Text>
      <View style={styles.dateRow}>
        <Text style={styles.dateText}>{dateDue ?? "No date selected"}</Text>
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

      {/* SAVE BUTTON */}
      <AppButton
        title={updateMutation.isPending ? "Saving..." : "Save Changes"}
        onPress={handleSave}
        disabled={isSaveDisabled}
        style={[styles.saveButton, isSaveDisabled && styles.disabledButton]}
      />
    <TouchableOpacity
        style={[styles.deleteButton, isDeleteDisabled && styles.disabledButton]}
        onPress={handleDelete}
        disabled={isDeleteDisabled}
      >
        <Text style={styles.deleteButtonText}>
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </Text>
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  requiredStar: {
    color: colors.danger,
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "700",
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  multiline: {
    height: 120,
    textAlignVertical: "top",
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  checklistInput: {
    flex: 1,
    marginRight: spacing.sm,
  },
  checklistAddButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  checklistAddText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 13,
  },
  checklistList: {
    marginTop: spacing.sm,
  },
  checklistItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  checklistBullet: {
    color: colors.textMuted,
    marginRight: spacing.xs,
  },
  checklistText: {
    flex: 1,
    color: colors.textSoft,
    fontSize: 14,
  },
  checklistRemoveButton: {
    paddingHorizontal: spacing.xs,
  },
  difficultyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  difficultyItem: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceAlt,
    alignItems: "center",
  },
  difficultyItemSelected: {
    borderColor: "#22c55e",
    backgroundColor: "#022c22",
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: spacing.xs,
  },
  starIcon: {
    marginHorizontal: 1,
  },
  difficultyLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  difficultyLabelSelected: {
    color: "#22c55e",
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  dateText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 14,
  },
  dateButton: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  dateButtonText: {
    color: colors.text,
    fontWeight: "600",
  },
  saveButton: {
    marginTop: spacing.xxl,
  },
  disabledButton: {
    opacity: 0.5,
  },
  deleteButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
    backgroundColor: "#7f1d1d",
  },
  deleteButtonText: {
    color: "#fecaca",
    fontWeight: "600",
  },
});
