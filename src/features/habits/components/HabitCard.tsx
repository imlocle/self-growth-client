import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IHabit } from "@domain/models/habit";
import { colors } from "@ui/theme/colors";
import { spacing } from "@ui/theme/spacing";
import { radius } from "@ui/theme/radius";

interface Props {
  habit: IHabit;
  onPress: () => void;
  onArchive?: () => void;
  onReactivate?: () => void;
}

/**
 * Habit Card Component
 *
 * Displays a single habit with its details including:
 * - Title and description
 * - Counter type (daily/weekly/monthly)
 * - Difficulty level (stars)
 * - Habit type (build/quit) with visual indicator
 * - Status-based styling
 *
 * @example
 * ```typescript
 * <HabitCard
 *   habit={habit}
 *   onPress={() => navigation.navigate('EditHabit', { habit })}
 *   onArchive={() => archiveHabit(habit)}
 *   onReactivate={() => reactivateHabit(habit)}
 * />
 * ```
 */
const HabitCard: React.FC<Props> = ({ habit, onPress, onArchive, onReactivate }) => {
  const isArchived = habit.status === "archived";
  const isDeleted = habit.status === "deleted";
  const isBuildHabit = habit.type === "build";

  /**
   * Renders difficulty stars based on habit difficulty level
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
            size={12}
            color={colors.primary}
            style={styles.star}
          />
        ))}
      </View>
    );
  };

  /**
   * Renders counter badge (daily/weekly/monthly)
   */
  const renderCounterBadge = () => {
    if (!habit.counter) return null;

    const counterLabels = {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
    };

    return (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{counterLabels[habit.counter]}</Text>
      </View>
    );
  };

  /**
   * Renders habit type indicator (build/quit)
   */
  const renderTypeIndicator = () => {
    return (
      <View style={[styles.typeIndicator, isBuildHabit ? styles.buildType : styles.quitType]}>
        <Ionicons
          name={isBuildHabit ? "arrow-up-circle" : "close-circle"}
          size={16}
          color={isBuildHabit ? colors.primary : colors.danger}
        />
        <Text style={[styles.typeText, isBuildHabit ? styles.buildText : styles.quitText]}>
          {isBuildHabit ? "Build" : "Quit"}
        </Text>
      </View>
    );
  };

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <View
        style={[
          styles.card,
          isArchived && styles.cardArchived,
          isDeleted && styles.cardDeleted,
        ]}
      >
        {/* Left side - Content */}
        <View style={styles.content}>
          {/* Title and Type */}
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, (isArchived || isDeleted) && styles.titleMuted]}
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

        {/* Right side - Action button */}
        {!isDeleted && (
          <View style={styles.actions}>
            {isArchived ? (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onReactivate?.();
                }}
                hitSlop={10}
                style={styles.actionButton}
              >
                <Ionicons name="play-circle-outline" size={24} color={colors.primary} />
              </Pressable>
            ) : (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onArchive?.();
                }}
                hitSlop={10}
                style={styles.actionButton}
              >
                <Ionicons name="pause-circle-outline" size={24} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: { opacity: 0.95 },
  card: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
  },
  cardArchived: {
    backgroundColor: colors.surfaceAlt,
    opacity: 0.7,
  },
  cardDeleted: {
    backgroundColor: colors.background,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: spacing.sm,
  },
  titleMuted: {
    color: colors.textMuted,
  },
  description: {
    color: colors.textSoft,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  badgeText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "500",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginRight: 2,
  },
  typeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    gap: 4,
  },
  buildType: {
    backgroundColor: `${colors.primary}20`,
  },
  quitType: {
    backgroundColor: `${colors.danger}20`,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  buildText: {
    color: colors.primary,
  },
  quitText: {
    color: colors.danger,
  },
  actions: {
    marginLeft: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
  },
});

export default HabitCard;
