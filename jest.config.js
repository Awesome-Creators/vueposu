module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json', 'vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '.*\\.(js|json|ts)$': '<rootDir>/node_modules/babel-jest',
  },
  moduleNameMapper: {
    '@hooks/(.*)': '<rootDir>/src/hooks/$1',
    '@libs/(.*)': '<rootDir>/src/libs/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/unit/jest.setup.ts'],
};
