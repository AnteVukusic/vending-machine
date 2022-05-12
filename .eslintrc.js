module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-plusplus': 'off',
    'max-len': 'off',
    'no-underscore-dangle': 'off',
  },
};
