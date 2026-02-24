import type { Rule } from 'eslint'
import type { FormatOptions } from 'oxfmt'
import { join } from 'node:path'
import { messages, reportDifferences } from 'eslint-formatting-reporter'
import { createSyncFn } from 'synckit'
import { dirWorkers } from '../dir'

interface OxfmtErrorLabel {
  message: string | null
  start: number
  end: number
}

interface OxfmtError {
  message: string
  labels: OxfmtErrorLabel[]
}

interface OxfmtFormatResult {
  code: string
  errors: OxfmtError[]
}

let format: (filename: string, code: string, options: FormatOptions) => OxfmtFormatResult

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
            const label = error.labels?.[0]

            if (label) {
              const startIndex = Math.max(0, Math.min(label.start, sourceCode.length))
              const endIndex = Math.max(startIndex, Math.min(label.end, sourceCode.length))
              context.report({
                loc: {
                  start: context.sourceCode.getLocFromIndex(startIndex),
                  end: context.sourceCode.getLocFromIndex(endIndex),
                },
                message: `Failed to format the code: ${error.message}`,
              })
              return
            }

            context.report({
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 0 },
              },
              message: `Failed to format the code: ${error.message}`,
            })
            return
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
