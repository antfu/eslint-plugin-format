import * as _parserPlain from 'eslint-parser-plain'
import type { Linter } from 'eslint'
import prettier from './rules/prettier'
import dprint from './rules/dprint'

const parserPlain: Linter.ParserModule = {
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
