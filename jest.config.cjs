/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'CommonJS',
          ignoreDeprecations: '6.0'
        },
      },
    ],
  },
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/config/',
    '/src/repositories/',
    '/src/routes/',
    '/src/server.ts',
    '/src/schemas/',
    '/src/controllers/'
  ]
};