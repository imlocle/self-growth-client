# Design System

## Philosophy

This design system is crafted for adults focused on personal development, with special consideration for users with ADHD, anxiety, and other mental health needs. The aesthetic is elegant, calming, and minimalistic—a stark contrast to gamified apps that feel childish.

### Core Principles

1. **Elegance Over Playfulness** - Sophisticated, muted tones instead of bright, saturated colors
2. **Calm Over Excitement** - Subtle animations and soft shadows instead of bold, attention-grabbing effects
3. **Clarity Over Complexity** - Clear visual hierarchy and generous spacing to reduce cognitive load
4. **Accessibility First** - High contrast, generous touch targets, and ADHD-friendly layouts

---

## Color System

### Philosophy

Colors are carefully chosen to create a calming, focused environment:

- **Sage Green** (primary) - Represents growth, nature, and balance
- **Serene Blue** (secondary) - Evokes calm, trust, and focus
- **Soft Purple** (accent) - Suggests mindfulness and wisdom
- **Deep Navy-Grays** (backgrounds) - Create depth without harshness

### Palette

#### Backgrounds

```typescript
background: "#0a0e1a"; // Deep, calming navy-gray
backgroundElevated: "#111827"; // Slightly elevated
```

#### Surfaces

```typescript
surface: "#1a1f35"; // Primary surface
surfaceElevated: "#232a42"; // Elevated cards
surfaceHover: "#2a3350"; // Interactive states
```

#### Primary (Sage Green)

```typescript
primary: "#7fb069"; // Main brand color
primaryLight: "#9bc47d"; // Lighter variant
primaryDark: "#5a8c4a"; // Darker variant
primarySubtle: "rgba(127, 176, 105, 0.12)"; // Subtle backgrounds
primaryGlow: "rgba(127, 176, 105, 0.25)"; // Glow effects
```

#### Secondary (Serene Blue)

```typescript
secondary: "#6b9bd1";
secondaryLight: "#8bb3e0";
secondarySubtle: "rgba(107, 155, 209, 0.12)";
```

#### Accent (Soft Purple)

```typescript
accent: "#a78bca";
accentLight: "#c4a7e7";
accentSubtle: "rgba(167, 139, 202, 0.12)";
```

#### Text

```typescript
text: "#f8fafc"; // Primary text (high contrast)
textSecondary: "#cbd5e1"; // Secondary text
textMuted: "#94a3b8"; // Muted text
textDisabled: "#64748b"; // Disabled state
```

#### Semantic Colors

```typescript
success: "#7fb069"; // Same as primary (growth)
warning: "#e8b86d"; // Soft amber
danger: "#d97777"; // Muted red
info: "#6b9bd1"; // Same as secondary
```

### Usage Guidelines

- Use `primary` for main actions and positive reinforcement
- Use `secondary` for supporting actions and informational elements
- Use `accent` sparingly for special highlights
- Use semantic colors (`success`, `warning`, `danger`) for status indicators
- Always use subtle variants (`*Subtle`) for backgrounds to avoid overwhelming users

---

## Typography

### Philosophy

Typography is designed for maximum readability and reduced cognitive load:

- Generous line heights (especially important for ADHD)
- Clear hierarchy with distinct sizes
- Consistent weight system
- Letter spacing for premium feel

### Type Scale

```typescript
display: {
  fontSize: 32,
  lineHeight: 40,
  fontWeight: "700",
  letterSpacing: -0.5,
}

h1: { fontSize: 28, lineHeight: 36, fontWeight: "700", letterSpacing: -0.4 }
h2: { fontSize: 24, lineHeight: 32, fontWeight: "600", letterSpacing: -0.3 }
h3: { fontSize: 20, lineHeight: 28, fontWeight: "600", letterSpacing: -0.2 }
h4: { fontSize: 18, lineHeight: 26, fontWeight: "600", letterSpacing: -0.1 }

bodyLarge: { fontSize: 17, lineHeight: 26, fontWeight: "400" }
body: { fontSize: 15, lineHeight: 24, fontWeight: "400" }
bodySmall: { fontSize: 14, lineHeight: 22, fontWeight: "400" }

label: { fontSize: 13, lineHeight: 20, fontWeight: "500", letterSpacing: 0.1 }
labelSmall: { fontSize: 12, lineHeight: 18, fontWeight: "500", letterSpacing: 0.2 }

caption: { fontSize: 12, lineHeight: 18, fontWeight: "400", letterSpacing: 0.1 }
captionSmall: { fontSize: 11, lineHeight: 16, fontWeight: "400", letterSpacing: 0.2 }

button: { fontSize: 15, lineHeight: 20, fontWeight: "600", letterSpacing: 0.3 }
buttonSmall: { fontSize: 13, lineHeight: 18, fontWeight: "600", letterSpacing: 0.3 }
```

