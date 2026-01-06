import type { Options as PrettierOptions } from 'prettier'

export interface RuleOptions {
  'format/prettier': [PrettierOptions]
  'format/dprint': [DprintOptions]
}

export { PrettierOptions }

export type DprintOptions
  = | { language: string, languageOptions?: Record<string, unknown>, [x: string]: unknown }
    | { plugins: Array<{ plugin: string, options?: Record<string, unknown> }>, [x: string]: unknown }
