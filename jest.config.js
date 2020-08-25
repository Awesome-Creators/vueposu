module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json', 'vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '.*\\.(js|json|ts)$': '<rootDir>/node_modules/babel-jest',
  },
};
