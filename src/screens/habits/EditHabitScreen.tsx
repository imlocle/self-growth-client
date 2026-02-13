import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHabitFormController } from "../../features/habits/controllers/useHabitFormController";
import { useHabitListController } from "../../features/habits/controllers/useHabitListController";
import {
  HabitCounter,
  HabitDifficulty,
  HabitType,
  HABIT_COUNTER_OPTIONS,
  HABIT_DIFFICULTY_OPTIONS,
  HABIT_TYPE_OPTIONS,
} from "../../domain/models/habit";
import { Screen } from "../../ui/components/Screen";
import { AppButton } from "../../ui/components/AppButton";
import { colors } from "../../ui/theme/colors";
import { spacing } from "../../ui/theme/spacing";
import { radius } from "../../ui/theme/radius";
import { typography } from "../../ui/theme/typography";

type HabitStackParamList = {
  HabitList: undefined;
  CreateHabit: undefined;
  EditHabit: { habit: any };
};

type EditHabitNav = NativeStackNavigationProp<HabitStackParamList, "EditHabit">;
type EditHabitRoute = RouteProp<HabitStackParamList, "EditHabit">;

/**
 * Edit Habit Screen
 *
 * Form for editing an existing habit.
 * Pre-fills form with current habit data.
 * Supports updating and deleting habits.
 *
 * Features:
 * - Pre-filled form
 * - Input validation
 * - Update functionality
 * - Delete with confirmation
 * - Loading states
 * - Error display
 */
export const EditHabitScreen: React.FC = () => {
  const navigation = useNavigation<EditHabitNav>();
  const route = useRoute<EditHabitRoute>();
  const { habit } = route.params;

  const { updateHabit, isUpdating, updateError } = useHabitFormController();
  const { deleteHabit, isDeleting } = useHabitListController();

  const [title, setTitle] = useState(habit.title);
  const [description, setDescription] = useState(habit.description || "");
  const [counter, setCounter] = useState<HabitCounter>(habit.counter || "daily");
  const [difficulty, setDifficulty] = useState<HabitDifficulty>(habit.difficulty || "medium");
  const [type, setType] = useState<HabitType>(habit.type || "build");
  const [localError, setLocalError] = useState("");

  /**
   * Handles form submission
   */
  const handleSubmit = async () => {
    setLocalError("");

    // Client-side validation
    if (!title.trim()) {
      setLocalError("Title is required");
      return;
    }

    try {
      await updateHabit({
        id: habit.id,
        title: title.trim(),
        description: description.trim() || undefined,
        counter,
        difficulty,
        type,
      });

      // Success - navigate back
      navigation.goBack();
    } catch (error: any) {
      setLocalError(error.message || "Failed to update habit");
    }
  };

  /**
   * Handles habit deletion with confirmation
   */
  const handleDelete = () => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteHabit(habit.id);
              navigation.goBack();
            } catch (error) {
              setLocalError("Failed to delete habit");
            }
          },
        },
      ]
    );
  };

  const errorMessage = localError || updateError?.message;
  const isLoading = isUpdating || isDeleting;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Title Input */}
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={[styles.input, errorMessage && styles.inputError]}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Morning run"
            placeholderTextColor={colors.textMuted}
          />
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>

        {/* Description Input */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Optional details about this habit"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Habit Type */}
        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.optionsRow}>
            {HABIT_TYPE_OPTIONS.map((option) => (
              <Pressable
                key={option.key}
                style={[
                  styles.option,
                  type === option.key && styles.optionSelected,
                ]}
                onPress={() => setType(option.key)}
              >
                <Text
                  style={[
                    styles.optionText,
                    type === option.key && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Counter */}
        <View style={styles.field}>
          <Text style={styles.label}>Frequency</Text>
          <View style={styles.optionsRow}>
            {HABIT_COUNTER_OPTIONS.map((option) => (
              <Pressable
                key={option.key}
                style={[
                  styles.option,
                  counter === option.key && styles.optionSelected,
                ]}
                onPress={() => setCounter(option.key)}
              >
                <Text
                  style={[
                    styles.optionText,
                    counter === option.key && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Difficulty */}
        <View style={styles.field}>
          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.optionsRow}>
            {HABIT_DIFFICULTY_OPTIONS.map((option) => (
              <Pressable
                key={option.key}
                style={[
                  styles.option,
                  difficulty === option.key && styles.optionSelected,
                ]}
                onPress={() => setDifficulty(option.key)}
              >
                <Text
                  style={[
                    styles.optionText,
                    difficulty === option.key && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.optionStars}>{"⭐".repeat(option.stars)}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <AppButton
            title={isUpdating ? "Updating..." : "Update Habit"}
            onPress={handleSubmit}
            disabled={isLoading || !title.trim()}
            style={styles.updateButton}
          />

          <Pressable
            onPress={handleDelete}
            disabled={isLoading}
            style={[styles.deleteButton, isLoading && styles.deleteButtonDisabled]}
          >
            <Text style={styles.deleteButtonText}>
              {isDeleting ? "Deleting..." : "Delete Habit"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xxl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.danger,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionTextSelected: {
    color: colors.primary,
  },
  optionDescription: {
    color: colors.textMuted,
    fontSize: 12,
  },
  optionStars: {
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  updateButton: {
    marginBottom: 0,
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.danger,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditHabitScreen;
