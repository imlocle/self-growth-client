import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingParamList } from "./OnboardingStack";
import { OnboardingLayout } from "./OnboardingLayout";
import { AppButton } from "@ui/components";
import { useAppScope } from "@scope/AppScopeContext";
import { householdSubjectService } from "@features/households/services/householdSubjectService";
import { colors, spacing, typography, radius } from "@ui/theme";

type Props = NativeStackScreenProps<OnboardingParamList, "SubjectSetup">;

export function SubjectSetupScreen({ navigation, route }: Props) {
  const { householdId } = route.params;
  const { userProfile, setActiveSubject } = useAppScope();
  const defaultName = userProfile?.firstName || "Me";

  const [name, setName] = useState(defaultName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!name.trim()) {
      setError("Give this person a name");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const subject = await householdSubjectService.create(householdId, {
        type: "self", // Default to self for first subject
        displayName: name.trim(),
      });

      // Pass subjectId to completion screen — scope gets set there
      // so the user sees the final screen before navigation switches
      navigation.navigate("OnboardingComplete", { subjectId: subject.id });
    } catch (e: any) {
      console.error("Subject creation error:", e);
      // Show the actual error message from validation or API
      const errorMessage = e?.message || e?.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout
      step={2}
      quote="We are what we repeatedly do. Excellence, then, is not an act, but a habit."
      quoteAuthor="Will Durant"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Who is this for?</Text>
        <Text style={styles.description}>
          Create a profile for the person whose habits and tasks you'll be
          tracking. This is usually yourself.
        </Text>
      </View>

      {/* Explanation */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="person-outline" size={18} color={colors.accent} />
          </View>
          <Text style={styles.infoText}>
            You can add more people later — like children or family members you
            help support
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, error && !name.trim() ? styles.inputError : null]}
            placeholder="e.g. Me, Alex, My Child"
            placeholderTextColor={colors.textDisabled}
            value={name}
            onChangeText={(t) => { setName(t); setError(null); }}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
          <Text style={styles.hint}>
            This is just a label to keep things organized
          </Text>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Almost done"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          onPress={handleContinue}
        />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: colors.accentSubtle,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xxxl,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  form: {
    gap: spacing.xl,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    ...typography.body,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.danger,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
  },
  footer: {
    marginTop: spacing.xxxl,
  },
});
