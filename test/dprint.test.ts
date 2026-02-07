import type { TestCasesOptions } from 'eslint-vitest-rule-tester'
import { run } from 'eslint-vitest-rule-tester'
import { describe, expect } from 'vitest'
import plugin from '../src/index'

describe('dprint rule - TOML with language option', () => {
  // Already formatted TOML
  const valids = [
    {
      code: '[section]\nkey = "value"\n',
      options: [{ language: 'toml' }],
    },
  ] satisfies TestCasesOptions['valid']

  // TOML without spacing around equals
  const invalids = [
    {
      code: '[section]\nkey="value"',
      options: [{ language: 'toml' }],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/dprint (toml with options)',
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

describe('dprint rule - markdown formatting', () => {
  // Already formatted markdown
  const valids = [
    {
      code: '#Title\n',
      options: [{ language: 'markdown' }],
    },
  ] satisfies TestCasesOptions['valid']

  // Markdown with trailing spaces
  const invalids = [
    {
      code: '#Title  ',
      options: [{ language: 'markdown' }],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/dprint (markdown)',
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

describe('dprint rule - TOML formatting', () => {
  // Already formatted TOML
  const valids = [
    {
      code: '[foo]\na = 1\n',
      options: [{ language: 'toml' }],
    },
  ] satisfies TestCasesOptions['valid']

  // TOML without spacing
  const invalids = [
    {
      code: '[foo]\na=1',
      options: [{ language: 'toml' }],
      errors: [{ messageId: 'replace' }],
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/dprint (toml)',
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

describe('dprint rule - language options', () => {
  // Already formatted TOML
  const valids = [
    {
      code: '[foo]\na = 1\n',
      options: [{ language: 'toml' }],
    },
  ] satisfies TestCasesOptions['valid']

  // TOML without spacing - should respect toml language option
  const invalids = [
    {
      code: '[foo]\na=1',
      options: [{ language: 'toml' }],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/dprint (language options)',
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

describe('dprint rule - error handling', () => {
  // Invalid language should report formatting error
  const invalids = [
    {
      code: 'invalid code',
      options: [{ language: 'invalid-language' }],
      errors: 1,
    },
  ] satisfies TestCasesOptions['invalid']

  run({
    name: 'format/dprint (error handling)',
    rule: plugin.rules.dprint,
    languageOptions: {
      parser: plugin.parserPlain,
    },
    valid: [],
    invalid: invalids,
  })
})
