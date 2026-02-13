import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Screen } from "@ui/components/Screen";
import { colors } from "@ui/theme/colors";
import { spacing } from "@ui/theme/spacing";
import { radius } from "@ui/theme/radius";
import { useAuth } from "@auth/AuthContext";

export function ConfirmSignupScreen({ route }: any) {
  const { email, password } = route.params;
  const { confirmAndLogin } = useAuth();

  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      await confirmAndLogin(email, password, confirmationCode.trim());
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Confirm your account</Text>
      <Text style={styles.sub}>Enter the code sent to {email}</Text>

      {err ? <Text style={styles.error}>{err}</Text> : null}

      <Text style={styles.label}>Confirmation Code</Text>
      <TextInput
        style={styles.input}
        placeholder="123456"
        placeholderTextColor={colors.textMuted}
        keyboardType="number-pad"
        value={confirmationCode}
        onChangeText={setConfirmationCode}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Confirming..." : "Confirm & Continue"}
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginBottom: spacing.sm },
  sub: { color: colors.textMuted, marginBottom: spacing.lg },
  label: { color: colors.text, fontWeight: "600", marginTop: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  button: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
  },
  buttonText: { color: colors.primaryText, fontWeight: "700" },
  error: { color: colors.danger, marginBottom: spacing.md },
});
