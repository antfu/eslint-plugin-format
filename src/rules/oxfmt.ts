import type { Rule } from 'eslint'
import type { FormatOptions, format as oxformat } from 'oxfmt'
import { join } from 'node:path'
import { messages, reportDifferences } from 'eslint-formatting-reporter'
import { createSyncFn } from 'synckit'
import { dirWorkers } from '../dir'

let format: (filename: string, code: string, options: FormatOptions) => Awaited<ReturnType<typeof oxformat>>

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'Use oxfmt to format code',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        additionalProperties: true,
      },
    ],
    messages,
  },
  create(context) {
    if (!format)
      format = createSyncFn(join(dirWorkers, 'oxfmt.cjs')) as any

    return {
      [context.sourceCode.ast.type || 'Program']() {
        const sourceCode = context.sourceCode.text

        try {
          const { code: formatted, errors } = format(
            context.filename,
            sourceCode,
            context.options[0] || {},
          )

          if (errors.length) {
            const error = errors[0]

            if (error.message.startsWith('Unsupported file type:')) {
              return
            }
            else {
              throw new Error(error.message)
            }
          }

          reportDifferences(context, sourceCode, formatted)
        }
        catch (error) {
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
