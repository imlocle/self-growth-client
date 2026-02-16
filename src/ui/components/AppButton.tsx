import React from "react";
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from "react-native";
import { colors, spacing, radius, typography, shadows } from "@ui/theme";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "small" | "medium" | "large";

interface Props extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * AppButton - Elegant, accessible button component
 * 
 * Features:
 * - Multiple variants for different contexts
 * - Size options for hierarchy
 * - Loading state with spinner
 * - Generous touch targets for accessibility
 * - Subtle press feedback
 * 
 * @example
 * ```tsx
 * <AppButton title="Continue" variant="primary" size="large" />
 * <AppButton title="Cancel" variant="ghost" />
 * ```
 */
export const AppButton: React.FC<Props> = ({ 
  title, 
  variant = "primary",
  size = "medium",
  loading = false,
  fullWidth = false,
  style, 
  disabled,
  ...rest 
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles} 
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === "primary" ? colors.background : colors.primary} 
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    flexDirection: "row",
  },
  
  // Sizes
  button_small: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minHeight: 36,
  },
  button_medium: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  button_large: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    minHeight: 52,
  },
  
  // Variants
  button_primary: {
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  button_secondary: {
    backgroundColor: colors.secondary,
    ...shadows.md,
  },
  button_outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  button_ghost: {
    backgroundColor: "transparent",
  },
  button_danger: {
    backgroundColor: colors.danger,
    ...shadows.md,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: "100%",
  },
  
  // Text styles
  text: {
    ...typography.button,
    textAlign: "center",
  },
  text_small: {
    ...typography.buttonSmall,
  },
  text_medium: {
    ...typography.button,
  },
  text_large: {
    ...typography.button,
    fontSize: 16,
  },
  
  // Text variants
  text_primary: {
    color: colors.background,
  },
  text_secondary: {
    color: colors.text,
  },
  text_outline: {
    color: colors.text,
  },
  text_ghost: {
    color: colors.primary,
  },
  text_danger: {
    color: colors.text,
  },
  textDisabled: {
    color: colors.textDisabled,
  },
});
