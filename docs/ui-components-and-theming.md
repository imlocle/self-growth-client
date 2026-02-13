# UI Components and Theming

## Design System

The app uses a centralized design system with consistent tokens for colors, spacing, typography, and border radius.

### Theme Structure

```
src/ui/
├── components/          # Reusable UI components
│   ├── AppButton.tsx
│   └── Screen.tsx
└── theme/              # Design tokens
    ├── colors.ts
    ├── spacing.ts
    ├── typography.ts
    └── radius.ts
```

## Design Tokens

### Colors

**Location:** `src/ui/theme/colors.ts`

```typescript
export const colors = {
  // Backgrounds
  background: "#020617", // Main app background (dark slate)
  surface: "#111827", // Card/container background
  surfaceAlt: "#1f2933", // Alternative surface (lighter)

  // Primary
  primary: "#22c55e", // Green accent (actions, CTAs)
  primaryText: "#022c22", // Text on primary background

  // Text
  text: "#f9fafb", // Primary text (white)
  textMuted: "#9ca3af", // Secondary text (gray)
  textSoft: "#d1d5db", // Tertiary text (light gray)

  // Semantic
  danger: "#f97373", // Error/delete actions (red)

  // Borders
  border: "#1f2933", // Subtle borders
};
```

**Usage:**

```typescript
import { colors } from "@/ui/theme/colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text,
  },
});
```

### Spacing

**Location:** `src/ui/theme/spacing.ts`

```typescript
export const spacing = {
  xs: 4, // Extra small
  sm: 8, // Small
  md: 12, // Medium (default)
  lg: 16, // Large
  xl: 24, // Extra large
  xxl: 32, // Extra extra large
};
```

**Usage:**

```typescript
import { spacing } from "@/ui/theme/spacing";

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
});
```

**Guidelines:**

- Use `xs` for tight spacing (icon padding)
- Use `sm` for compact layouts
- Use `md` as default spacing
- Use `lg` for comfortable spacing
- Use `xl` for section separation
- Use `xxl` for major layout divisions

### Typography

**Location:** `src/ui/theme/typography.ts`

```typescript
export const typography = {
  heading: {
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 32,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
};
```

**Usage:**

```typescript
import { typography } from "@/ui/theme/typography";

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    color: colors.text,
  },
});
```

### Border Radius

**Location:** `src/ui/theme/radius.ts`

```typescript
export const radius = {
  sm: 4, // Small radius (subtle rounding)
  md: 8, // Medium radius (default)
  lg: 12, // Large radius (cards)
  xl: 16, // Extra large radius (modals)
  full: 9999, // Fully rounded (pills, circles)
};
```

**Usage:**

```typescript
import { radius } from "@/ui/theme/radius";

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
  },
  avatar: {
    borderRadius: radius.full,
  },
});
```

## Core Components

### Screen

**Location:** `src/ui/components/Screen.tsx`

Base container for all screens with safe area handling.

```typescript
<Screen>
  <Text>Content here</Text>
</Screen>
```

**Features:**

- Automatic safe area insets
- Consistent background color
- Standard padding

**Props:**

- Extends `ViewProps`
- `children`: React.ReactNode
- `style`: Additional styles

**Implementation:**

```typescript
export function Screen({ children, style, ...rest }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.md },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
});
```

### AppButton

**Location:** `src/ui/components/AppButton.tsx`

Primary button component.

```typescript
<AppButton
  title="Save"
  onPress={handleSave}
  disabled={isLoading}
/>
```

**Props:**

- Extends `TouchableOpacityProps`
- `title`: string (required)
- `onPress`: () => void
- `disabled`: boolean
- `style`: Additional styles

**Variants Needed:**

```typescript
// Primary (current)
<AppButton variant="primary" title="Save" />

// Secondary
<AppButton variant="secondary" title="Cancel" />

// Danger
<AppButton variant="danger" title="Delete" />

// Ghost
<AppButton variant="ghost" title="Skip" />
```

**Implementation Example:**

```typescript
interface Props extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}

export const AppButton: React.FC<Props> = ({
  title,
  variant = 'primary',
  size = 'medium',
  style,
  disabled,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style
      ]}
      disabled={disabled}
      {...rest}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

## Feature Components

### ToDoItemCard

**Location:** `src/features/todos/components/ToDoItemCard.tsx`

Displays a single todo item with checkbox and content.

```typescript
<ToDoItemCard
  todo={todo}
  onToggle={() => toggleComplete(todo)}
  onPress={() => navigation.navigate('EditToDo', { todo })}
/>
```

**Features:**

- Checkbox for completion toggle
- Visual states (active, completed, deleted)
- Tap to edit
- Displays title, description, due date

**Props:**

```typescript
interface Props {
  todo: IToDo;
  onToggle: () => void;
  onPress: () => void;
}
```

**Visual States:**

- Active: Full opacity, white text
- Completed: Reduced opacity, muted text, green checkbox
- Deleted: Very low opacity, muted text

## Navigation Components

### CustomTabBar

**Location:** `src/navigation/CustomTabBar.tsx`

Custom bottom tab bar with icons and labels.

**Features:**

- Icon mapping for each route
- Active/inactive states
- Hides on nested screens (e.g., EditToDo)

**Icon Mapping:**

```typescript
const iconMap = {
  ToDos: "checkbox-outline",
  Habits: "repeat-outline",
  Profile: "person-outline",
};
```

## Component Patterns

### 1. Consistent Prop Interfaces

```typescript
// ✅ Good: Clear, typed props
interface ToDoItemProps {
  todo: IToDo;
  onToggle: () => void;
  onPress: () => void;
  showDescription?: boolean;
}

// ❌ Bad: Unclear props
interface ToDoItemProps {
  data: any;
  onClick: Function;
}
```

### 2. Composition Over Configuration

```typescript
// ✅ Good: Composable
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>

