import React from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IHabit } from "../../domain/models/habit";
import { useHabitListController } from "../../features/habits/controllers/useHabitListController";
import HabitCard from "../../features/habits/components/HabitCard";
import { Screen } from "../../ui/components/Screen";
import { colors } from "../../ui/theme/colors";
import { spacing } from "../../ui/theme/spacing";
import { typography } from "../../ui/theme/typography";
import { HabitStackParamList } from "../../navigation/HabitStack";

type HabitNav = NativeStackNavigationProp<HabitStackParamList, "HabitList">;

/**
 * Habit List Screen
 *
 * Displays a list of all habits for the active subject.
 * Supports archiving, reactivating, and navigating to edit screen.
 *
 * Features:
 * - List of active and archived habits
 * - Archive/reactivate functionality
 * - Tap to edit
 * - Loading and error states
 * - Empty state
 * - Scope validation 
 */
export const HabitListScreen: React.FC = () => {
  const {
    habits,
    isLoading,
    error,
    archiveHabit,
    reactivateHabit,
    hasScope,
    isArchiving,
    isReactivating,
  } = useHabitListController();

  const navigation = useNavigation<HabitNav>();

  /**
   * Filters habits to show only active and archived (not deleted)
   */
  const visibleHabits = habits.filter(
    (habit) => habit.status !== "deleted"
  );

  /**
   * No scope selected - show message
   */
  if (!hasScope) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.text}>No household/subject selected yet.</Text>
          <Text style={styles.text}>
            Create/select one to start tracking habits.
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
          <Text style={styles.text}>Loading habits...</Text>
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
            Failed to load habits. Check your connection.
          </Text>
        </View>
      </Screen>
    );
  }

  /**
   * Renders a single habit card
   */
  const renderItem = ({ item }: { item: IHabit }) => (
    <HabitCard
      habit={item}
      onPress={() => navigation.navigate("EditHabit", { habit: item })}
      onArchive={() => archiveHabit(item)}
      onReactivate={() => reactivateHabit(item)}
    />
  );

  /**
   * Empty state
   */
  if (visibleHabits.length === 0) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No habits yet. Tap the + to create one.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Loading overlay for mutations */}
      {(isArchiving || isReactivating) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      <FlatList
        data={visibleHabits}
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

export default HabitListScreen;
