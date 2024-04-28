const fs = require('node:fs/promises')

const folder = process.argv[2] ?? '.'

fs.readdir(folder).then(files => {
  files.forEach(file => {
    console.log(file)
  })
}).catch(err => {
  console.log('ha ocurrido un error', err)
})
