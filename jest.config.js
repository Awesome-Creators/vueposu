module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '.*\\.(js|json|ts)$': [
      'babel-jest',
      { configFile: './babel.jest.config.js' },
    ],
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  // setupFilesAfterEnv: ['<rootDir>/test/unit/jest.setup.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es/.*)'],
};
