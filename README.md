# eslint-plugin-format

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Format various languages with formatters in ESLint. Supports [Prettier](https://prettier.io/), [dprint](https://dprint.dev/) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter). Side-effects-free and fully configurable.

## Usages

### Install

```bash
npm i -D eslint-plugin-format
```

### Configure

This plugin does not do language detection or reading configure files, you need to specify the language for each file type you want to format along with other formatting options. We recommend using [ESLint's Flat Config format](https://eslint.org/docs/latest/use/configure/configuration-files-new).

```ts
// eslint.config.js
import format from 'eslint-plugin-format'

export default [
  // ...other flat configs

  // use Prettier to format CSS
  {
    files: ['**/*.css'],
    languageOptions: {
      parser: format.parserPlain,
    },
    plugins: {
      format,
    },
    rules: {
      'format/prettier': ['error', { parser: 'css', tabWidth: 2 }],
    },
  },

  // use dprint to format TOML
  {
    files: ['**/*.toml'],
    languageOptions: {
      parser: format.parserPlain,
    },
    plugins: {
      format,
    },
    rules: {
      'format/dprint': ['error', { language: 'toml', languageOptions: { indentWidth: 2 } }],
    },
  },

  // use oxfmt to format JavaScript/TypeScript with TailwindCSS classnames sorting
  {
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    languageOptions: {
      parser: format.parserPlain,
    },
    plugins: {
      format,
    },
    rules: {
      'format/oxfmt': ['error', { sortTailwindcss: {} }],
    },
  },

  // use dprint to format HTML and CSS in style tags
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: format.parserPlain,
    },
    plugins: {
      format,
    },
    rules: {
      'format/dprint': ['error', {
        plugins: [
          {
            plugin: 'node_modules/dprint-plugin-malva/plugin.wasm',
            options: {},
          },
          {
            plugin: 'node_modules/dprint-plugin-markup/plugin.wasm',
            options: {
              scriptIndent: true,
              styleIndent: true,
            },
          },
        ],
        useTabs: false,
        indentWidth: 2,
      }],
    },
  },
]
```

## Rules

### `format/prettier`

Use Prettier to format files.

#### Options

- `parser` (required) - the language to format, [Supported languages](https://prettier.io/docs/en/options.html#parser)
- The rest options are passed as Prettier options

### `format/dprint`

Use dprint to format files.

#### Options

Either:
- `language` (required) - the language to format, or can be a filepath or URL to the WASM binary. [Supported languages](https://dprint.dev/plugins/)
- `languageOptions` - the options for the language
- The rest options are passed as dprint's general options

Or:
- `plugins` (required) - Array of plugins, defined as an object containing `plugin` (same as `language` above) and `options`, which is the same as `languageOptions` above.
- The rest of the options are passed as dprint's general options

### `format/oxfmt`

Use oxfmt to format files.

#### Options

- File type is inferred from the linted filename extension.
- The options are passed directly to oxfmt's [`format()` API](https://oxc.rs/docs/guide/usage/formatter).

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## FAQ

### What's the difference between this and `eslint-plugin-prettier`?

While this plugin provides Prettier as one of the formatters, the main difference is that `eslint-plugin-prettier` is much more opinionated toward the Prettier CLI ecosystem. While this plugin only treats Prettier as the side-effects-free formatter and gives you full control in ESLint.

## Credits

Thanks to the existing works for references and inspiration.

- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)
- [eslint-plugin-dprint-integration](https://github.com/so1ve/eslint-plugin-dprint-integration)

## License

[MIT](./LICENSE) License © 2023-PRESENT [Anthony Fu](https://github.com/antfu)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/eslint-plugin-format?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/eslint-plugin-format
[npm-downloads-src]: https://img.shields.io/npm/dm/eslint-plugin-format?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/eslint-plugin-format
[bundle-src]: https://img.shields.io/bundlephobia/minzip/eslint-plugin-format?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=eslint-plugin-format
[license-src]: https://img.shields.io/github/license/antfu/eslint-plugin-format.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/antfu/eslint-plugin-format/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/eslint-plugin-format
