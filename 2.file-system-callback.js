const fs = require('node:fs')
const fsPromises = require('node:fs/promises')

// de forma asincrona y con callbacks
console.log("lectura primer archivo")
fs.readFile('hola.txt', 'utf-8', (error, text) => console.log('resultado primer archivo: ',text))
console.log("entre lecturas de archivos")
console.log("lectura segundo archivo")
fs.readFile('como-estas.txt', 'utf-8', (error, text) => console.log('resultado segundo archivo: ',text))

console.log('---------------------------------------------------------------------------------')

// de forma asincrona pero con promesas
console.log("lectura primer archivo")
fsPromises.readFile('hola.txt', 'utf-8').then(text => console.log(text))
console.log("entre lecturas de archivos")
console.log("lectura segundo archivo")
fsPromises.readFile('como-estas.txt', 'utf-8').then(text => console.log(text))

console.log('--------------------------------------------------------------------------------')