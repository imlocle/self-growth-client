import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography, radius } from "@ui/theme";

interface Props {
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  quote?: string;
  quoteAuthor?: string;
}

/**
 * OnboardingLayout - Shared layout for all onboarding screens
 *
 * Provides consistent structure:
 * - Safe area handling
 * - Step indicator
 * - Optional inspirational quote
 * - Keyboard-aware scrolling
 */
export function OnboardingLayout({
  children,
  step,
  totalSteps = 4,
  quote,
  quoteAuthor,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[styles.scroll, { paddingTop: insets.top + spacing.xl }]}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxxl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step indicator */}
        {step != null && (
          <View style={styles.stepRow}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.stepDot,
                  i < step ? styles.stepDotCompleted : null,
                  i === step ? styles.stepDotActive : null,
                ]}
              />
            ))}
          </View>
        )}

        {/* Main content */}
        <View style={styles.main}>{children}</View>

        {/* Inspirational quote */}
        {quote && (
          <View style={styles.quoteContainer}>
            <View style={styles.quoteLine} />
            <Text style={styles.quoteText}>"{quote}"</Text>
            {quoteAuthor && (
              <Text style={styles.quoteAuthor}>— {quoteAuthor}</Text>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
  content: {
    flexGrow: 1,
  },
  stepRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  stepDot: {
    width: 32,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    width: 48,
  },
  stepDotCompleted: {
    backgroundColor: colors.primaryDark,
  },
  main: {
    flex: 1,
  },
  quoteContainer: {
    marginTop: spacing.huge,
    paddingLeft: spacing.lg,
  },
  quoteLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    opacity: 0.5,
  },
  quoteText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontStyle: "italic",
    lineHeight: 22,
  },
  quoteAuthor: {
    ...typography.captionSmall,
    color: colors.textDisabled,
    marginTop: spacing.xs,
  },
});
