import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@ui/theme/colors";
import { spacing } from "@ui/theme/spacing";

type Props = ViewProps & {
  children: React.ReactNode;
};

export function Screen({ children, style, ...rest }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.md },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background ?? "#020617",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
});
