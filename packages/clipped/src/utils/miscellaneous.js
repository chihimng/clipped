import path from 'path'
import {isFunction} from 'lodash'
import {promisify} from 'util'
import dargs from 'dargs'

export const toArgs = dargs

export const cwd: string = process.cwd()

// /**
//  * promiseSerial - Resolve promises sequentially
//  *
//  * @param {Function} funcs
//  * @param {Function} callback
//  * @param {any} initial
//  * @returns
//  */
// export function promiseSerial (
//   funcs: Function[],
//   callback: Function = (result, curr) => curr(result),
//   initial: any = () => null
// ) {
//   // console.log(funcs.toString(), callback.toString())
//   return funcs.reduce(
//     async (acc: any = () => {}, current = () => {}, index) => {
//       let result = null
//       if (isFunction(acc)) result = await acc()
//       return callback(result, current, index)
//     },
//     isFunction(initial) ? initial : () => initial
//   )
// }

/**
 * exec - run shell command as promise
 *
 * @param {string} command
 * @param {any[]} opts
 * @param {Function} callback
 * @returns
 */
export const exec = promisify(
  (command: string, opts, callback) =>
    require('child_process').exec(command, opts, callback)
)

// /**
//  * insertIf - Return element if condition satisfied
//  *
//  * @param {boolean}  condition
//  * @param {any[]} elements
//  *
//  * @returns {any[]} Description
//  */
// export function insertIf (condition: boolean, ...elements: any) {
//   return condition ? elements : []
// }
