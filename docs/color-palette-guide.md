# Color Palette Guide

Visual guide to the elegant, calming color system.

## Philosophy

Colors are chosen to create a calming, focused environment that reduces anxiety and supports mental wellness. The palette avoids bright, saturated colors in favor of sophisticated, muted tones.

## Primary: Sage Green (#7fb069)

**Meaning:** Growth, nature, balance, renewal

**Usage:**

- Main action buttons
- Success states
- Positive reinforcement
- Build habits indicator
- Active/selected states

**Variants:**

- Light: `#9bc47d` - Hover states
- Dark: `#5a8c4a` - Pressed states
- Subtle: `rgba(127, 176, 105, 0.12)` - Backgrounds
- Glow: `rgba(127, 176, 105, 0.25)` - Focus effects

**Psychology:** Green is universally calming and associated with growth and nature. Sage green specifically is muted enough to avoid overstimulation while still feeling positive and encouraging.

## Secondary: Serene Blue (#6b9bd1)

**Meaning:** Calm, trust, focus, clarity

**Usage:**

- Secondary actions
- Informational elements
- Counter badges (daily/weekly/monthly)
- Supporting UI elements

**Variants:**

- Light: `#8bb3e0` - Hover states
- Subtle: `rgba(107, 155, 209, 0.12)` - Backgrounds

**Psychology:** Blue reduces anxiety and promotes focus. This particular shade is soft enough to be calming without being cold or clinical.

## Accent: Soft Purple (#a78bca)

**Meaning:** Mindfulness, wisdom, creativity

**Usage:**

- Special highlights
- Premium features
- Occasional accents
- Use sparingly for impact

**Variants:**

- Light: `#c4a7e7` - Hover states
- Subtle: `rgba(167, 139, 202, 0.12)` - Backgrounds

**Psychology:** Purple suggests mindfulness and introspection, perfect for personal development. The soft, muted tone keeps it sophisticated.

## Backgrounds: Deep Navy-Grays

**Main Background:** `#0a0e1a`

- Deepest level
- Screen backgrounds
- Creates depth

**Elevated Background:** `#111827`

- Slightly lighter
- Secondary surfaces

**Surface:** `#1a1f35`

- Primary cards and containers
- Most common surface

**Surface Elevated:** `#232a42`

- Raised cards
- Modals and overlays

**Surface Hover:** `#2a3350`

- Interactive hover states

**Psychology:** Dark backgrounds reduce eye strain and create a calm, focused environment. The navy tint (vs pure black/gray) adds warmth and sophistication.

## Text Colors

**Primary Text:** `#f8fafc`

- Main content
- High contrast (meets WCAG AAA)
- Maximum readability

**Secondary Text:** `#cbd5e1`

- Supporting content
- Descriptions
- Still highly readable

**Muted Text:** `#94a3b8`

- Less important information
- Metadata
- Timestamps

**Disabled Text:** `#64748b`

- Disabled states
- Inactive elements

**Psychology:** High contrast text reduces cognitive load and eye strain, especially important for ADHD users.

## Semantic Colors

### Success: #7fb069 (Same as Primary)

- Completed actions
- Positive feedback
- Achievement indicators

### Warning: #e8b86d (Soft Amber)

- Caution states
- Important notices
- Difficulty stars
- Not alarming, just attention-getting

### Danger: #d97777 (Muted Red)

- Destructive actions
- Errors
- Quit habits indicator
- Muted to avoid anxiety

### Info: #6b9bd1 (Same as Secondary)

- Informational messages
- Tips and hints
- Neutral notifications

**Psychology:** Semantic colors are intentionally muted to convey meaning without causing anxiety or alarm.

## Borders

**Border:** `#2a3350`

- Default borders
- Subtle separation

**Border Light:** `#3a4563`

- Lighter borders
- Hover states

**Border Focus:** `#7fb069`

- Focused inputs
- Active elements

## Special Effects

**Overlay:** `rgba(10, 14, 26, 0.85)`

- Modal backgrounds
- Dimming effect

**Overlay Light:** `rgba(10, 14, 26, 0.60)`

- Lighter dimming
- Subtle overlays

**Glow:** `rgba(127, 176, 105, 0.15)`

- Subtle glow effects
- Hover states

**Shadow:** `rgba(0, 0, 0, 0.3)`

- Standard shadows
- Depth and elevation

**Shadow Strong:** `rgba(0, 0, 0, 0.5)`

- Stronger shadows
- Major elevation

## Color Combinations

### High Contrast (Accessibility)

- Text on Background: `#f8fafc` on `#0a0e1a` (19.5:1)
- Primary on Background: `#7fb069` on `#0a0e1a` (8.2:1)
- All combinations meet WCAG AA standards

### Harmonious Pairings

- Sage Green + Serene Blue (complementary calm)
- Sage Green + Soft Purple (growth + mindfulness)
- Navy Background + Sage Green (depth + life)

### Avoid

- Bright, saturated colors
- Pure red (too alarming)
- Pure yellow (too stimulating)
- High contrast borders (too harsh)

## Usage Guidelines

### Do:

✓ Use primary color for main actions
✓ Use subtle variants for backgrounds
✓ Maintain high contrast for text
✓ Use semantic colors consistently
✓ Test on both light and dark displays

### Don't:

✗ Mix bright colors with muted palette
✗ Use low contrast text
✗ Overuse accent color
✗ Use color alone to convey information
✗ Add colors not in the system

## Accessibility Notes

- All text colors meet WCAG AA standards (4.5:1 minimum)
- Primary text meets WCAG AAA standards (7:1 minimum)
- Never rely on color alone (use icons, text, patterns)
- Test with color blindness simulators
- Provide alternative indicators for color-coded information

## Comparison to Habitica/Finch

| Aspect       | Habitica/Finch     | This App             |
| ------------ | ------------------ | -------------------- |
| Saturation   | High (90-100%)     | Low (40-60%)         |
| Brightness   | Bright, vibrant    | Muted, sophisticated |
| Palette Size | Many colors        | Focused, minimal     |
| Background   | Light or bright    | Deep, calming        |
| Feel         | Playful, energetic | Calm, professional   |

## Testing Your Colors

1. View on different devices (iOS, Android)
2. Test in different lighting conditions
3. Use color blindness simulators
4. Check contrast ratios with tools
5. Get feedback from target users (adults with ADHD/anxiety)

## Future Considerations

- Light mode variant (if requested)
- User-customizable primary color
- Seasonal color themes
- High contrast mode
- Reduced saturation mode for photosensitivity
