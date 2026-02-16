# Self Growth App

A React Native mobile application for personal growth tracking, built with Expo and TypeScript.

## Features

- **Habit Tracking**: Create, track, and manage daily/weekly/monthly habits
- **To-Do Management**: Organize tasks with checklists, due dates, and difficulty levels
- **User Profiles**: Personalized user profiles with household and subject scoping
- **Authentication**: Secure login and signup with JWT tokens
- **Offline Support**: Local data caching with React Query

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Query (TanStack Query)
- **Navigation**: React Navigation v7
- **Styling**: StyleSheet with theme tokens
- **API Client**: Axios
- **Storage**: Expo Secure Store & Async Storage

## Project Structure

```
src/
├── auth/              # Authentication logic and context
├── core/              # Core utilities (API client, config)
├── domain/            # Domain models and types
├── features/          # Feature modules (habits, todos, profile)
│   ├── habits/
│   │   ├── components/
│   │   ├── controllers/
│   │   ├── repositories/
│   │   └── services/
│   └── todos/
│       ├── components/
│       ├── controllers/
│       ├── repositories/
│       └── services/
├── navigation/        # Navigation stacks and tabs
├── scope/             # Household/subject scoping logic
├── screens/           # Screen components
└── ui/                # Shared UI components and theme
```

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
import { colors } from "@ui/theme/colors";
import { IHabit } from "@domain/models/habit";
import { useHabitListController } from "@features/habits/controllers/useHabitListController";
```

Available aliases:

- `@auth/*` - Authentication
- `@core/*` - Core utilities
- `@domain/*` - Domain models
- `@features/*` - Feature modules
- `@navigation/*` - Navigation
- `@scope/*` - Scoping logic
- `@screens/*` - Screens
- `@ui/*` - UI components and theme

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd self-growth-client
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory (see `.env.example`)

### Development

Start the development server:

```bash
npm start
```

Run on specific platform:

```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

Clear cache and restart:

```bash
npx expo start -c
```

### Type Checking

Run TypeScript compiler:

```bash
npx tsc --noEmit
```

## Architecture

### Feature Module Pattern

Each feature follows a consistent architecture:

```
feature/
├── components/       # UI components
├── controllers/      # React hooks for state management
├── repositories/     # API communication layer
├── services/         # Business logic layer
└── index.ts          # Barrel export
```

### Data Flow

```
Screen → Controller → Service → Repository → API
                ↓
            React Query Cache
```

### Scoping

All data is scoped by household and subject for multi-user support:

- Household: Group of users (e.g., family)
- Subject: Individual user within a household

## Code Standards

### TypeScript

- Strict mode enabled
- No `any` types
- Comprehensive JSDoc documentation
- Proper type imports from domain models

### Styling

- Use theme tokens (colors, spacing, radius, typography)
- No hardcoded values
- Consistent naming conventions
- StyleSheet.create for all styles

### Documentation

- JSDoc comments on all functions and components
- Include parameter descriptions
- Include return type descriptions
- Include usage examples
- Document error scenarios

### Testing

- Unit tests for services and repositories
- Integration tests for controllers
- E2E tests for critical user flows

## Environment Variables

Required environment variables:

```
API_BASE_URL=https://api.example.com
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure TypeScript compilation passes
4. Update documentation
5. Submit a pull request

## Design System

This app features an elegant, calming design system crafted for adults focused on personal development, with special consideration for users with ADHD and anxiety.

### Key Features

- **Calming Color Palette** - Sage green, serene blue, soft purple
- **ADHD-Friendly** - Generous spacing, clear hierarchy, high line heights
- **Anxiety-Reducing** - Muted colors, soft shadows, predictable patterns
- **Accessible** - 44x44px touch targets, WCAG AA contrast standards
- **Professional** - Sophisticated, minimalistic, adult-focused

### Quick Start

```typescript
import { colors, spacing, typography } from '@ui/theme';
import { AppButton, Card, Badge } from '@ui/components';

<AppButton title="Continue" variant="primary" />
<Card variant="elevated">Content</Card>
<Badge label="Daily" variant="primary" />
```

### Documentation

- **[Design System Index](docs/DESIGN-SYSTEM-INDEX.md)** - Start here for complete guide
- **[Quick Start](docs/design-quick-start.md)** - Get up and running in 5 minutes
- **[Design System](docs/design-system.md)** - Comprehensive documentation
- **[Color Guide](docs/color-palette-guide.md)** - Color psychology and usage
- **[Migration Guide](docs/design-migration-guide.md)** - Update existing code
- **[Examples](docs/design-before-after-examples.md)** - Before/after comparisons

## Documentation

Additional documentation available in `/docs`:

- [Architecture Overview](docs/architecture-overview.md)
- [Domain Models](docs/domain-model-and-entities.md)
- [Development Workflow](docs/development-workflow.md)
- [Implementation Roadmap](docs/implementation-roadmap.md)
- [Testing Guide](docs/testing-guide.md)
- [UI Components](docs/ui-components-and-theming.md)

## License

[Your License Here]

## Support

For issues and questions, please open an issue on GitHub.
