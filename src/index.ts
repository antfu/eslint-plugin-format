import type { Linter } from 'eslint'
import * as _parserPlain from 'eslint-parser-plain'
import dprint from './rules/dprint'
import prettier from './rules/prettier'

const parserPlain: Linter.Parser = {
  meta: {
    name: 'eslint-parser-plain',
  },
  ..._parserPlain as { parseForESLint: any },
}

export default {
  parserPlain,
  rules: {
    prettier,
    dprint,
  },
}
