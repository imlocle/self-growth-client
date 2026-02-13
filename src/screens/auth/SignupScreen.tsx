import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../auth/AuthContext";
import { colors } from "../../ui/theme/colors";
import { spacing } from "../../ui/theme/spacing";
import { radius } from "../../ui/theme/radius";
import { Screen } from "../../ui/components/Screen";

export function SignupScreen({ navigation }: any) {
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      await signup(email.trim(), password, firstName.trim() || undefined), lastName.trim() || undefined;
      navigation.navigate("ConfirmSignup", {email, password});
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Create account</Text>

      {err ? <Text style={styles.error}>{err}</Text> : null}

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textMuted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>First Name (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor={colors.textMuted}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last Name (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor={colors.textMuted}
        value={lastName}
        onChangeText={setLastName}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Sign up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginBottom: spacing.lg },
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
  link: { marginTop: spacing.lg, color: colors.textMuted, textAlign: "center" },
  error: { color: colors.danger, marginBottom: spacing.md },
});
