const fs = require('node:fs')
const path = require('node:path')
const pc = require('picocolors')

const actualPath = process.argv[2] ?? '.'
recursivity(actualPath, 0)
// sincronico
function recursivity (actualPath, deep) {
  // console.log(fs.statSync(actualPath).isFile())
  const isFile = fs.statSync(actualPath).isFile()
  const pad = 2 * deep
  if (isFile) {
    const fileName = path.basename(actualPath)
    const statsFile = fs.statSync(actualPath)
    const fileSize = statsFile.size.toString()
    console.log(`📄 ${fileName}`.padStart(fileName.length + pad).padEnd(30) + `${fileSize.padStart(fileSize.length + 10)}`)
  } else {
    const dirName = path.basename(actualPath)
    const files = fs.readdirSync(actualPath)
    console.log(pc.green(`📂 ${dirName}`).padStart(dirName.length + pad))
    files.forEach(element => {
      const newActualPath = path.join(actualPath, element)
      recursivity(newActualPath, deep + 1)
    })
  }
}
