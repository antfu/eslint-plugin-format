// @ts-check
import antfu from '@antfu/eslint-config'
import format from 'eslint-plugin-format'

export default antfu(
  {},
  {
    files: ['**/*.css'],
    languageOptions: {
      parser: format.parserPlain,
    },
    plugins: {
      format,
    },
    rules: {
      'format/prettier': ['error', { parser: 'css' }],
    },
  },
  {
    files: ['**/*.toml'],
    languageOptions: {
      parser: format.parserPlain,
    },
    plugins: {
      format,
    },
    rules: {
      'format/dprint': ['error', { language: 'toml' }],
    },
  },
  {
    files: ['**/*.graphql'],
    languageOptions: {
      parser: format.parserPlain,
    },
    plugins: {
      format,
    },
    rules: {
      'format/oxfmt': 'error',
    },
  },
)
