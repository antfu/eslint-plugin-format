const { runAsWorker } = require('synckit')

let oxfmt

runAsWorker(async (filename, code, options) => {
  if (!oxfmt)
    oxfmt = await import('oxfmt')
  return oxfmt.format(filename, code, options)
})
