# Testing Guide

## Testing Strategy

### Testing Pyramid

```
        /\
       /  \
      / E2E \          Few (Critical user journeys)
     /______\
    /        \
   / Integration \     Some (Feature workflows)
  /______________\
 /                \
/   Unit Tests     \   Many (Business logic, utilities)
/____________________\
```

### What to Test

**Unit Tests (Most):**

- Services (business logic)
- Utilities and helpers
- Custom hooks
- Data transformations
- Validation functions

**Integration Tests (Some):**

- Repository + API interactions
- Context providers
- Navigation flows
- Form submissions

**E2E Tests (Few):**

- Authentication flow
- Create/edit/delete todo
- Critical user journeys

## Setup

### Install Testing Dependencies

```bash
npm install --save-dev \
  jest \
  @testing-library/react-native \
  @testing-library/jest-native \
  @testing-library/react-hooks \
  @types/jest \
  jest-expo \
  axios-mock-adapter
```

### Jest Configuration

**jest.config.js:**

```javascript
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "<rootDir>/jest.setup.js",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/index.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

**jest.setup.js:**

```javascript
import "@testing-library/jest-native/extend-expect";

// Mock Expo modules
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock React Navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## Unit Testing

### Testing Services

**Example: todoService.test.ts**

```typescript
import { todoService } from "../todoService";
import { todoRepository } from "../../repositories/todoRepository";
import { IToDo } from "../../../domain/models/todo";

// Mock the repository
jest.mock("../../repositories/todoRepository");

describe("todoService", () => {
  const mockHouseholdId = "hh-123";
  const mockSubjectId = "sub-456";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should return list of todos", async () => {
      const mockTodos: IToDo[] = [
        {
          id: "1",
          title: "Test Todo",
          status: "active",
          dataCreated: "2025-01-01",
          dateModified: "2025-01-01",
        },
      ];

      (todoRepository.list as jest.Mock).mockResolvedValue({
        items: mockTodos,
        lastEvaluatedKey: null,
      });

      const result = await todoService.list(mockHouseholdId, mockSubjectId);

      expect(todoRepository.list).toHaveBeenCalledWith(
        mockHouseholdId,
        mockSubjectId,
      );
      expect(result).toEqual(mockTodos);
    });

    it("should handle errors", async () => {
      (todoRepository.list as jest.Mock).mockRejectedValue(
        new Error("Network error"),
      );

      await expect(
        todoService.list(mockHouseholdId, mockSubjectId),
      ).rejects.toThrow("Network error");
    });
  });

  describe("toggleComplete", () => {
    it("should toggle active to completed", async () => {
      const mockTodo: IToDo = {
        id: "1",
        title: "Test",
        status: "active",
        dataCreated: "2025-01-01",
        dateModified: "2025-01-01",
      };

      const updatedTodo = { ...mockTodo, status: "completed" };
      (todoRepository.update as jest.Mock).mockResolvedValue(updatedTodo);

      const result = await todoService.toggleComplete(
        mockHouseholdId,
        mockSubjectId,
        mockTodo,
      );

      expect(todoRepository.update).toHaveBeenCalledWith(
        mockHouseholdId,
        mockSubjectId,
        { id: "1", status: "completed" },
      );
      expect(result.status).toBe("completed");
    });

    it("should toggle completed to active", async () => {
      const mockTodo: IToDo = {
        id: "1",
        title: "Test",
        status: "completed",
        dataCreated: "2025-01-01",
        dateModified: "2025-01-01",
      };

      const updatedTodo = { ...mockTodo, status: "active" };
      (todoRepository.update as jest.Mock).mockResolvedValue(updatedTodo);

      const result = await todoService.toggleComplete(
        mockHouseholdId,
        mockSubjectId,
        mockTodo,
      );

      expect(result.status).toBe("active");
    });
  });
});
```

### Testing Repositories

**Example: todoRepository.test.ts**

