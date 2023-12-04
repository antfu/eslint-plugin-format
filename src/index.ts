import * as parserPlain from 'eslint-parser-plain'
import prettier from './rules/prettier'
import dprint from './rules/dprint'

export default {
  parserPlain,
  rules: {
    prettier,
    dprint,
  },
}
