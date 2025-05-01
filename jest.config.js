module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!your-module-name)'
  ],
  testEnvironment: 'jsdom'
};