```typescript
import { todoRepository } from "../todoRepository";
import { apiClient } from "../../../core/network/apiClient";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(apiClient);

describe("todoRepository", () => {
  const householdId = "hh-123";
  const subjectId = "sub-456";

  afterEach(() => {
    mock.reset();
  });

  describe("list", () => {
    it("should fetch todos with correct path", async () => {
      const mockResponse = {
        items: [{ id: "1", title: "Test" }],
        lastEvaluatedKey: null,
      };

      mock
        .onGet(`/households/${householdId}/subjects/${subjectId}/todos`)
        .reply(200, mockResponse);

      const result = await todoRepository.list(householdId, subjectId);

      expect(result).toEqual(mockResponse);
    });

    it("should handle 404 errors", async () => {
      mock
        .onGet(`/households/${householdId}/subjects/${subjectId}/todos`)
        .reply(404, { error: "Not found" });

      await expect(
        todoRepository.list(householdId, subjectId),
      ).rejects.toThrow();
    });
  });

  describe("create", () => {
    it("should create todo with correct payload", async () => {
      const payload = { title: "New Todo", difficulty: "easy" };
      const mockResponse = { id: "1", ...payload };

      mock
        .onPost(`/households/${householdId}/subjects/${subjectId}/todos`)
        .reply(201, mockResponse);

      const result = await todoRepository.create(
        householdId,
        subjectId,
        payload,
      );

      expect(result).toEqual(mockResponse);
    });
  });
});
```

### Testing Utilities

**Example: scopePath.test.ts**

```typescript
import { buildScopePrefix, scopedPath } from "../scopePath";

describe("scopePath", () => {
  describe("buildScopePrefix", () => {
    it("should build correct prefix", () => {
      const result = buildScopePrefix("hh-123", "sub-456");
      expect(result).toBe("/households/hh-123/subjects/sub-456");
    });

    it("should encode special characters", () => {
      const result = buildScopePrefix("hh 123", "sub/456");
      expect(result).toBe("/households/hh%20123/subjects/sub%2F456");
    });
  });

  describe("scopedPath", () => {
    it("should build full path with leading slash", () => {
      const result = scopedPath("hh-123", "sub-456", "/todos");
      expect(result).toBe("/households/hh-123/subjects/sub-456/todos");
    });

    it("should build full path without leading slash", () => {
      const result = scopedPath("hh-123", "sub-456", "todos");
      expect(result).toBe("/households/hh-123/subjects/sub-456/todos");
    });
  });
});
```

### Testing Custom Hooks

**Example: useToDoListController.test.ts**

```typescript
import { renderHook, waitFor } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useToDoListController } from '../useToDoListController';
import { todoService } from '../../services/todoService';

jest.mock('../../services/todoService');
jest.mock('../../../scope/AppScopeContext', () => ({
  useAppScope: () => ({
    activeHouseholdId: 'hh-123',
    activeSubjectId: 'sub-456'
  })
}));

describe('useToDoListController', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should fetch todos on mount', async () => {
    const mockTodos = [
      { id: '1', title: 'Test Todo', status: 'active' }
    ];

    (todoService.list as jest.Mock).mockResolvedValue(mockTodos);

    const { result } = renderHook(() => useToDoListController(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.hasScope).toBe(true);
  });

  it('should toggle todo completion', async () => {
    const mockTodo = { id: '1', title: 'Test', status: 'active' };
    (todoService.list as jest.Mock).mockResolvedValue([mockTodo]);
    (todoService.toggleComplete as jest.Mock).mockResolvedValue({
      ...mockTodo,
      status: 'completed'
    });

    const { result } = renderHook(() => useToDoListController(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.toggleComplete(mockTodo);

    await waitFor(() => expect(result.current.isToggling).toBe(false));

    expect(todoService.toggleComplete).toHaveBeenCalledWith(
      'hh-123',
      'sub-456',
      mockTodo
    );
  });
});
```

## Integration Testing

### Testing Context Providers

**Example: AuthContext.test.tsx**

