import type { TestCasesOptions } from 'eslint-vitest-rule-tester'
import { run } from 'eslint-vitest-rule-tester'
import { describe, expect } from 'vitest'
import plugin from '../src/index'

describe('prettier rule - JavaScript formatting', () => {
  // Already formatted code
  const valids = [
    {
      code: 'const x = 1\n',
      options: [{ parser: 'babel', semi: false }],
    },
    {
      code: 'const obj = { a: 1, b: 2 }\n',
      options: [{ parser: 'babel', semi: false }],
    },
  ] satisfies TestCasesOptions['valid']

  // Code that needs formatting
  const invalids = [
    {
      code: 'const x=1;',
      options: [{ parser: 'babel', semi: false }],
      errors: [{ messageId: 'replace' }],
    },
    {
      code: 'const obj={a:1,b:2}',
      options: [{ parser: 'babel', semi: false }],
      errors: [{ messageId: 'replace' }],
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/prettier (javascript)',
    rule: plugin.rules.prettier,
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
    valid: valids,
    invalid: invalids,
    onResult(_case, result) {
      if (_case.type === 'invalid')
        expect(result.output).toMatchSnapshot()
    },
  })
})

describe('prettier rule - CSS formatting', () => {
  // Already formatted CSS
  const valids = [
    {
      code: '.foo {\n  color: red;\n}\n',
      options: [{ parser: 'css' }],
    },
  ] satisfies TestCasesOptions['valid']

  // Unformatted CSS
  const invalids = [
    {
      code: '.foo{color:red;}',
      options: [{ parser: 'css' }],
      errors: [{ messageId: 'replace' }],
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/prettier (css)',
    rule: plugin.rules.prettier,
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

describe('prettier rule - JSON formatting', () => {
  // Already formatted JSON with bracket spacing
  const valids = [
    {
      code: '{ "a": 1, "b": 2 }\n',
      options: [{ parser: 'json', bracketSpacing: true }],
    },
  ] satisfies TestCasesOptions['valid']

  // Unformatted JSON
  const invalids = [
    {
      code: '{"a":1,"b":2}',
      options: [{ parser: 'json', bracketSpacing: true }],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/prettier (json)',
    rule: plugin.rules.prettier,
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

describe('prettier rule - custom options', () => {
  // Formatted with semicolons
  const valids = [
    {
      code: 'const x = 1;\n',
      options: [{ parser: 'babel', semi: true }],
    },
  ] satisfies TestCasesOptions['valid']

  // Missing semicolon - should add it
  const invalids = [
    {
      code: 'const x = 1',
      options: [{ parser: 'babel', semi: true }],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/prettier (custom options)',
    rule: plugin.rules.prettier,
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
    valid: valids,
    invalid: invalids,
    onResult(_case, result) {
      if (_case.type === 'invalid')
        expect(result.output).toMatchSnapshot()
    },
  })
})

describe('prettier rule - syntax errors', () => {
  // Invalid JSON should report parsing error
  const invalids = [
    {
      code: '{"invalid": json}',
      options: [{ parser: 'json' }],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/prettier (syntax error)',
    rule: plugin.rules.prettier,
    languageOptions: {
      parser: plugin.parserPlain,
    },
    valid: [],
    invalid: invalids,
  })
})
