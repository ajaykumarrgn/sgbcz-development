import { rules as customRules } from './eslint-plugin-custom-rules.js';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        frm: 'readonly',
        frappe: 'readonly',
        doc: 'readonly',
        __: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      'custom-rules': {
        rules: customRules
      }
    },
    rules: {
      'max-len': ['error', { code: 80, ignorePattern: '\\b(frm|frappe|doc|__|console\\.log)\\b' }],
      'semi': ['error', 'always'],
      'indent': ['off'],
      'camelcase': ['error', { properties: 'always' }],
      'custom-rules/variable-naming': 'error',
      'custom-rules/function-naming': 'error',
    }
  }
];
