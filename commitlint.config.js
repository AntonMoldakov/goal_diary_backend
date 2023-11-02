module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'never', ['snake-case', 'pascal-case', 'camel-case']],
  },
};
