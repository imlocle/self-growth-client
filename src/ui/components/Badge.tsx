import React from "react";
import { View, Text, StyleSheet, ViewProps } from "react-native";
import { colors, spacing, radius, typography } from "@ui/theme";

type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type BadgeSize = "small" | "medium";

interface BadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

/**
 * Badge - Small label component for metadata
 * 
 * Features:
 * - Multiple color variants
 * - Size options
 * - Subtle backgrounds for calm aesthetic
 * - Clear, readable text
 * 
 * @example
 * ```tsx
 * <Badge label="Daily" variant="primary" />
 * <Badge label="Active" variant="success" size="small" />
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  size = "medium",
  style,
  ...rest
}) => {
  return (
    <View
      style={[
        styles.badge,
        styles[`badge_${variant}`],
        styles[`badge_${size}`],
        style,
      ]}
      {...rest}
    >
      <Text style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`]]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.sm,
    alignSelf: "flex-start",
  },
  
  // Sizes
  badge_small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  badge_medium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  
  // Variants
  badge_default: {
    backgroundColor: colors.surfaceElevated,
  },
  badge_primary: {
    backgroundColor: colors.primarySubtle,
  },
  badge_secondary: {
    backgroundColor: colors.secondarySubtle,
  },
  badge_success: {
    backgroundColor: colors.successSubtle,
  },
  badge_warning: {
    backgroundColor: colors.warningSubtle,
  },
  badge_danger: {
    backgroundColor: colors.dangerSubtle,
  },
  
  // Text
  text: {
    ...typography.labelSmall,
  },
  text_small: {
    ...typography.captionSmall,
  },
  text_medium: {
    ...typography.labelSmall,
  },
  
  // Text colors
  text_default: {
    color: colors.textSecondary,
  },
  text_primary: {
    color: colors.primary,
  },
  text_secondary: {
    color: colors.secondary,
  },
  text_success: {
    color: colors.success,
  },
  text_warning: {
    color: colors.warning,
  },
  text_danger: {
    color: colors.danger,
  },
});
