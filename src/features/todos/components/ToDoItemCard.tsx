import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IToDo } from "@domain/models/todo";
import { colors, spacing, radius, typography, shadows } from "@ui/theme";

interface Props {
  todo: IToDo;
  onToggle: () => void;
  onPress: () => void;
}

/**
 * ToDo Item Card Component - Elegant, calming design
 *
 * Features:
 * - Soft colors and generous spacing
 * - Clear visual hierarchy
 * - Subtle shadows for depth
 * - ADHD-friendly layout with clear sections
 *
 * @example
 * ```typescript
 * <ToDoItemCard
 *   todo={todo}
 *   onToggle={() => toggleComplete(todo)}
 *   onPress={() => navigation.navigate('EditToDo', { todo })}
 * />
 * ```
 */
const ToDoItemCard: React.FC<Props> = ({ todo, onToggle, onPress }) => {
  const isCompleted = todo.status === "completed";
  const isDeleted = todo.status === "deleted";

  /**
   * Renders difficulty stars with elegant styling
   */
  const renderDifficultyStars = () => {
    if (!todo.difficulty) return null;

    const starCount = {
      trivial: 1,
      easy: 2,
      medium: 3,
      hard: 4,
    }[todo.difficulty];

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
   * Renders checklist progress indicator
   */
  const renderChecklistIndicator = () => {
    if (!todo.checklist || todo.checklist.length === 0) return null;

    return (
      <View style={styles.checklistIndicator}>
        <Ionicons name="list-outline" size={14} color={colors.textMuted} />
        <Text style={styles.checklistText}>{todo.checklist.length} items</Text>
      </View>
    );
  };

  /**
   * Formats due date for display
   */
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else if (date < today) {
      return "Overdue";
    } else {
      return dateString;
    }
  };

  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.card,
        isCompleted && styles.cardCompleted,
        isDeleted && styles.cardDeleted,
        pressed && styles.pressed,
      ]}
    >
      {/* Checkbox */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        hitSlop={10}
        style={styles.checkboxContainer}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isCompleted }}
        accessibilityLabel={`Mark ${todo.title} as ${isCompleted ? "incomplete" : "complete"}`}
      >
        <View style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}>
          {isCompleted && (
            <Ionicons name="checkmark" size={18} color={colors.background} />
          )}
        </View>
      </Pressable>

      {/* Content */}
      <View style={styles.textContainer}>
        <Text
          style={[styles.title, (isCompleted || isDeleted) && styles.titleMuted]}
          numberOfLines={2}
        >
          {todo.title}
        </Text>

        {todo.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {todo.description}
          </Text>
        ) : null}

        {/* Metadata row */}
        <View style={styles.metaRow}>
          {todo.dateDue && (
            <View style={styles.dueDateContainer}>
              <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
              <Text style={styles.dueDate}>{formatDueDate(todo.dateDue)}</Text>
            </View>
          )}
          {renderChecklistIndicator()}
          {renderDifficultyStars()}
        </View>
      </View>
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
  cardCompleted: {
    backgroundColor: colors.surfaceElevated,
    opacity: 0.7,
  },
  cardDeleted: {
    backgroundColor: colors.backgroundElevated,
    opacity: 0.5,
  },
  checkboxContainer: {
    marginRight: spacing.lg,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  titleMuted: {
    color: colors.textMuted,
    textDecorationLine: "line-through",
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
    flexWrap: "wrap",
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dueDate: {
    ...typography.labelSmall,
    color: colors.textMuted,
  },
  checklistIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  checklistText: {
    ...typography.labelSmall,
    color: colors.textMuted,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  star: {
    opacity: 0.9,
  },
});

export default ToDoItemCard;
