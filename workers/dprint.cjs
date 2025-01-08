// @ts-check
const { Buffer } = require('node:buffer')
const fs = require('node:fs/promises')
const { runAsWorker } = require('synckit')

let dprint
const cache = new Map()

async function loadBuffer(data) {
  if (typeof data === 'string' && data.startsWith('@dprint/'))
    data = await import(data).then(m => m.getBuffer?.() || m.getPath?.())

  if (typeof data === 'string') {
    if (data.startsWith('data:')) {
      const [, base64] = data.split(',')
      return Buffer.from(base64, 'base64')
    }
    else if (data.match(/^[\w-]+:\/\//)) {
      return fetch(data).then(r => r.arrayBuffer?.())
    }
    else {
      return fs.readFile(data)
    }
  }

  return data
}

runAsWorker(async (code, filename, options) => {
  if (!dprint)
    dprint = await import('@dprint/formatter')

  const builtInLangs = {
    json: '@dprint/json',
    toml: '@dprint/toml',
    markdown: '@dprint/markdown',
    typescript: '@dprint/typescript',
    dockerfile: '@dprint/dockerfile',
  }

  const lang = builtInLangs[options.language] || options.language
  const promise = cache.has(lang)
    ? cache.get(lang)
    : cache.set(lang, loadBuffer(lang).then(r => dprint.createFromBuffer(r))).get(lang)

  const formatter = await promise
  const { lang: _, languageOptions = {}, ...rest } = options
  formatter.setConfig(rest, languageOptions)
  return formatter.formatText(filename, code)
})
