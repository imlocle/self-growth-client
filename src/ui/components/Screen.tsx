import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

interface Props extends ViewProps {
  padded?: boolean;
}

export const Screen: React.FC<Props> = ({ children, padded = true, style, ...rest }) => {
  return (
    <View
      style={[styles.container, padded && styles.padded, style]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padded: {
    padding: spacing.lg,
  },
});
