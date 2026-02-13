import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { ToDoStackParamList } from "../../navigation/ToDoStack";
import { useToDoFormController } from "../../features/todos/controllers/useToDoFormController";
import { Difficulty, DIFFICULTY_OPTIONS, ICreateToDoInput } from "../../domain/models/todo";

import { Screen } from "../../ui/components/Screen";
import { AppButton } from "../../ui/components/AppButton";
import { colors } from "../../ui/theme/colors";
import { spacing } from "../../ui/theme/spacing";
import { radius } from "../../ui/theme/radius";

type Props = NativeStackScreenProps<ToDoStackParamList, "CreateToDo">;

/**
 * Create ToDo Screen
 *
 * Form for creating a new todo with:
 * - Title (required)
 * - Description (optional)
 * - Due date (optional)
 * - Checklist items (optional)
 * - Difficulty level (optional)
 *
 * Features:
 * - Input validation
 * - Error display
 * - Loading state
 * - Auto-navigation on success
 * - Checklist management
 * - Date picker integration
 *
 * @param navigation - React Navigation prop for screen navigation
 */
export const CreateToDoScreen: React.FC<Props> = ({ navigation }) => {
  const { createTodo, isCreating, createError, hasScope } = useToDoFormController();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const [checklistInput, setChecklistInput] = useState("");
  const [checklistItems, setChecklistItems] = useState<string[]>([]);

  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [localError, setLocalError] = useState("");

  const dateDue = date ? date.toISOString().split("T")[0] : undefined;

  /**
   * Handles form submission
   */
  const handleSave = async () => {
    setLocalError("");

    // Client-side validation
    if (!title.trim()) {
      setLocalError("Title is required");
      return;
    }

    try {
      const payload: ICreateToDoInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        dateDue,
        checklist: checklistItems.length ? checklistItems : undefined,
        difficulty: difficulty ?? undefined,
      };

      await createTodo(payload);
      // Success - navigate back
      navigation.goBack();
    } catch (error: any) {
      setLocalError(error.message || "Failed to create todo");
    }
  };

  /**
   * Handles date picker change
   */
  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  /**
   * Adds a new item to the checklist
   */
  const handleAddChecklistItem = () => {
    const value = checklistInput.trim();
    if (!value) return;
    setChecklistItems((prev) => [...prev, value]);
    setChecklistInput("");
  };

  /**
   * Removes an item from the checklist
   */
  const handleRemoveChecklistItem = (index: number) => {
    setChecklistItems((prev) => prev.filter((_, i) => i !== index));
  };

  const errorMessage = localError || createError?.message;
  const isSaveDisabled = !hasScope || !title.trim() || isCreating;

  if (!hasScope) {
    return (
      <Screen>
        <Text style={styles.noScopeText}>
          No household/subject selected yet.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Title Input */}
        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.requiredStar}>*</Text>
          </View>
          <TextInput
            style={[styles.input, errorMessage && styles.inputError]}
            placeholder="Enter title"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>

        {/* Description Input */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Enter description (optional)"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Checklist */}
        <View style={styles.field}>
          <Text style={styles.label}>Checklist</Text>

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
        </View>

        {/* Difficulty */}
        <View style={styles.field}>
          <Text style={styles.label}>Difficulty</Text>
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
                        color={selected ? colors.primary : colors.textMuted}
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
        </View>

        {/* Due Date */}
        <View style={styles.field}>
          <Text style={styles.label}>Due Date</Text>

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
        </View>

        {/* Submit Button */}
        <AppButton
          title={isCreating ? "Creating..." : "Create ToDo"}
          onPress={handleSave}
          disabled={isSaveDisabled}
          style={styles.submitButton}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xxl,
  },
  noScopeText: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: "center",
  },
  field: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
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
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  checklistInput: {
    flex: 1,
    marginTop: 0,
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
    gap: spacing.sm,
  },
  difficultyItem: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  difficultyItemSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
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
    color: colors.primary,
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
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
  submitButton: {
    marginTop: spacing.lg,
  },
});