// ❌ Bad: Too many props
<Card
  title="Title"
  content="Content"
  showHeader={true}
  headerAlign="left"
/>
```

### 3. Controlled vs Uncontrolled

```typescript
// Controlled (parent manages state)
<TextInput
  value={title}
  onChangeText={setTitle}
/>

// Uncontrolled (component manages state)
<TextInput
  defaultValue={initialTitle}
  onBlur={(e) => handleSave(e.target.value)}
/>
```

## Missing Components (To Build)

### 1. TextInput

```typescript
// src/ui/components/TextInput.tsx
interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function TextInput({
  label,
  error,
  helperText,
  style,
  ...rest
}: TextInputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          error && styles.inputError,
          style
        ]}
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {helperText && !error && (
        <Text style={styles.helper}>{helperText}</Text>
      )}
    </View>
  );
}
```

### 2. Card

```typescript
// src/ui/components/Card.tsx
interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, onPress, style }: CardProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={[styles.card, style]}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  }
});
```

### 3. Modal

```typescript
// src/ui/components/Modal.tsx
interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>
          )}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
```

### 4. LoadingSpinner

```typescript
// src/ui/components/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}

export function LoadingSpinner({
  size = 'large',
  color = colors.primary,
  text
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}
```

### 5. EmptyState

```typescript
// src/ui/components/EmptyState.tsx
interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action && (
        <AppButton
          title={action.label}
          onPress={action.onPress}
          style={styles.button}
        />
      )}
    </View>
  );
}
```

### 6. ErrorMessage

```typescript
// src/ui/components/ErrorMessage.tsx
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={48} color={colors.danger} />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <AppButton
          title="Try Again"
          onPress={onRetry}
          variant="secondary"
        />
      )}
    </View>
  );
}
```

### 7. Dropdown/Select

```typescript
// src/ui/components/Select.tsx
interface SelectProps<T> {
  label?: string;
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
  placeholder?: string;
}

export function Select<T>({
  label,
  value,
  options,
  onChange,
  placeholder
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        style={styles.trigger}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.value}>
          {options.find(o => o.value === value)?.label || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
      </Pressable>

      <Modal visible={isOpen} onClose={() => setIsOpen(false)}>
        {options.map((option) => (
          <Pressable
            key={String(option.value)}
            style={styles.option}
            onPress={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
          >
            <Text style={styles.optionText}>{option.label}</Text>
          </Pressable>
        ))}
      </Modal>
    </View>
  );
}
```

### 8. DatePicker

```typescript
// src/ui/components/DatePicker.tsx
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export function DatePicker({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate
}: DatePickerProps) {
  const [show, setShow] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        style={styles.trigger}
        onPress={() => setShow(true)}
      >
        <Text style={styles.value}>
          {value.toLocaleDateString()}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
      </Pressable>

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          onChange={(event, date) => {
            setShow(false);
            if (date) onChange(date);
          }}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
}
```

## Styling Best Practices

### 1. Use StyleSheet.create

```typescript
// ✅ Good: Optimized
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  }
});

// ❌ Bad: Inline styles (re-created on every render)
<View style={{ flex: 1, padding: 12 }} />
```

### 2. Compose Styles

```typescript
// ✅ Good: Composable
<View style={[styles.base, isActive && styles.active, customStyle]} />

// ❌ Bad: Conditional inline styles
<View style={{
  ...styles.base,
  ...(isActive ? { backgroundColor: 'blue' } : {})
}} />
```

### 3. Use Theme Tokens

```typescript
// ✅ Good: Consistent
const styles = StyleSheet.create({
  text: {
    color: colors.text,
    fontSize: typography.body.fontSize,
    padding: spacing.md,
  },
});

// ❌ Bad: Magic numbers
const styles = StyleSheet.create({
  text: {
    color: "#f9fafb",
    fontSize: 16,
    padding: 12,
  },
});
```

### 4. Platform-Specific Styles

```typescript
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

## Accessibility

### 1. Add Accessibility Labels

```typescript
<TouchableOpacity
  accessibilityLabel="Toggle todo completion"
  accessibilityRole="checkbox"
  accessibilityState={{ checked: isCompleted }}
>
  <View style={styles.checkbox} />
</TouchableOpacity>
```

### 2. Support Screen Readers

```typescript
<Text
  accessible={true}
  accessibilityLabel={`Todo: ${todo.title}. Due ${todo.dateDue}`}
>
  {todo.title}
</Text>
```

### 3. Minimum Touch Targets

```typescript
// Ensure buttons are at least 44x44 points
const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});
```

### 4. Color Contrast

Ensure text meets WCAG AA standards:

- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio

Current theme has good contrast:

- `colors.text` (#f9fafb) on `colors.background` (#020617): ✅ 18.5:1
- `colors.primary` (#22c55e) on `colors.background` (#020617): ✅ 7.2:1

## Dark Mode Support (Future)

```typescript
// src/ui/theme/colors.ts
export const lightColors = {
  background: "#ffffff",
  surface: "#f3f4f6",
  text: "#111827",
  // ...
};

export const darkColors = {
  background: "#020617",
  surface: "#111827",
  text: "#f9fafb",
  // ...
};

// src/ui/theme/ThemeContext.tsx
export function useTheme() {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? darkColors : lightColors;
}
```

## Component Library Recommendations

Consider these libraries for advanced components:

- **react-native-paper**: Material Design components
- **react-native-elements**: Cross-platform UI toolkit
- **@shopify/restyle**: Type-safe styling system
- **react-native-toast-message**: Toast notifications
- **react-native-modal**: Enhanced modals
- **react-native-bottom-sheet**: Bottom sheets
