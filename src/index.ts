import * as parserPlain from 'eslint-parser-plain'
import prettier from './rules/prettier'

export default {
  parserPlain,
  rules: {
    prettier,
  },
}