### Usage Guidelines

- Use `display` for hero sections and major headings
- Use `h1-h4` for content hierarchy
- Use `body` variants for main content
- Use `label` for UI elements and metadata
- Use `caption` for supplementary information
- Use `button` for all button text

---

## Spacing

### Philosophy

Generous spacing reduces cognitive load and creates a calm, breathable interface.

### Scale

```typescript
xxs: 2; // Minimal gaps
xs: 4; // Tight spacing
sm: 8; // Small spacing
md: 12; // Medium spacing (default)
lg: 16; // Large spacing
xl: 20; // Extra large
xxl: 24; // Double extra large
xxxl: 32; // Triple extra large
huge: 40; // Huge spacing
massive: 48; // Massive spacing
```

### Usage Guidelines

- Use `lg` as the default padding for cards and containers
- Use `md` for gaps between related elements
- Use `xl-xxxl` for section spacing
- Use `huge-massive` for major layout divisions
- Never use less than `sm` for touch targets

---

## Border Radius

### Philosophy

Softer corners create a calming effect and align with modern design trends.

### Scale

```typescript
xs: 6; // Subtle rounding
sm: 8; // Small elements
md: 12; // Default for most elements
lg: 16; // Cards and containers
xl: 20; // Large containers
xxl: 24; // Extra large containers
pill: 999; // Pill-shaped
circle: 9999; // Perfect circles
```

### Usage Guidelines

- Use `lg` for cards and major containers
- Use `md` for buttons and inputs
- Use `sm` for badges and small elements
- Use `pill` for tags and pills
- Use `circle` for avatars and icon containers

---

## Shadows & Elevation

### Philosophy

Subtle shadows create depth without harshness. Glows are used for interactive elements.

### Shadow Scale

```typescript
sm: {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 2,
}

md: {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 4,
}

lg: {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
}

xl: {
  shadowColor: colors.shadowStrong,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.35,
  shadowRadius: 16,
  elevation: 12,
}
```

### Glow Effects

```typescript
glow: {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 4,
}

glowStrong: {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 12,
  elevation: 6,
}
```

### Usage Guidelines

- Use `sm` for subtle elevation (list items, small cards)
- Use `md` for standard cards and buttons
- Use `lg` for modals and floating elements
- Use `xl` for major overlays
- Use `glow` for focused or active interactive elements

---

## Animations

### Philosophy

Subtle, smooth animations reduce anxiety and create a polished experience.

### Durations

```typescript
instant: 100ms   // Immediate feedback
fast: 200ms      // Quick transitions
normal: 300ms    // Standard animations
slow: 400ms      // Deliberate movements
slower: 600ms    // Emphasis animations
```

### Easing

```typescript
standard: "ease-in-out"; // Most interactions
decelerate: "ease-out"; // Entering elements
accelerate: "ease-in"; // Exiting elements
spring: "spring"; // Playful interactions
```

### Usage Guidelines

- Use `fast` for button presses and toggles
- Use `normal` for most transitions
- Use `slow` for page transitions
- Use `slower` for emphasis (e.g., success states)
- Always use `useNativeDriver: true` for performance

---

## Components

### AppButton

Elegant, accessible button with multiple variants.

**Variants:**

- `primary` - Main actions (sage green)
- `secondary` - Supporting actions (serene blue)
- `outline` - Tertiary actions (transparent with border)
- `ghost` - Minimal actions (transparent)
- `danger` - Destructive actions (muted red)

**Sizes:**

