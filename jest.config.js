module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '.*\\.(js|json|ts)$': [
      'babel-jest',
      { configFile: './babel.jest.config.js' },
    ],
  },
  moduleNameMapper: {
    '@hooks/(.*)': '<rootDir>/src/hooks/$1',
    '@libs/(.*)': '<rootDir>/src/libs/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/unit/jest.setup.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es/.*)'],
};
