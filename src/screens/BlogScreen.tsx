import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const BlogScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blog</Text>
      <Text style={styles.text}>Your Self-Growth blog posts will live here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
    justifyContent: "center",
  },
  title: {
    color: "#f9fafb",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  text: {
    color: "#9ca3af",
    fontSize: 16,
  },
});
