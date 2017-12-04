import path from 'path'
const {promisify} = require('util')

export const cwd: string = process.cwd()

/**
 * resolvePath - Resolve paths
 *
 * @param {string}  [dir=''] Target
 * @param {string} [parent='../'] Parent path
 *
 * @returns {string} Resolved path
 */
export function resolvePath (dir: string = '', parent: string = path.join(__dirname, '../')): string {
  return path.join(parent, dir)
}

/**
 * promiseSerial - Resolve promises sequentially
 * 
 * @param {Function} funcs 
 * @returns 
 */
export function promiseSerial (funcs: Function) {
  return funcs.reduce((promise, func) =>
    promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([]))
}

export const exec = promisify(function(command, opts, callback) {
  return require("child_process").exec(command, opts, callback);
})
