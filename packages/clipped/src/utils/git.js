const path = require('path')
import yarnInstall from 'yarn-install'
const git = require('simple-git/promise')
const gitUrlParse = require('git-url-parse')
const {cwd, exec} = require('../utils')
const {resolvePath} = require('../instance/helper')

/**
 * getGitUsername - get username from git config
 *
 * @async
 * @export
 * @returns {Promise<string>} username
 */
export async function getGitUsername (): Promise<string> {
  return exec('git config --global user.name')
}

// /**
//  * getRepoOwner - get owner from git repo url
//  *
//  * @export
//  * @param {string} url
//  *
//  * @returns {Promise<string>} org
//  */
// export function getRepoOwner (url: string = cwd): Promise<string> {
//   return gitUrlParse(url).owner
// }

/**
 * cloneRepo - clone repo into dest path
 *
 * @export
 * @param {string} repo
 * @param {string} dest
 * @param {Object} opt
 *
 */
export async function cloneRepo (repo: string, dest: string = __dirname, opt: Object = {}): Promise<void> {
  try {
    await git().clone(repo, dest)
  } catch (e) {
    await git(dest).pull()
  }
  await yarnInstall({cwd: dest})
  await cloneSubmodules(dest)
}

// /**
//  * fetchRepo - fetch repo at origin
//  *
//  * @export
//  * @param {string} path
//  * @returns {Promise<void>}
//  */
// export async function fetchRepo (path: string, remote: string ='origin'): Promise<void> {
//   await git(path).fetch()
//   await yarnInstall({cwd: path})
//   await cloneSubmodules(path)
// }

/**
 * cloneSubmodules - clone all submodules of current folder
 *
 * @export
 * @param {string} repoPath
 * @returns {Promise<void>}
 */
export async function cloneSubmodules (repoPath: string, opt: Object = {}): Promise<void> {
  await exec(`cd ${repoPath} && git submodule update --init --recursive`)
  await exec(`cd ${repoPath} && git submodule foreach --recursive npm i`)
}
