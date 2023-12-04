// @ts-check
import antfu from '@antfu/eslint-config'
import formatters from 'eslint-plugin-format'

export default antfu(
  {},
  {
    files: ['**/*.css'],
    languageOptions: {
      parser: formatters.parserPlain,
    },
    plugins: {
      formatters,
    },
    rules: {
      'formatters/prettier': ['error', { parser: 'css' }],
    },
  },
)
