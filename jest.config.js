module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  testMatch: ['**/test/**/*.test.(ts|js)'],
  collectCoverage: true,
  coverageDirectory: 'coverage'
};
