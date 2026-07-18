import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/__tests__/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__tests__/__mocks__/file-mock.js",
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "babel-jest",
      {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-react", { runtime: "automatic" }],
          "@babel/preset-typescript",
        ],
        plugins: [resolve(__dirname, "__tests__/babel-plugin-import-meta.cjs")],
      },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@clerk|@tanstack|date-fns|lucide-react|zustand)/)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  testMatch: ["<rootDir>/__tests__/**/*.test.(ts|tsx|js|jsx)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "clover"],
  resetMocks: true,
  restoreMocks: true,
}
