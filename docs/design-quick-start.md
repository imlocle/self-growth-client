# Design System Quick Start

Get started with the new elegant design system in 5 minutes.

## 1. Import What You Need

```typescript
// Theme tokens
import { colors, spacing, radius, typography, shadows } from "@ui/theme";

// Components
import { AppButton, Screen, Card, Badge, IconButton } from "@ui/components";
```

## 2. Use Components

### Buttons

```typescript
// Primary action
<AppButton title="Save" variant="primary" onPress={handleSave} />

// Secondary action
<AppButton title="Cancel" variant="ghost" onPress={handleCancel} />

// With loading state
<AppButton title="Saving..." variant="primary" loading />
```

### Cards

```typescript
// Simple card
<Card>
  <Text>Content</Text>
</Card>

// Elevated card with press
<Card variant="elevated" pressable onPress={handlePress}>
  <Text>Tap me</Text>
</Card>
```

### Badges

```typescript
<Badge label="Daily" variant="primary" />
<Badge label="Active" variant="success" size="small" />
```

### Icon Buttons

```typescript
<IconButton icon="close" variant="ghost" onPress={handleClose} />
<IconButton icon="heart" variant="primary" size="large" />
```

### Screen Container

```typescript
<Screen scrollable>
  <Text>Your content</Text>
</Screen>
```

## 3. Use Theme Tokens

### Colors

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
  },
  text: {
    color: colors.text,
  },
  muted: {
    color: colors.textMuted,
  },
});
```

### Typography

```typescript
const styles = StyleSheet.create({
  heading: {
    ...typography.h2,
    color: colors.text,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
```

### Spacing

```typescript
const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  section: {
    marginBottom: spacing.xxxl,
  },
});
```

### Shadows

```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadows.md,
  },
});
```

## 4. Common Patterns

### List Item

```typescript
<Card variant="elevated" pressable onPress={handlePress}>
  <View style={styles.row}>
    <View style={styles.content}>
      <Text style={styles.title}>Title</Text>
      <Text style={styles.description}>Description</Text>
    </View>
    <IconButton icon="chevron-forward" variant="ghost" />
  </View>
</Card>

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  content: {
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    ...typography.h4,
    color: colors.text,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
```

### Form Section

```typescript
<View style={styles.section}>
  <Text style={styles.label}>Section Title</Text>
  <Card>
    {/* Form fields */}
  </Card>
</View>

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
```

### Action Bar

```typescript
<View style={styles.actions}>
  <AppButton
    title="Cancel"
    variant="outline"
    onPress={handleCancel}
    style={styles.button}
  />
  <AppButton
    title="Save"
    variant="primary"
    onPress={handleSave}
    style={styles.button}
  />
</View>

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  button: {
    flex: 1,
  },
});
```

## 5. Color Usage Guide

```typescript
// Backgrounds
backgroundColor: colors.background; // Screen background
backgroundColor: colors.surface; // Cards
backgroundColor: colors.surfaceElevated; // Elevated cards

// Text
color: colors.text; // Primary text
color: colors.textSecondary; // Supporting text
color: colors.textMuted; // Less important text

// Actions
backgroundColor: colors.primary; // Main actions
backgroundColor: colors.secondary; // Supporting actions
backgroundColor: colors.danger; // Destructive actions

// States
backgroundColor: colors.successSubtle; // Success background
backgroundColor: colors.warningSubtle; // Warning background
backgroundColor: colors.dangerSubtle; // Error background
```

## 6. Accessibility Checklist

✓ Use AppButton/IconButton for guaranteed 44x44px touch targets
✓ Use high contrast text colors (text, textSecondary)
✓ Add accessibilityLabel to interactive elements
✓ Use semantic colors consistently
✓ Test with VoiceOver/TalkBack
✓ Provide visual feedback on press

## 7. Common Mistakes to Avoid

❌ Don't use hardcoded colors

```typescript
backgroundColor: "#22c55e"; // Wrong
```

✓ Use theme colors

```typescript
backgroundColor: colors.primary; // Correct
```

❌ Don't use hardcoded sizes

```typescript
fontSize: 16,
padding: 12,
```

✓ Use theme tokens

```typescript
...typography.body,
padding: spacing.lg,
```

❌ Don't create custom buttons

```typescript
<TouchableOpacity style={customButtonStyle}>
  <Text>Button</Text>
</TouchableOpacity>
```

✓ Use AppButton

```typescript
<AppButton title="Button" variant="primary" />
```

## 8. Need More Help?

- **Complete Guide:** `docs/design-system.md`
- **Visual Reference:** `docs/design-visual-reference.md`
- **Migration Guide:** `docs/design-migration-guide.md`
- **Examples:** `docs/design-before-after-examples.md`
- **Color Guide:** `docs/color-palette-guide.md`

## 9. Pro Tips

1. **Use gap property** for spacing between flex children
2. **Spread typography first** then override specific properties
3. **Use semantic color names** (success, warning, danger)
4. **Test on both iOS and Android** - shadows render differently
5. **Use IconButton** instead of raw Pressable for icons
6. **Add shadows to elevated elements** for depth
7. **Use generous spacing** - when in doubt, use more space
8. **Prefer components** over custom implementations

## 10. Quick Reference

```typescript
// Most common imports
import { colors, spacing, typography, radius, shadows } from "@ui/theme";

import { AppButton, Screen, Card, Badge, IconButton } from "@ui/components";

// Most common colors
colors.primary; // Sage green
colors.text; // White text
colors.surface; // Card background
colors.background; // Screen background

// Most common spacing
spacing.lg; // 16px - default padding
spacing.md; // 12px - gaps
spacing.xxxl; // 32px - sections

// Most common typography
typography.h2; // Headings
typography.body; // Body text
typography.label; // Labels

// Most common radius
radius.lg; // 16px - cards
radius.md; // 12px - buttons

// Most common shadows
shadows.md; // Standard elevation
```

You're ready to build elegant, calming interfaces! 🎨
