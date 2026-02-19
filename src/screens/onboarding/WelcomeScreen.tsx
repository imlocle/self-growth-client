import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingParamList } from "./OnboardingStack";
import { OnboardingLayout } from "./OnboardingLayout";
import { AppButton } from "@ui/components";
import { colors, spacing, typography, radius } from "@ui/theme";

type Props = NativeStackScreenProps<OnboardingParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <OnboardingLayout
      quote="The journey of a thousand miles begins with a single step."
      quoteAuthor="Lao Tzu"
    >
      <View style={styles.hero}>
        {/* App icon / logo area */}
        <View style={styles.iconContainer}>
          <Ionicons name="leaf-outline" size={48} color={colors.primary} />
        </View>

        <Text style={styles.title}>Welcome to{"\n"}Self Growth</Text>

        <Text style={styles.subtitle}>
          A calm, focused space designed to help you build better habits and
          organize your life — at your own pace.
        </Text>

        <View style={styles.valueProps}>
          <ValueProp
            icon="heart-outline"
            text="Designed for your wellbeing, not just productivity"
          />
          <ValueProp
            icon="shield-checkmark-outline"
            text="Your private space for personal development"
          />
          <ValueProp
            icon="sparkles-outline"
            text="Simple, calming, and distraction-free"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerNote}>
          Let's set up your space. This takes about 2 minutes.
        </Text>
        <AppButton
          title="Begin Setup"
          variant="primary"
          size="large"
          fullWidth
          onPress={() => navigation.navigate("ProfileSetup")}
        />
      </View>
    </OnboardingLayout>
  );
}

function ValueProp({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.valueProp}>
      <View style={styles.valuePropIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.valuePropText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.display,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    lineHeight: 28,
    marginBottom: spacing.xxxl,
  },
  valueProps: {
    gap: spacing.lg,
  },
  valueProp: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  valuePropIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  valuePropText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  footer: {
    marginTop: spacing.xxxl,
    gap: spacing.lg,
  },
  footerNote: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
});
