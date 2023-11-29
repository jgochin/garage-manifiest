module.exports = {
    // Specify the test environment
    testEnvironment: 'node', // For server-side tests
    // testEnvironment: 'jsdom', // For client-side tests (requires JSDOM)

    // Define the file patterns to include for testing
    testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$',

    // Ignore certain directories or files from being treated as tests
    testPathIgnorePatterns: ['/node_modules/'],

    // Set up test coverage reporting
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.ts', // Include TypeScript files
        '!src/**/*.d.ts', // Exclude TypeScript declaration files
    ],

    // Set up TypeScript support
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },

    // Define module name mappings for imports
    moduleNameMapper: {
        // Example: map module aliases
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    preset: 'ts-jest',
};
