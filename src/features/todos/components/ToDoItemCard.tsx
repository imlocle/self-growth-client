import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IToDo } from "@domain/models/todo";
import { colors } from "@ui/theme/colors";
import { spacing } from "@ui/theme/spacing";
import { radius } from "@ui/theme/radius";

interface Props {
  todo: IToDo;
  onToggle: () => void;
  onPress: () => void;
}

/**
 * ToDo Item Card Component
 *
 * Displays a single todo item with its details including:
 * - Title and description
 * - Completion checkbox
 * - Due date
 * - Difficulty level (stars)
 * - Checklist count
 * - Status-based styling
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
   * Renders difficulty stars based on todo difficulty level
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
            size={12}
            color={colors.primary}
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
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <View
        style={[
          styles.card,
          isCompleted && styles.cardCompleted,
          isDeleted && styles.cardDeleted,
        ]}
      >
        {/* Checkbox (does NOT trigger edit) */}
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
              <Ionicons name="checkmark" size={16} color={colors.primaryText} />
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
  cardCompleted: {
    backgroundColor: colors.surfaceAlt,
    opacity: 0.8,
  },
  cardDeleted: {
    backgroundColor: colors.background,
    opacity: 0.5,
  },
  checkboxContainer: {
    marginRight: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.textMuted,
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
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  titleMuted: {
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  description: {
    color: colors.textSoft,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dueDate: {
    color: colors.textMuted,
    fontSize: 12,
  },
  checklistIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  checklistText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginRight: 2,
  },
});

export default ToDoItemCard;
