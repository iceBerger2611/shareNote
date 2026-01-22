import type { Config } from "jest";

const config: Config = {
  // Tell Jest this is a Node backend (not jsdom / browser)
  testEnvironment: "node",

  // Use ts-jest to run TypeScript tests
  preset: "ts-jest",

  // Run this file BEFORE any test files or imports
  setupFiles: ["<rootDir>/jest.setup.ts"],

  // Where Jest should look for tests
  testMatch: ["**/?(*.)+(spec|test).ts"],

  // Resolve TS path aliases if you use them
  moduleFileExtensions: ["ts", "js", "json"],

  moduleNameMapper: {
    "^@app/(.*)$": "<rootDir>/../$1",
  },

  // Optional but recommended: clearer output while you learn
  verbose: true,
};

export default config;
