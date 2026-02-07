import type { TestCasesOptions } from 'eslint-vitest-rule-tester'
import { run } from 'eslint-vitest-rule-tester'
import { describe, expect } from 'vitest'
import plugin from '../src/index'

describe('integration tests - prettier complex CSS', () => {
  // Complex CSS with multiple properties
  const valids = [
    {
      code: '.btn {\n  padding: 10px;\n  margin: 5px;\n}\n',
      options: [{ parser: 'css', tabWidth: 2 }],
    },
  ] satisfies TestCasesOptions['valid']

  // Unformatted complex CSS
  const invalids = [
    {
      code: '.btn{padding:10px;margin:5px;}',
      options: [{ parser: 'css', tabWidth: 2 }],
      errors: [{ messageId: 'replace' }],
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/prettier (complex css)',
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

describe('integration tests - dprint complex TOML', () => {
  // Complex TOML formatted correctly
  const valids = [
    {
      code: '[section]\nkey = "value"\n',
      options: [{ language: 'toml' }],
    },
  ] satisfies TestCasesOptions['valid']

  // TOML with spacing issues and trailing whitespace
  const invalids = [
    {
      code: '[section]\nkey="value"  ',
      options: [{ language: 'toml' }],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/dprint (complex toml)',
    rule: plugin.rules.dprint,
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

describe('integration tests - already formatted', () => {
  // Properly formatted code should pass validation
  const valids = [
    {
      code: 'const x = 1;\n',
      options: [{ parser: 'babel', semi: true }],
    },
  ] satisfies TestCasesOptions['valid']

  run({
    name: 'format/prettier (already formatted)',
    rule: plugin.rules.prettier,
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
    valid: valids,
    invalid: [],
  })
})

describe('integration tests - prettier tabWidth', () => {
  // CSS formatted with 4-space tabs
  const valids = [
    {
      code: '.foo {\n    padding: 10px;\n}\n',
      options: [{ parser: 'css', tabWidth: 4 }],
    },
  ] satisfies TestCasesOptions['valid']

  // Unformatted CSS - should use 4-space indentation
  const invalids = [
    {
      code: '.foo{padding:10px;}',
      options: [{ parser: 'css', tabWidth: 4 }],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/prettier (tab width)',
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

describe('integration tests - dprint markdown custom', () => {
  // Markdown with proper newline
  const valids = [
    {
      code: '#Header\n',
      options: [{ language: 'markdown' }],
    },
  ] satisfies TestCasesOptions['valid']

  // Markdown missing final newline
  const invalids = [
    {
      code: '#Header',
      options: [{ language: 'markdown' }],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/dprint (markdown custom)',
    rule: plugin.rules.dprint,
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

describe('integration tests - trailing whitespace', () => {
  // Properly formatted without trailing whitespace
  const valids = [
    {
      code: 'const x = 1;\n',
      options: [{ parser: 'babel' }],
    },
  ] satisfies TestCasesOptions['valid']

  // Code with trailing whitespace - should be removed
  const invalids = [
    {
      code: 'const x = 1;  \n',
      options: [{ parser: 'babel' }],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/prettier (trailing whitespace)',
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
