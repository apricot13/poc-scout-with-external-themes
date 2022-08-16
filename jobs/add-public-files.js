/**
 *
 * this file populates the public folder with all the relevant theme files
 *
 */

require("dotenv").config()
const fs = require("fs")
const fsPromises = fs.promises
const path = require("path")

const themeLabel = "generic"

const sourceDirectory = `./node_modules/@futuregov/poc-scout-with-external-themes--test-theme/${themeLabel}/public`

async function copyDir(src, dest) {
  await fsPromises.mkdir(dest, { recursive: true })
  let entries = await fsPromises.readdir(src, { withFileTypes: true })

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name)
    let destPath = path.join(dest, entry.name)

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await fsPromises.copyFile(srcPath, destPath)
  }
}

// @TODO should probably replace the titles etc in these files with content form the theme files like the env vars are already
;(async () => {
  try {
    await fsPromises.stat(sourceDirectory)
    console.log(
      `${sourceDirectory} directory exists, attempting to copy correct files...`
    )
    try {
      await copyDir(sourceDirectory, "./public")
      console.log(`Copied correct files...`)
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
  }
})()