```typescript
import { renderHook, act, waitFor } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '../AuthContext';
import { authApi } from '../authApi';
import * as tokenStorage from '../tokenStorage';

jest.mock('../authApi');
jest.mock('../tokenStorage');

describe('AuthContext', () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize as not authenticated', () => {
    (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthed).toBe(false);
  });

  it('should login successfully', async () => {
    const mockTokens = {
      accessToken: 'token123',
      refreshToken: 'refresh123',
      idToken: 'id123',
      expiresIn: 3600,
      tokenType: 'Bearer'
    };

    (authApi.login as jest.Mock).mockResolvedValue(mockTokens);
    (tokenStorage.saveTokens as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(authApi.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(tokenStorage.saveTokens).toHaveBeenCalledWith(mockTokens);
    expect(result.current.isAuthed).toBe(true);
  });

  it('should handle login errors', async () => {
    (authApi.login as jest.Mock).mockRejectedValue(
      new Error('Invalid credentials')
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      result.current.login('test@example.com', 'wrong')
    ).rejects.toThrow('Invalid credentials');

    expect(result.current.isAuthed).toBe(false);
  });

  it('should logout successfully', async () => {
    (tokenStorage.clearTokens as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(tokenStorage.clearTokens).toHaveBeenCalled();
    expect(result.current.isAuthed).toBe(false);
  });
});
```

### Testing Components

**Example: ToDoItemCard.test.tsx**

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ToDoItemCard from '../ToDoItemCard';
import { IToDo } from '../../../domain/models/todo';

describe('ToDoItemCard', () => {
  const mockTodo: IToDo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test description',
    status: 'active',
    dateDue: '2025-01-15',
    dataCreated: '2025-01-01',
    dateModified: '2025-01-01'
  };

  const mockOnToggle = jest.fn();
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title', () => {
    const { getByText } = render(
      <ToDoItemCard
        todo={mockTodo}
        onToggle={mockOnToggle}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Test Todo')).toBeTruthy();
  });

  it('should render description', () => {
    const { getByText } = render(
      <ToDoItemCard
        todo={mockTodo}
        onToggle={mockOnToggle}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Test description')).toBeTruthy();
  });

  it('should call onToggle when checkbox pressed', () => {
    const { getByA11yRole } = render(
      <ToDoItemCard
        todo={mockTodo}
        onToggle={mockOnToggle}
        onPress={mockOnPress}
      />
    );

    const checkbox = getByA11yRole('checkbox');
    fireEvent.press(checkbox);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should call onPress when card pressed', () => {
    const { getByText } = render(
      <ToDoItemCard
        todo={mockTodo}
        onToggle={mockOnToggle}
        onPress={mockOnPress}
      />
    );

    fireEvent.press(getByText('Test Todo'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).not.toHaveBeenCalled();
  });

  it('should show completed state', () => {
    const completedTodo = { ...mockTodo, status: 'completed' as const };

    const { getByA11yRole } = render(
      <ToDoItemCard
        todo={completedTodo}
        onToggle={mockOnToggle}
        onPress={mockOnPress}
      />
    );

    const checkbox = getByA11yRole('checkbox');
    expect(checkbox).toHaveStyle({ backgroundColor: '#10b981' });
  });
});
```

### Testing Screens

**Example: ToDoScreen.test.tsx**

```typescript
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { ToDoScreen } from '../ToDoScreen';
import { useToDoListController } from '../../features/todos/controllers/useToDoListController';

jest.mock('../../features/todos/controllers/useToDoListController');
jest.mock('@react-navigation/native');

