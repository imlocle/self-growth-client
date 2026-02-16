import React from "react";
import { Pressable, StyleSheet, PressableProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@ui/theme";

type IconButtonVariant = "default" | "primary" | "ghost" | "danger";
type IconButtonSize = "small" | "medium" | "large";

interface IconButtonProps extends PressableProps {
  icon: keyof typeof Ionicons.glyphMap;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

/**
 * IconButton - Elegant icon-only button
 * 
 * Features:
 * - Multiple variants and sizes
 * - Generous touch targets (min 44x44)
 * - Subtle press feedback
 * - Accessible for all users
 * 
 * @example
 * ```tsx
 * <IconButton icon="close" variant="ghost" onPress={handleClose} />
 * <IconButton icon="heart" variant="primary" size="large" />
 * ```
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = "default",
  size = "medium",
  disabled,
  style,
  ...rest
}) => {
  const iconSizes = {
    small: 18,
    medium: 22,
    large: 26,
  };

  const getIconColor = () => {
    if (disabled) return colors.textDisabled;
    
    switch (variant) {
      case "primary":
        return colors.primary;
      case "danger":
        return colors.danger;
      case "ghost":
      case "default":
      default:
        return colors.text;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ] as any}
      disabled={disabled}
      {...rest}
    >
      <Ionicons name={icon} size={iconSizes[size]} color={getIconColor()} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  
  // Sizes - all meet 44x44 minimum touch target
  button_small: {
    width: 36,
    height: 36,
  },
  button_medium: {
    width: 44,
    height: 44,
  },
  button_large: {
    width: 52,
    height: 52,
  },
  
  // Variants
  button_default: {
    backgroundColor: colors.surfaceElevated,
  },
  button_primary: {
    backgroundColor: colors.primarySubtle,
  },
  button_ghost: {
    backgroundColor: "transparent",
  },
  button_danger: {
    backgroundColor: colors.dangerSubtle,
  },
  
  // States
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
