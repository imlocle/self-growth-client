import React from "react";
import { View, StyleSheet, ViewProps, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@ui/theme";

type Props = ViewProps & {
  children: React.ReactNode;
  scrollable?: boolean;
  noPadding?: boolean;
};

/**
 * Screen - Base container for all screens
 * 
 * Features:
 * - Safe area handling
 * - Optional scrolling
 * - Consistent padding and background
 * - Generous spacing for calm layout
 * 
 * @example
 * ```tsx
 * <Screen scrollable>
 *   <Text>Content</Text>
 * </Screen>
 * ```
 */
export function Screen({ 
  children, 
  scrollable = false,
  noPadding = false,
  style, 
  ...rest 
}: Props) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { 
      paddingTop: insets.top + (noPadding ? 0 : spacing.lg),
      paddingHorizontal: noPadding ? 0 : spacing.lg,
      paddingBottom: noPadding ? 0 : spacing.lg,
    },
    style,
  ];

  if (scrollable) {
    return (
      <ScrollView
        style={containerStyle}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={containerStyle} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
