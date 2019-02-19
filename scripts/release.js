const argv = require("minimist")(process.argv.slice(2))

const { exec: _exec } = require("child_process")
const fs = require("fs-extra")
const path = require("path")
const inquirer = require("inquirer")
const ora = require("ora")
const R = require("ramda")

const BUILD_DIR = "build/"
const PACKAGES_DIR = "build/packages"

async function release() {
  const { confirmGit } = await inquirer.prompt({
    type: "confirm",
    name: "confirmGit",
    message: "Do you want to proceed?",
    default: false
  })
  if (!confirmGit) return

  await npmPublish();
}

async function npmPublish() {
  const results = await Promise.all(
    getPackages().map(async packagePath => {
      const name = packagePath.split("/").reverse()[0]

      try {
        await npmPublishPackage(packagePath);
      } catch (e) {
        console.log(e)
        return false
      }

      console.log(`Published ${name}`);
    })
  )

  if (results.some(R.equals(false))) process.exit(1)
}

async function npmPublishPackage(packagePath) {
  const cmd = `npm publish --access public --tag next`
  await exec(cmd, { cwd: packagePath })

  return true
}

function getPackages() {
  return fs
    .readdirSync(PACKAGES_DIR)
    .map(directory => path.join(PACKAGES_DIR, directory))
    .filter(directory => fs.lstatSync(directory).isDirectory())
}

function exec(cmd, options) {
  return new Promise(function(resolve, reject) {
    _exec(cmd, options, function(error, stdout, stderr) {
      stdout = stdout.trim()
      stderr = stderr.trim()

      if (error === null) {
        resolve({ stdout, stderr })
      } else {
        reject({ error, stdout, stderr })
      }
    })
  })
}

function main() {
  return release()
}

if (require.main === module) {
  main().catch(error => console.error(error))
}
