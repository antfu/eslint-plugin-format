import { join } from 'node:path'
import type { Rule } from 'eslint'
import { createSyncFn } from 'synckit'
import type { Options } from 'prettier'
import { messages, reportDifferences } from 'eslint-formatting-reporter'
import { dirWorkers } from '../dir'

let format: (code: string, options: Options) => string

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'Use Prettier to format code',
      category: 'Stylistic',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          parser: {
            type: 'string',
            required: true,
          },
        },
        additionalProperties: true,
      },
    ],
    messages,
  },
  create(context) {
    if (!format)
      format = createSyncFn(join(dirWorkers, 'prettier.cjs')) as any

    return {
      Program() {
        const sourceCode = context.sourceCode.text
        try {
          const formatted = format(sourceCode, {
            filepath: context.filename,
            ...(context.options[0] || {}),
          })

          reportDifferences(context, sourceCode, formatted)
        }
        catch (error) {}
      },
    }
  },
} satisfies Rule.RuleModule
