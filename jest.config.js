module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        // Skip type checking for faster tests
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    "^@auth/(.*)$": "<rootDir>/src/auth/$1",
    "^@core/(.*)$": "<rootDir>/src/core/$1",
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@navigation/(.*)$": "<rootDir>/src/navigation/$1",
    "^@scope/(.*)$": "<rootDir>/src/scope/$1",
    "^@screens/(.*)$": "<rootDir>/src/screens/$1",
    "^@ui/(.*)$": "<rootDir>/src/ui/$1",
  },
  setupFiles: ["./src/__tests__/setup.ts"],
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx)"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
