# Design Before & After Examples

Practical examples showing the transformation from the old design to the new elegant system.

## Example 1: Button Styling

### Before

```typescript
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#22c55e", // Bright green
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#022c22",
    fontWeight: "600",
  },
});
```

### After

```typescript
import { AppButton } from '@ui/components';

<AppButton
  title="Continue"
  variant="primary"    // Sage green
  size="medium"        // 44px height
  onPress={handlePress}
/>

// Or with custom styling:
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,  // #7fb069
    paddingHorizontal: spacing.xl,    // 20px
    paddingVertical: spacing.md,      // 12px
    borderRadius: radius.lg,          // 16px
    ...shadows.md,                    // Subtle shadow
  },
  text: {
    ...typography.button,             // 15px, 600 weight
    color: colors.background,         // High contrast
  },
});
```

**Improvements:**

- Softer, calming green instead of bright
- Larger touch target (44px vs ~32px)
- Subtle shadow for depth
- Better text contrast
- Consistent spacing

## Example 2: Card Component

### Before

```typescript
const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#111827",
    flexDirection: "row",
  },
  title: {
    color: "#f9fafb",
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    color: "#d1d5db",
    fontSize: 14,
  },
});
```

### After

```typescript
import { Card } from '@ui/components';
import { colors, spacing, typography, shadows } from '@ui/theme';

<Card variant="elevated">
  {/* Content */}
</Card>

// Or custom:
const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,           // 16px (more breathing room)
    marginBottom: spacing.md,      // 12px
    borderRadius: radius.lg,       // 16px (softer corners)
    backgroundColor: colors.surface, // #1a1f35 (warmer)
    ...shadows.sm,                 // Subtle depth
  },
  title: {
    ...typography.h4,              // 18px, proper line height
    color: colors.text,            // #f8fafc
  },
  description: {
    ...typography.bodySmall,       // 14px, 22px line height
    color: colors.textSecondary,   // #cbd5e1
  },
});
```

**Improvements:**

- More generous padding (16px vs 12px)
- Softer, larger border radius
- Warmer background color
- Subtle shadow for elevation
- Better typography with proper line heights
- More descriptive color names

## Example 3: Badge/Label

### Before

```typescript
const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#1f2933",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: "#d1d5db",
    fontSize: 12,
    fontWeight: "500",
  },
});
```

### After

```typescript
import { Badge } from '@ui/components';

<Badge
  label="Daily"
  variant="secondary"  // Serene blue
  size="small"
/>

// Or custom:
const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.secondarySubtle, // Subtle blue
    paddingHorizontal: spacing.sm,           // 8px
    paddingVertical: spacing.xs,             // 4px
    borderRadius: radius.sm,                 // 8px
  },
  badgeText: {
    ...typography.labelSmall,                // Proper scale
    color: colors.secondary,                 // Matching color
  },
});
```

**Improvements:**

- Semantic color variants
- Subtle background (not solid)
- Consistent with design system
- Reusable component

## Example 4: Icon Button

### Before

```typescript
<Pressable
  onPress={handleArchive}
  hitSlop={10}
  style={{ padding: 4 }}
>
  <Ionicons
    name="pause-circle-outline"
    size={24}
    color="#9ca3af"
  />
</Pressable>
```

### After

```typescript
import { IconButton } from '@ui/components';

<IconButton
  icon="pause-circle-outline"
  variant="ghost"
  size="medium"  // 44x44px touch target
  onPress={handleArchive}
/>
```

**Improvements:**

- Guaranteed 44x44px touch target
- No need for hitSlop
- Consistent styling
- Built-in press feedback
- Accessible by default

## Example 5: Typography Hierarchy

### Before

```typescript
const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "700",
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
  },
});
```

### After

```typescript
import { typography } from "@ui/theme";

const styles = StyleSheet.create({
  display: {
    ...typography.display, // 32px, 40px line, -0.5 spacing
  },
  heading: {
    ...typography.h2, // 24px, 32px line, -0.3 spacing
  },
  subheading: {
    ...typography.h4, // 18px, 26px line, -0.1 spacing
  },
  body: {
    ...typography.body, // 15px, 24px line (ADHD-friendly)
  },
  label: {
    ...typography.label, // 13px, 20px line, 0.1 spacing
  },
  caption: {
    ...typography.caption, // 12px, 18px line, 0.1 spacing
  },
});
```

**Improvements:**

- Comprehensive scale with more options
- Generous line heights for readability
- Letter spacing for premium feel
- Clear hierarchy
- ADHD-friendly spacing

## Example 6: Spacing & Layout

### Before

```typescript
const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  section: {
    marginBottom: 16,
  },
  item: {
    marginBottom: 8,
  },
});
```

### After

```typescript
import { spacing } from "@ui/theme";

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg, // 16px (more breathing room)
  },
  section: {
    marginBottom: spacing.xxxl, // 32px (clear separation)
  },
  item: {
    marginBottom: spacing.md, // 12px (consistent rhythm)
  },
  gap: {
    gap: spacing.md, // Modern gap property
  },
});
```

**Improvements:**

- More generous spacing
- Consistent rhythm
- Semantic naming
- Easier to maintain

## Example 7: Complete Screen Comparison

### Before

```typescript
export function HabitListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habits</Text>
      <FlatList
        data={habits}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9fafb",
  },
});
```

### After

```typescript
import { Screen } from '@ui/components';
import { colors, spacing, typography } from '@ui/theme';
import HabitCard from '@features/habits/components/HabitCard';

export function HabitListScreen() {
  return (
    <Screen scrollable>
      <Text style={styles.title}>Habits</Text>
      <FlatList
        data={habits}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onPress={() => handlePress(item)}
            onArchive={() => handleArchive(item)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h1,              // Proper scale
    color: colors.text,            // Semantic naming
    marginBottom: spacing.xl,      // Generous spacing
  },
});
```

**Improvements:**

- Screen component handles safe areas
- Reusable HabitCard component
- Consistent spacing throughout
- Better typography
- Cleaner, more maintainable code
- Calming color palette

## Visual Differences Summary

| Aspect        | Before                 | After                   |
| ------------- | ---------------------- | ----------------------- |
| Primary Color | Bright green (#22c55e) | Sage green (#7fb069)    |
| Background    | Pure dark (#020617)    | Navy-gray (#0a0e1a)     |
| Spacing       | Compact (8-16px)       | Generous (16-24px)      |
| Shadows       | None or custom         | Consistent system       |
| Touch Targets | Variable (~32px)       | Minimum 44px            |
| Typography    | Basic scale            | Comprehensive scale     |
| Line Heights  | Default                | ADHD-friendly (1.5-1.6) |
| Border Radius | Small (6-8px)          | Soft (12-16px)          |
| Components    | Custom each time       | Reusable library        |
| Feel          | Functional             | Elegant & calming       |

## User Experience Impact

### Before

- Bright colors could be overstimulating
- Compact layout felt cramped
- Inconsistent spacing created visual noise
- Small touch targets were frustrating
- Felt more utilitarian than calming

### After

- Muted colors reduce anxiety
- Generous spacing reduces cognitive load
- Consistent patterns create predictability
- Large touch targets improve accessibility
- Feels professional and calming
- Perfect for adults focused on personal development
