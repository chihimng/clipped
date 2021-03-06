import path from 'path'
import {isString, isFunction, castArray} from 'lodash'
import yeoman from 'yeoman-environment'
import {promisify} from 'util'
import memFs from 'mem-fs'
import fsEditor from 'mem-fs-editor'
import {createChainable} from 'jointed'
const baseGenerator = require('generator-clipped-base')

const stockPresets = {}

// NOTE: Need to be synchronous
/**
 * basePreset - Initializes default value
 * 
 * @param {Object} clipped 
 * @param {Object={}} opt 
 */
export function basePreset (clipped: Object, opt: Object = {}) {
  // Initialize config
  clipped.opt = opt
  clipped.config = createChainable({
    context: clipped.opt.context || process.cwd()
  })

  let packageJson = {}
  try {
    packageJson = __non_webpack_require__(clipped.resolve('package.json'))
  } catch (e) {}

  Object.assign(clipped.config, ({
    name: packageJson.name,
    src: clipped.resolve('src'),
    dist: clipped.resolve('dist'),
    dockerTemplate: clipped.resolve('docker-template'),
    packageJson,
    generator: clipped.opt.generator || baseGenerator,
    eslintPath: clipped.resolve('.eslintrc.js')
  }: clippedConfig))

  Object.assign(clipped, clipped.fs)

  clipped._hooks = []

  clipped.hook('version')
    .add('clipped', async clipped => {
      const version = await clipped.exec('npm view clipped version')
      clipped.print(version)
    })

  clipped.hook('init')
    .add('yeoman', async clipped => {
      const env = yeoman.createEnv()
      env.registerStub(baseGenerator, 'clipped:app')

      env.lookup()

      await new Promise((resolve, reject) => {
        env.run('clipped:app', resolve)
      })
    })

  clipped.__initialized__ = true
}

/**
 * normalizePreset - Normalize normalize to same format
 *
 * @param {any} ware
 *
 * @returns {Function}
 */
function normalizePreset (ware: any) {
  const preset = ware.default || ware
  if (isString(preset)) { // String i.e. stock
    return stockPresets[preset]
  } else if (isFunction(preset)) { // Function
    return preset
  } else {
    return clipped => { clipped.config = {...clipped.config, ...preset} }
  }
}

export async function execPreset (ware: any = () => {}, ...args: any) {
  await normalizePreset(ware)(this, ...args)
  return this
}

export function initPreset (Clipped: Object) {
  Clipped.prototype.use = execPreset
  return Clipped
}
