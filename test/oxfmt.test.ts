import type { TestCasesOptions } from 'eslint-vitest-rule-tester'
import { run } from 'eslint-vitest-rule-tester'
import { describe, expect } from 'vitest'
import plugin from '../src/index'

describe('oxfmt rule - JavaScript formatting', () => {
  // Already formatted JavaScript
  const valids = [
    {
      code: 'const value = { foo: 1, bar: 2 };\n',
      filename: 'test.js',
      options: [{}],
    },
  ] satisfies TestCasesOptions['valid']

  // JavaScript that needs formatting
  const invalids = [
    {
      code: 'const value={foo:1,bar:2}',
      filename: 'test.js',
      options: [{}],
      errors: [{ messageId: 'replace' }],
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/oxfmt (javascript)',
    rule: plugin.rules.oxfmt,
    languageOptions: {
      parser: plugin.parserPlain,
    },
    valid: valids,
    invalid: invalids,
    onResult(_case, result) {
      if (_case.type === 'invalid')
        expect(result.output).toMatchSnapshot()
    },
  })
})

describe('oxfmt rule - TypeScript formatting', () => {
  // Already formatted TypeScript with single quotes
  const valids = [
    {
      code: 'const user = { name: \'foo\' };\n',
      filename: 'test.ts',
      options: [{ singleQuote: true }],
    },
  ] satisfies TestCasesOptions['valid']

  // TypeScript that should be formatted with single quotes
  const invalids = [
    {
      code: 'const user={name:"foo"}',
      filename: 'test.ts',
      options: [{ singleQuote: true }],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/oxfmt (typescript)',
    rule: plugin.rules.oxfmt,
    languageOptions: {
      parser: plugin.parserPlain,
    },
    valid: valids,
    invalid: invalids,
    onResult(_case, result) {
      if (_case.type === 'invalid')
        expect(result.output).toMatchSnapshot()
    },
  })
})

describe('oxfmt rule - unsupported file type', () => {
  // Unsupported file extensions should report formatter errors
  const invalids = [
    {
      code: 'hello world',
      filename: 'test.txt',
      options: [{}],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/oxfmt (unsupported file type)',
    rule: plugin.rules.oxfmt,
    languageOptions: {
      parser: plugin.parserPlain,
    },
    valid: [],
    invalid: invalids,
  })
})

describe('oxfmt rule - parse errors', () => {
  // Syntax errors should be surfaced as formatter errors
  const invalids = [
    {
      code: 'const user =',
      filename: 'test.js',
      options: [{}],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/oxfmt (parse error)',
    rule: plugin.rules.oxfmt,
    languageOptions: {
      parser: plugin.parserPlain,
    },
    valid: [],
    invalid: invalids,
  })
})
