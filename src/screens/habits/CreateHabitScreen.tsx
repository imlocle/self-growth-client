import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHabitFormController } from "@features/habits/controllers/useHabitFormController";
import {
  HabitCounter,
  HabitDifficulty,
  HabitType,
  HABIT_COUNTER_OPTIONS,
  HABIT_DIFFICULTY_OPTIONS,
  HABIT_TYPE_OPTIONS,
} from "@domain/models/habit";
import { Screen } from "@ui/components/Screen";
import { AppButton } from "@ui/components/AppButton";
import { colors } from "@ui/theme/colors";
import { spacing } from "@ui/theme/spacing";
import { radius } from "@ui/theme/radius";
import { typography } from "@ui/theme/typography";

type HabitStackParamList = {
  HabitList: undefined;
  CreateHabit: undefined;
  EditHabit: { habit: any };
};

type CreateHabitNav = NativeStackNavigationProp<HabitStackParamList, "CreateHabit">;

/**
 * Create Habit Screen
 *
 * Form for creating a new habit with:
 * - Title (required)
 * - Description (optional)
 * - Counter type (daily/weekly/monthly)
 * - Difficulty level
 * - Habit type (build/quit)
 *
 * Features:
 * - Input validation
 * - Error display
 * - Loading state
 * - Auto-navigation on success
 */
export const CreateHabitScreen: React.FC = () => {
  const navigation = useNavigation<CreateHabitNav>();
  const { createHabit, isCreating, createError } = useHabitFormController();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [counter, setCounter] = useState<HabitCounter>("daily");
  const [difficulty, setDifficulty] = useState<HabitDifficulty>("medium");
  const [type, setType] = useState<HabitType>("build");
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
      await createHabit({
        title: title.trim(),
        description: description.trim() || undefined,
        counter,
        difficulty,
        type,
        status: "active",
      });

      // Success - navigate back
      navigation.goBack();
    } catch (error: any) {
      setLocalError(error.message || "Failed to create habit");
    }
  };

  const errorMessage = localError || createError?.message;

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

        {/* Submit Button */}
        <AppButton
          title={isCreating ? "Creating..." : "Create Habit"}
          onPress={handleSubmit}
          disabled={isCreating || !title.trim()}
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
  submitButton: {
    marginTop: spacing.lg,
  },
});

export default CreateHabitScreen;
