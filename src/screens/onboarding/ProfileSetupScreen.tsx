import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingParamList } from "./OnboardingStack";
import { OnboardingLayout } from "./OnboardingLayout";
import { AppButton } from "@ui/components";
import { useAppScope } from "@scope/AppScopeContext";
import { profileService } from "@features/profile/services/profileService";
import { colors, spacing, typography, radius } from "@ui/theme";

type Props = NativeStackScreenProps<OnboardingParamList, "ProfileSetup">;

export function ProfileSetupScreen({ navigation }: Props) {
  const { setUserProfile } = useAppScope();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!firstName.trim()) {
      setError("We'd love to know your first name");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const profile = await profileService.create({
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
      });

      await setUserProfile({
        id: profile.id,
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
      });

      navigation.navigate("HouseholdSetup");
    } catch (e: any) {
      console.error("Profile creation error:", e);
      setError(e?.response?.data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout
      step={0}
      quote="Knowing yourself is the beginning of all wisdom."
      quoteAuthor="Aristotle"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.description}>
          This helps personalize your experience. Your name is how we'll greet
          you — nothing more, nothing less.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, error && !username.trim() ? styles.inputError : null]}
            placeholder="Choose a unique username"
            placeholderTextColor={colors.textDisabled}
            value={username}
            onChangeText={(t) => { setUsername(t); setError(null); }}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={[styles.input, error && !firstName.trim() ? styles.inputError : null]}
            placeholder="What should we call you?"
            placeholderTextColor={colors.textDisabled}
            value={firstName}
            onChangeText={(t) => { setFirstName(t); setError(null); }}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Last name <Text style={styles.optional}>(optional)</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Optional"
            placeholderTextColor={colors.textDisabled}
            value={lastName}
            onChangeText={setLastName}
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
    marginBottom: spacing.xxxl,
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
  optional: {
    color: colors.textMuted,
    fontWeight: "400",
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
