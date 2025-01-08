import type { ESLint, Linter } from 'eslint'
import * as parserPlain from 'eslint-parser-plain'
import dprint from './rules/dprint'
import prettier from './rules/prettier'

export interface ESLintPluginFormat extends ESLint.Plugin {
  parserPlain: Linter.Parser
}

export default {
  parserPlain,
  rules: {
    prettier,
    dprint,
  },
} satisfies ESLintPluginFormat
