import type { FormatOptions as OxfmtOptions } from 'oxfmt'
import type { Options as PrettierOptions } from 'prettier'

export interface RuleOptions {
  'format/prettier': [PrettierOptions]
  'format/dprint': [DprintOptions]
  'format/oxfmt': [OxfmtOptions]
}

export { OxfmtOptions, PrettierOptions }

export type DprintOptions
  = | { language: string, languageOptions?: Record<string, unknown>, [x: string]: unknown }
    | { plugins: Array<{ plugin: string, options?: Record<string, unknown> }>, [x: string]: unknown }