describe('ToDoScreen', () => {
  it('should show loading state', () => {
    (useToDoListController as jest.Mock).mockReturnValue({
      todos: [],
      isLoading: true,
      hasScope: true
    });

    const { getByText } = render(<ToDoScreen />);

    expect(getByText('Loading todos...')).toBeTruthy();
  });

  it('should show no scope message', () => {
    (useToDoListController as jest.Mock).mockReturnValue({
      todos: [],
      isLoading: false,
      hasScope: false
    });

    const { getByText } = render(<ToDoScreen />);

    expect(getByText(/No household\/subject selected/)).toBeTruthy();
  });

  it('should render todos list', async () => {
    const mockTodos = [
      { id: '1', title: 'Todo 1', status: 'active' },
      { id: '2', title: 'Todo 2', status: 'active' }
    ];

    (useToDoListController as jest.Mock).mockReturnValue({
      todos: mockTodos,
      isLoading: false,
      hasScope: true,
      toggleComplete: jest.fn(),
      deleteTodo: jest.fn()
    });

    const { getByText } = render(<ToDoScreen />);

    await waitFor(() => {
      expect(getByText('Todo 1')).toBeTruthy();
      expect(getByText('Todo 2')).toBeTruthy();
    });
  });

  it('should show empty state', () => {
    (useToDoListController as jest.Mock).mockReturnValue({
      todos: [],
      isLoading: false,
      hasScope: true
    });

    const { getByText } = render(<ToDoScreen />);

    expect(getByText(/No To Dos yet/)).toBeTruthy();
  });
});
```

## E2E Testing

### Setup Detox

```bash
npm install --save-dev detox detox-cli
```

**detox.config.js:**

```javascript
module.exports = {
  testRunner: "jest",
  runnerConfig: "e2e/config.json",
  apps: {
    "ios.debug": {
      type: "ios.app",
      binaryPath:
        "ios/build/Build/Products/Debug-iphonesimulator/SelfGrowth.app",
      build:
        "xcodebuild -workspace ios/SelfGrowth.xcworkspace -scheme SelfGrowth -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
    },
    "android.debug": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build:
        "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: {
        type: "iPhone 14",
      },
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "Pixel_4_API_30",
      },
    },
  },
  configurations: {
    "ios.sim.debug": {
      device: "simulator",
      app: "ios.debug",
    },
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug",
    },
  },
};
```

### E2E Test Example

**e2e/auth.test.js:**

```javascript
describe("Authentication Flow", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should show login screen", async () => {
    await expect(element(by.text("Login"))).toBeVisible();
  });

  it("should login successfully", async () => {
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("login-button")).tap();

    await waitFor(element(by.text("ToDos")))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("should show error on invalid credentials", async () => {
    await element(by.id("email-input")).typeText("wrong@example.com");
    await element(by.id("password-input")).typeText("wrong");
    await element(by.id("login-button")).tap();

    await expect(element(by.text("Invalid credentials"))).toBeVisible();
  });
});
```

**e2e/todos.test.js:**

```javascript
describe("ToDo Management", () => {
  beforeAll(async () => {
    await device.launchApp();
    // Login first
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("login-button")).tap();
    await waitFor(element(by.text("ToDos"))).toBeVisible();
  });

  it("should create a new todo", async () => {
    await element(by.id("create-todo-button")).tap();
    await element(by.id("todo-title-input")).typeText("Buy groceries");
    await element(by.id("save-todo-button")).tap();

    await expect(element(by.text("Buy groceries"))).toBeVisible();
  });

  it("should toggle todo completion", async () => {
    await element(by.id("todo-checkbox-1")).tap();

    await expect(element(by.id("todo-1"))).toHaveToggleValue(true);
  });

  it("should delete a todo", async () => {
    await element(by.id("todo-1")).swipe("left");
    await element(by.id("delete-button")).tap();

    await expect(element(by.text("Buy groceries"))).not.toBeVisible();
  });
});
```

## Test Coverage

### Running Coverage

```bash
npm run test:coverage
```

### Coverage Goals

- **Statements**: 70%+
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+

### Priority Coverage Areas

1. **Services** (90%+): Business logic must be well-tested
2. **Repositories** (80%+): API interactions critical
3. **Utilities** (90%+): Pure functions easy to test
4. **Controllers** (70%+): React Query hooks
5. **Components** (60%+): UI components

## Continuous Integration

### GitHub Actions Example

**.github/workflows/test.yml:**

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Mock external dependencies**
5. **Test edge cases and error states**
6. **Keep tests isolated and independent**
7. **Use factories for test data**
8. **Don't test third-party libraries**
9. **Maintain test coverage above 70%**
10. **Run tests before committing**
