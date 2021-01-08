module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '.*\\.(js|json|ts)$': [
      'babel-jest',
      { configFile: './babel.jest.config.js' },
    ],
  },
  moduleNameMapper: {
    '^@vueposu/test-utils$': '<rootDir>/packages/shared/__tests__/utils.ts',
    '^@vueposu/(.*?)$': '<rootDir>/packages/$1/src',
    'vueposu': '<rootDir>/packages/vueposu/src',
  },
  collectCoverageFrom: ['<rootDir>/packages/**/*.ts'],
  coveragePathIgnorePatterns: ['/__tests__/'],
  watchPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es/.*)'],
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.[jt]s?(x)'],
};
