/** @type {import('jest').Config} */
const config = {
  // Specify that we're using TypeScript
  preset: 'ts-jest',
  
  // The test environment (node for backend testing)
  testEnvironment: 'node',
  
  // Where Jest should look for test files
  testMatch: [
    "**/__tests__/**/*.spec.ts",
    "**/*.spec.ts"
  ],
  
  // Root directory for your tests
  roots: ['<rootDir>/src'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**'
  ],
  
  // Coverage directory
  coverageDirectory: 'coverage',
  
  // Transform files
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
};

module.exports = config;