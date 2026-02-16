# Design System Migration Guide

Guide for updating existing screens to use the new elegant design system.

## Quick Migration Checklist

- [ ] Update color imports to use new palette
- [ ] Replace hardcoded sizes with typography tokens
- [ ] Update spacing to use new scale
- [ ] Add shadows to cards and elevated elements
- [ ] Replace custom buttons with AppButton component
- [ ] Use Badge component for labels
- [ ] Use IconButton for icon-only actions
- [ ] Ensure 44x44px minimum touch targets
- [ ] Add subtle press feedback

## Common Replacements

### Colors

```typescript
// OLD
import { colors } from "@ui/theme/colors";
backgroundColor: colors.surface;
color: colors.textMuted;

// NEW
import { colors } from "@ui/theme";
backgroundColor: colors.surface; // Same import path
color: colors.textSecondary; // More descriptive names
```

### Typography

```typescript
// OLD
fontSize: 16,
fontWeight: "600",

// NEW
import { typography } from "@ui/theme";
...typography.h4,
```

### Spacing

```typescript
// OLD
padding: 12,
marginBottom: 8,

// NEW
import { spacing } from "@ui/theme";
padding: spacing.lg,
marginBottom: spacing.md,
```

### Shadows

```typescript
// OLD
// No shadows or custom shadow code

// NEW
import { shadows } from "@ui/theme";
...shadows.md,
```

## Component Migrations

### Button Migration

```typescript
// OLD
<TouchableOpacity
  style={styles.button}
  onPress={handlePress}
>
  <Text style={styles.buttonText}>Submit</Text>
</TouchableOpacity>

// NEW
<AppButton
  title="Submit"
  variant="primary"
  size="medium"
  onPress={handlePress}
/>
```

### Card Migration

```typescript
// OLD
<View style={styles.card}>
  <Text>Content</Text>
</View>

// NEW
<Card variant="elevated">
  <Text>Content</Text>
</Card>
```

### Badge Migration

```typescript
// OLD
<View style={styles.badge}>
  <Text style={styles.badgeText}>Daily</Text>
</View>

// NEW
<Badge label="Daily" variant="primary" size="small" />
```

## Screen-by-Screen Strategy

### 1. Start with Theme Files

Already completed! ✓

### 2. Update Core Components

Already completed! ✓

- AppButton
- Screen
- Card
- Badge
- IconButton

### 3. Update Feature Components

Already completed! ✓

- HabitCard
- ToDoItemCard

### 4. Update Screens (Next Steps)

Priority order:

1. Auth screens (first impression)
2. List screens (most used)
3. Detail/Edit screens
4. Profile screen

### 5. Update Navigation

- CustomTabBar
- Stack headers

## Testing After Migration

1. Visual inspection on both iOS and Android
2. Test all interactive elements
3. Verify touch targets (44x44px minimum)
4. Check color contrast
5. Test with different content lengths
6. Verify animations feel smooth

## Common Issues & Solutions

### Issue: Colors look wrong

**Solution:** Make sure you're importing from `@ui/theme` not `@ui/theme/colors`

### Issue: Typography not applying

**Solution:** Use spread operator: `...typography.body`

### Issue: Shadows not showing on Android

**Solution:** Shadows object includes `elevation` property for Android

### Issue: Touch targets too small

**Solution:** Use IconButton component or add `hitSlop` prop

## Next Steps

After core migration is complete:

1. Add custom font (Inter, SF Pro, or Manrope)
2. Implement glassmorphism effects
3. Add haptic feedback
4. Create input components
5. Create modal/dialog components
6. Add toast notifications
7. Create loading states
8. Design empty states

## Need Help?

Refer to:

- `docs/design-system.md` - Complete design system documentation
- `docs/design-visual-reference.md` - Quick visual reference
- Component files in `src/ui/components/` - Implementation examples
