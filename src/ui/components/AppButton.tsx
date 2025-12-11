import React from "react";
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { radius } from "../theme/radius";

interface Props extends TouchableOpacityProps {
  title: string;
}

export const AppButton: React.FC<Props> = ({ title, style, ...rest }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} {...rest}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.primaryText,
    fontWeight: "600",
  },
});
