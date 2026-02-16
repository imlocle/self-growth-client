/**
 * Typography system for elegant, readable interface
 * 
 * Philosophy:
 * - Generous line heights for ADHD-friendly reading
 * - Clear hierarchy with distinct sizes
 * - Consistent weight system
 * - Letter spacing for premium feel
 */

export const typography = {
  // Display - Hero text
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  
  // Headings
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const,
    letterSpacing: -0.1,
  },
  
  // Body text
  bodyLarge: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  
  // Labels and UI text
  label: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500" as const,
    letterSpacing: 0.1,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500" as const,
    letterSpacing: 0.2,
  },
  
  // Captions
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400" as const,
    letterSpacing: 0.1,
  },
  captionSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "400" as const,
    letterSpacing: 0.2,
  },
  
  // Button text
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600" as const,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600" as const,
    letterSpacing: 0.3,
  },
};
