<!-- Last Updated: February 19, 2026 -->

# Testing Guide

## Current Setup

Tests use **Jest** (~29.7.0) with **ts-jest** in a Node environment. The project has 60 tests across 7 suites, all passing.

### Running Tests

```bash
npm test               # Run all tests (single run)
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage report
```

### Configuration

**jest.config.js** uses:

- `testEnvironment: "node"` (avoids Expo runtime issues with import.meta)
- `ts-jest` for TypeScript transformation (diagnostics disabled for speed)
- Path alias mapping matching `tsconfig.json` (`@auth/*`, `@core/*`, etc.)
- Setup file: `src/__tests__/setup.ts`

### Test File Location

```
src/__tests__/
├── setup.ts                          # Global mocks (SecureStore, apiClient)
├── auth/
│   ├── authApi.test.ts               # 3 tests
│   └── tokenStorage.test.ts          # 7 tests
├── features/
│   ├── habitService.test.ts          # 12 tests
│   ├── profileService.test.ts        # 8 tests
│   └── todoService.test.ts           # 8 tests
├── scope/
│   └── scopePath.test.ts             # 6 tests
└── ui/
    └── theme.test.ts                 # 16 tests
```

## Test Patterns

### Service Tests (mock repository)

```typescript
jest.mock("@features/habits/repositories/habitRepository");

describe("habitService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should list habits", async () => {
    (habitRepository.list as jest.Mock).mockResolvedValue({
      items: mockHabits,
    });
    const result = await habitService.list("hh-1", "sub-1");
    expect(result).toEqual(mockHabits);
  });

  it("should reject empty title", async () => {
    await expect(
      habitService.create("hh-1", "sub-1", { title: "" }),
    ).rejects.toThrow("Habit title is required");
  });
});
```

### Auth Tests (mock SecureStore)

```typescript
jest.mock("expo-secure-store");

it("should save and retrieve access token", async () => {
  await saveTokens({
    accessToken: "tok123",
    refreshToken: "ref456",
    idToken: "id789",
  });
  expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
    "sg_access_token",
    "tok123",
  );
});
```

### Theme Tests (validate design tokens)

```typescript
it("all colors should be valid hex or rgba", () => {
  Object.values(colors).forEach((color) => {
    expect(color).toMatch(/^(#[0-9a-fA-F]{6}|rgba?\(.+\))$/);
  });
});

it("spacing values should be monotonically increasing", () => {
  const values = Object.values(spacing);
  for (let i = 1; i < values.length; i++) {
    expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
  }
});
```

### Scope Tests (pure function)

```typescript
it("should build scoped path", () => {
  expect(scopedPath("hh-1", "sub-2", "/todos")).toBe(
    "/households/hh-1/subjects/sub-2/todos",
  );
});
```

## Global Mocks (setup.ts)

The setup file mocks:

- `expo-secure-store` (getItemAsync, setItemAsync, deleteItemAsync)
- `@core/network/apiClient` (get, post, put, delete)
- `@react-native-async-storage/async-storage`

## Adding New Tests

1. Create test file in `src/__tests__/{category}/`
2. Mock external dependencies (repositories, API client)
3. Test business logic, validation, and edge cases
4. Run `npm test` to verify

## Coverage

Run `npm run test:coverage` to generate a report in `coverage/`. The `coverage/` directory is gitignored.

## Future Testing

- **Component tests** — @testing-library/react-native is installed but not yet used for component rendering tests
- **Integration tests** — React Query hook testing with QueryClientProvider wrapper
- **E2E tests** — Detox or Maestro for critical user journeys

## Related Docs

- [Coding Patterns](./coding-patterns.md)
- [Architecture Overview](./architecture-overview.md)
