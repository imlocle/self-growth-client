import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingParamList } from "./OnboardingStack";
import { OnboardingLayout } from "./OnboardingLayout";
import { AppButton } from "@ui/components";
import { useAppScope } from "@scope/AppScopeContext";
import { colors, spacing, typography, radius, shadows } from "@ui/theme";

type Props = NativeStackScreenProps<OnboardingParamList, "OnboardingComplete">;

export function OnboardingCompleteScreen({ route }: Props) {
  const { householdId, subjectId } = route.params;
  const { userProfile, setScope } = useAppScope();
  const name = userProfile?.firstName || "there";
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    // Setting scope completes onboarding.
    // RootNav will detect activeHouseholdId + activeSubjectId
    // and automatically switch to MainTabs.
    await setScope({
      activeHouseholdId: householdId,
      activeSubjectId: subjectId,
    });
  };

  return (
    <OnboardingLayout
      step={3}
      quote="Small daily improvements over time lead to stunning results."
      quoteAuthor="Robin Sharma"
    >
      <View style={styles.hero}>
        {/* Success icon */}
        <View style={styles.successIcon}>
          <View style={styles.successGlow} />
          <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
        </View>

        <Text style={styles.title}>You're all set, {name}</Text>

        <Text style={styles.description}>
          Your personal growth space is ready. Remember — this isn't about
          perfection. It's about showing up for yourself, one small step at a
          time.
        </Text>

        {/* What's next cards */}
        <View style={styles.nextSteps}>
          <Text style={styles.nextTitle}>Here's what you can do</Text>

          <NextStep
            icon="leaf-outline"
            color={colors.primary}
            bg={colors.primarySubtle}
            title="Build habits"
            text="Start with one small habit. Consistency beats intensity."
          />
          <NextStep
            icon="checkmark-done-outline"
            color={colors.secondary}
            bg={colors.secondarySubtle}
            title="Track tasks"
            text="Break big goals into small, manageable steps."
          />
          <NextStep
            icon="heart-outline"
            color={colors.accent}
            bg={colors.accentSubtle}
            title="Be kind to yourself"
            text="Missed a day? That's okay. Just start again tomorrow."
          />
        </View>
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Let's begin"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          onPress={handleFinish}
        />
      </View>
    </OnboardingLayout>
  );
}

function NextStep({
  icon,
  color,
  bg,
  title,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.stepCard}>
      <View style={[styles.stepIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
  },
  successIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
    position: "relative",
  },
  successGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: radius.circle,
    backgroundColor: colors.primaryGlow,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xxxl,
  },
  nextSteps: {
    gap: spacing.lg,
  },
  nextTitle: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  stepContent: {
    flex: 1,
    gap: spacing.xs,
  },
  stepTitle: {
    ...typography.h4,
    color: colors.text,
    fontSize: 16,
  },
  stepText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    lineHeight: 20,
  },
  footer: {
    marginTop: spacing.xxxl,
  },
});
