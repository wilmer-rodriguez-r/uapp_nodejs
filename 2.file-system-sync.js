const fs = require('node:fs') // se recomienda el prefijo node: desde la version 16


// De forma sincrona

const contText = fs.readFileSync('./hola.txt', 'utf-8')

console.log(contText)

const contText2 = fs.readFileSync('./como-estas.txt', 'utf-8')
console.log(contText2)
