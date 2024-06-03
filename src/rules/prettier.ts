import { join } from 'node:path'
import type { AST, Rule } from 'eslint'
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
        catch (err) {
          if (!(err instanceof SyntaxError)) {
            context.report({
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 0 },
              },
              message: 'Failed to format the code',
            })
            return
          }

          let message = `Parsing error: ${err.message}`

          const error = (err) as SyntaxError & { codeFrame: string, loc: AST.SourceLocation }

          if (error.codeFrame)
            message = message.replace(`\n${error.codeFrame}`, '')

          if (error.loc)
            message = message.replace(/ \(\d+:\d+\)$/, '')

          context.report({ message, loc: error.loc })
        }
      },
    }
  },
} satisfies Rule.RuleModule