- `small` - 36px min height
- `medium` - 44px min height (default)
- `large` - 52px min height

**Props:**

- `title` - Button text
- `variant` - Visual style
- `size` - Button size
- `loading` - Shows spinner
- `fullWidth` - Expands to container width
- `disabled` - Disables interaction

**Example:**

```tsx
<AppButton
  title="Continue"
  variant="primary"
  size="large"
  onPress={handleContinue}
/>
```

### Card

Elegant container component with depth.

**Variants:**

- `default` - Standard surface
- `elevated` - Raised with shadow
- `outlined` - Transparent with border

**Props:**

- `variant` - Visual style
- `pressable` - Makes card interactive
- `onPress` - Press handler

**Example:**

```tsx
<Card variant="elevated" pressable onPress={handlePress}>
  <Text>Content</Text>
</Card>
```

### Badge

Small label for metadata and status.

**Variants:**

- `default` - Neutral gray
- `primary` - Sage green
- `secondary` - Serene blue
- `success` - Success state
- `warning` - Warning state
- `danger` - Error state

**Sizes:**

- `small` - Compact
- `medium` - Standard (default)

**Example:**

```tsx
<Badge label="Daily" variant="primary" />
<Badge label="Active" variant="success" size="small" />
```

### IconButton

Icon-only button with generous touch targets.

**Variants:**

- `default` - Neutral background
- `primary` - Primary color background
- `ghost` - Transparent
- `danger` - Danger color background

**Sizes:**

- `small` - 36x36px
- `medium` - 44x44px (default)
- `large` - 52x52px

**Example:**

```tsx
<IconButton icon="close" variant="ghost" onPress={handleClose} />
```

### Screen

Base container for all screens with safe area handling.

**Props:**

- `scrollable` - Wraps content in ScrollView
- `noPadding` - Removes default padding

**Example:**

```tsx
<Screen scrollable>
  <Text>Content</Text>
</Screen>
```

---

## Accessibility Guidelines

### Touch Targets

- Minimum 44x44px for all interactive elements
- Use `hitSlop` for small icons to expand touch area
- Provide visual feedback on press (opacity, scale)

### Color Contrast

- All text meets WCAG AA standards (4.5:1 for normal text)
- Important actions have higher contrast
- Never rely on color alone to convey information

### ADHD-Friendly Design

- Clear visual hierarchy reduces decision fatigue
- Generous spacing prevents overwhelming layouts
- Consistent patterns create predictability
- Subtle animations avoid distraction

### Anxiety-Friendly Design

- Calming color palette reduces stress
- Soft shadows and rounded corners feel safe
- Predictable interactions build confidence
- Clear feedback confirms actions

---

## Implementation

### Importing Theme

```typescript
import { colors, spacing, radius, typography, shadows } from "@ui/theme";
```

### Importing Components

```typescript
import { AppButton, Card, Badge, IconButton, Screen } from "@ui/components";
```

### Using in Styles

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
});
```

---

## Future Enhancements

### Potential Additions

- Custom font family (Inter, SF Pro, or Manrope)
- Glassmorphism effects for premium feel
- Haptic feedback for interactions
- Dark/light mode toggle (currently dark-only)
- Color themes (allow users to customize primary color)
- Reduced motion mode for accessibility

### Component Library Expansion

- Input fields with elegant styling
- Select/Picker components
- Modal/Dialog components
- Toast notifications
- Progress indicators
- Empty states
- Loading skeletons

---

## Maintenance

### Adding New Colors

1. Add to `src/ui/theme/colors.ts`
2. Follow naming convention (base, light, dark, subtle)
3. Ensure WCAG AA contrast ratios
4. Document usage in this file

### Adding New Components

1. Create in `src/ui/components/`
2. Follow existing patterns (variants, sizes, props)
3. Use theme tokens exclusively
4. Add JSDoc comments
5. Export from `src/ui/components/index.ts`
6. Document in this file

### Testing Design Changes

1. Test on both iOS and Android
2. Verify touch targets meet 44x44px minimum
3. Check color contrast with accessibility tools
4. Test with users who have ADHD/anxiety if possible
5. Ensure consistency across all screens
