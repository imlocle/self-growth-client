import React from "react";
import { View, StyleSheet, ViewProps, Pressable } from "react-native";
import { colors, spacing, radius, shadows } from "@ui/theme";

type CardVariant = "default" | "elevated" | "outlined";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: CardVariant;
  pressable?: boolean;
  onPress?: () => void;
}

/**
 * Card - Elegant container component
 * 
 * Features:
 * - Multiple variants for visual hierarchy
 * - Optional press interaction
 * - Subtle shadows for depth
 * - Generous padding for breathing room
 * 
 * @example
 * ```tsx
 * <Card variant="elevated">
 *   <Text>Content</Text>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  pressable = false,
  onPress,
  style,
  ...rest
}) => {
  const cardStyles = [
    styles.card,
    styles[`card_${variant}`],
    style,
  ];

  if (pressable && onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...cardStyles,
          pressed && styles.pressed,
        ]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyles} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  card_default: {
    backgroundColor: colors.surface,
  },
  card_elevated: {
    backgroundColor: colors.surfaceElevated,
    ...shadows.md,
  },
  card_outlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
