import type { Rule } from 'eslint'
import type { DprintOptions } from '../../dts/rule-options'
import { join } from 'node:path'
import { messages, reportDifferences } from 'eslint-formatting-reporter'
import { createSyncFn } from 'synckit'
import { dirWorkers } from '../dir'

let format: (code: string, filename: string, options: DprintOptions) => string

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'Use dprint to format code',
      category: 'Stylistic',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          language: {
            type: 'string',
          },
          languageOptions: {
            type: 'object',
          },
          plugins: {
            type: 'array',
          },
        },
        additionalProperties: true,
      },
    ],
    messages,
  },
  create(context) {
    if (!format)
      format = createSyncFn(join(dirWorkers, 'dprint.cjs')) as any

    return {
      [context.sourceCode.ast.type || 'Program']() {
        const sourceCode = context.sourceCode.text
        try {
          const formatted = format(sourceCode, context.filename, context.options[0] || {})

          reportDifferences(context, sourceCode, formatted)
        }
        catch (error) {
          console.error(error)
          context.report({
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 0 },
            },
            message: `Failed to format the code: ${error}`,
          })
        }
      },
    }
  },
} satisfies Rule.RuleModule
