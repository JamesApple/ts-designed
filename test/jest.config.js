module.exports = {
  rootDir: "..",
  clearMocks: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "types\\.ts",
    "index\\.ts",
    ".+\\.d\\.ts"
  ],
  globals: {
    "ts-jest": {
      tsconfig: "src/__tests__/tsconfig.json"
    }
  },
  testPathIgnorePatterns: ["/node_modules/", "/fixtures/", "/utils/"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
