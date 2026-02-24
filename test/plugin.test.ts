import { describe, expect, it } from 'vitest'
import plugin from '../src/index'

describe('plugin exports', () => {
  it('should export rules object', () => {
    expect(plugin.rules).toBeDefined()
    expect(plugin.rules.prettier).toBeDefined()
    expect(plugin.rules.dprint).toBeDefined()
    expect(plugin.rules.oxfmt).toBeDefined()
  })

  it('should export parserPlain', () => {
    expect(plugin.parserPlain).toBeDefined()
  })
})

describe('prettier rule meta', () => {
  it('should have correct meta', () => {
    const rule = plugin.rules.prettier
    expect(rule.meta).toBeDefined()
    expect(rule.meta?.type).toBe('layout')
    expect(rule.meta?.fixable).toBe('whitespace')
    expect(rule.meta?.schema).toBeDefined()
  })
})

describe('dprint rule meta', () => {
  it('should have correct meta', () => {
    const rule = plugin.rules.dprint
    expect(rule.meta).toBeDefined()
    expect(rule.meta?.type).toBe('layout')
    expect(rule.meta?.fixable).toBe('whitespace')
    expect(rule.meta?.schema).toBeDefined()
  })
})

describe('oxfmt rule meta', () => {
  it('should have correct meta', () => {
    const rule = plugin.rules.oxfmt
    expect(rule.meta).toBeDefined()
    expect(rule.meta?.type).toBe('layout')
    expect(rule.meta?.fixable).toBe('whitespace')
    expect(rule.meta?.schema).toBeDefined()
  })
})
