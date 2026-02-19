import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingParamList } from "./OnboardingStack";
import { OnboardingLayout } from "./OnboardingLayout";
import { AppButton } from "@ui/components";
import { useAppScope } from "@scope/AppScopeContext";
import { householdService } from "@features/households/services/householdService";
import { householdSubjectService } from "@features/households/services/householdSubjectService";
import { colors, spacing, typography, radius } from "@ui/theme";

type Props = NativeStackScreenProps<OnboardingParamList, "HouseholdSetup">;

export function HouseholdSetupScreen({ navigation }: Props) {
  const { userProfile } = useAppScope();
  const defaultName = userProfile?.firstName
    ? `${userProfile.firstName}'s Space`
    : "My Space";

  const [name, setName] = useState(defaultName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!name.trim()) {
      setError("Give your space a name");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      // 1. Create household
      const household = await householdService.create({ name: name.trim() });

      // 2. Create "self" subject within the new household
      const subject = await householdSubjectService.create(household.id, {
        type: "self",
        displayName: userProfile?.firstName || "Me",
      });

      console.log(subject)

      // 3. Pass IDs to completion screen — scope gets set there
      // so the user sees the final screen before RootNav switches to MainTabs
      navigation.navigate("OnboardingComplete", {
        householdId: household.id,
        subjectId: subject.id,
      });
    } catch (e: any) {
      console.error("Household setup error:", e);
      setError(e?.response?.data?.message ?? e?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout
      step={1}
      quote="The secret of getting ahead is getting started."
      quoteAuthor="Mark Twain"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Create your space</Text>
        <Text style={styles.description}>
          A household is your personal container for habits and tasks. Think of
          it as your private workspace for growth.
        </Text>
      </View>

      {/* Explanation card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="home-outline" size={18} color={colors.secondary} />
          </View>
          <Text style={styles.infoText}>
            You can invite family members later to share a household
          </Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="people-outline" size={18} color={colors.secondary} />
          </View>
          <Text style={styles.infoText}>
            Each person in a household can track their own habits independently
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Household name</Text>
          <TextInput
            style={[styles.input, error && !name.trim() ? styles.inputError : null]}
            placeholder="e.g. My Space, Home, Family"
            placeholderTextColor={colors.textDisabled}
            value={name}
            onChangeText={(t) => { setName(t); setError(null); }}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Continue"
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
    backgroundColor: colors.secondarySubtle,
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
  error: {
    ...typography.bodySmall,
    color: colors.danger,
  },
  footer: {
    marginTop: spacing.xxxl,
  },
});
