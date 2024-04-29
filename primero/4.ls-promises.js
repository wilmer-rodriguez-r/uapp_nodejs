const fs = require('node:fs/promises')
const path = require('node:path')

const dir = process.argv[2] ?? '.'

async function searchFileAsyncPromise (dir) {
  let files
  try {
    files = await fs.readdir(dir)
  } catch {
    console.log('No se encontro el archivo/carpeta')
  }

  const filesPromises = files.map(async file => {
    return file
  })

  const filesInfo = await Promise.all(filesPromises)
  console.log(filesInfo)
}

// searchFileAsyncPromise(dir);

// asincrono - no funciono :/
async function filesAync (actualPath) {
  const isFile = (await fs.stat(actualPath)).isFile()
  if (isFile) {
    const fileName = path.basename(actualPath)
    return { fileName }
  }

  const files = await fs.readdir(actualPath)

  const filesPromises = files.map(async file => {
    const newActualPath = path.join(actualPath, file)
    const dirName = path.dirname(newActualPath)
    const deepSearch = await filesAync(newActualPath)
    return { folder: dirName, files: deepSearch }
  })

  const filesInfo = await Promise.all(filesPromises)
  return filesInfo
}

filesAync('.').then(values => {
  console.log(values)
})
