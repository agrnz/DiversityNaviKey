const path = require('path')
const fs = require('fs')

const pluginName = 'dumpVueEnvWebpackPlugin'

/**
 * solution from stackoverflow (Hwo can I customize my service worker)
 * ... This lets us
 * dump the env vars as configured for the rest of the app and import them into
 * the service-worker script to use them.
 *
 * We need to do this as the service-worker script is NOT processed by webpack
 * so we can't put any placeholders in it directly.
 */

module.exports = class DumpVueEnvWebpackPlugin {
  constructor(opts) {
    this.filename = opts.filename || 'env-vars-dump.js'
  }

  apply(compiler) {
    const fileContent = Object.keys(process.env)
      .filter(k => k.startsWith('VUE_APP_'))
      .reduce((accum, currKey) => {
        const val = process.env[currKey]
        accum += `const ${currKey} = '${val}'\n`
        return accum
      }, '')
    const outputDir = compiler.options.output.path
    if (!fs.existsSync(outputDir)) {
      // TODO ideally we'd let Webpack create it for us, but not sure how to
      // make this run later in the lifecycle
      fs.mkdirSync(outputDir)
    }
    const fullOutputPath = path.join(outputDir, this.filename)
    console.log(
      `[dumpVueEnvWebpackPlugin] dumping env vars to file=${fullOutputPath}`,
    )
    fs.writeFileSync(fullOutputPath, fileContent)
  }
}