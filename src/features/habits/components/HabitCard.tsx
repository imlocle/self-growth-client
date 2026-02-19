import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IHabit } from "@domain/models/habit";
import { colors, spacing, radius, typography, shadows } from "@ui/theme";
import { Badge, IconButton } from "@ui/components";

interface Props {
  habit: IHabit;
  onPress: () => void;
  onArchive?: () => void;
  onReactivate?: () => void;
}

/**
 * Habit Card Component - Elegant, calming design
 *
 * Features:
 * - Soft colors and generous spacing
 * - Clear visual hierarchy
 * - Subtle shadows for depth
 * - ADHD-friendly layout with clear sections
 *
 * @example
 * ```typescript
 * <HabitCard
 *   habit={habit}
 *   onPress={() => navigation.navigate('EditHabit', { habit })}
 *   onArchive={() => archiveHabit(habit)}
 * />
 * ```
 */
const HabitCard: React.FC<Props> = ({ habit, onPress, onArchive, onReactivate }) => {
  const isArchived = habit.status === "archived";
  const isDeleted = habit.status === "deleted";
  const isBuildHabit = habit.type === "build";

  /**
   * Renders difficulty stars with elegant styling
   */
  const renderDifficultyStars = () => {
    const starCount = {
      trivial: 1,
      easy: 2,
      medium: 3,
      hard: 4,
    }[habit.difficulty || "medium"];

    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: starCount }).map((_, index) => (
          <Ionicons
            key={index}
            name="star"
            size={14}
            color={colors.warning}
            style={styles.star}
          />
        ))}
      </View>
    );
  };

  /**
   * Renders counter badge using new Badge component
   */
  const renderCounterBadge = () => {
    if (!habit.counter) return null;

    const counterLabels = {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
    };

    return (
      <Badge 
        label={counterLabels[habit.counter]} 
        variant="secondary"
        size="small"
      />
    );
  };

  /**
   * Renders habit type indicator with soft colors
   */
  const renderTypeIndicator = () => {
    return (
      <View style={[styles.typeIndicator, isBuildHabit ? styles.buildType : styles.quitType]}>
        <Ionicons
          name={isBuildHabit ? "arrow-up-circle" : "close-circle"}
          size={14}
          color={isBuildHabit ? colors.success : colors.danger}
        />
        <Text style={[styles.typeText, isBuildHabit ? styles.buildText : styles.quitText]}>
          {isBuildHabit ? "Build" : "Quit"}
        </Text>
      </View>
    );
  };

  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.card,
        isArchived && styles.cardArchived,
        isDeleted && styles.cardDeleted,
        pressed && styles.pressed,
      ]}
    >
      {/* Main content */}
      <View style={styles.content}>
        {/* Title row with type indicator */}
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              (isArchived || isDeleted) && styles.titleMuted,
            ]}
            numberOfLines={2}
          >
            {habit.title}
          </Text>
          {renderTypeIndicator()}
        </View>

        {/* Description */}
        {habit.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {habit.description}
          </Text>
        ) : null}

        {/* Metadata row */}
        <View style={styles.metaRow}>
          {renderCounterBadge()}
          {renderDifficultyStars()}
        </View>
      </View>

      {/* Action button */}
      {!isDeleted && (
        <View style={styles.actions}>
          {isArchived ? (
            <IconButton
              icon="play-circle-outline"
              variant="primary"
              size="medium"
              onPress={(e) => {
                e.stopPropagation();
                onReactivate?.();
              }}
            />
          ) : (
            <IconButton
              icon="pause-circle-outline"
              variant="ghost"
              size="medium"
              onPress={(e) => {
                e.stopPropagation();
                onArchive?.();
              }}
            />
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardArchived: {
    backgroundColor: colors.surfaceElevated,
    opacity: 0.7,
  },
  cardDeleted: {
    backgroundColor: colors.backgroundElevated,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  title: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
  },
  titleMuted: {
    color: colors.textMuted,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  star: {
    opacity: 0.9,
  },
  typeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    gap: spacing.xs,
  },
  buildType: {
    backgroundColor: colors.successSubtle,
  },
  quitType: {
    backgroundColor: colors.dangerSubtle,
  },
  typeText: {
    ...typography.labelSmall,
    fontWeight: "600",
  },
  buildText: {
    color: colors.success,
  },
  quitText: {
    color: colors.danger,
  },
  actions: {
    marginLeft: spacing.md,
  },
});

export default HabitCard;
