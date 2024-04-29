const fs = require('node:fs')
const path = require('node:path')

// const initPath = '.'

// sincronico
function recursivity (actualPath, res) {
  // console.log(fs.statSync(actualPath).isFile())
  const isFile = fs.statSync(actualPath).isFile()
  if (isFile) {
    const fileName = path.basename(actualPath)
    res.push({ fileName, actualPath })
    return res
  } else {
    const files = fs.readdirSync(actualPath)
    files.forEach(element => {
      const newActualPath = path.join(actualPath, element)
      res = [...recursivity(newActualPath, res)]
    })
  }
  return res
}
// const files = recursivity(initPath, [])
// asincrono - no funciono :/
function searchFileAsync (actualPath, callback) {
  const isFile = fs.statSync(actualPath).isFile()
  if (isFile) {
    callback(path.basename(actualPath))
  } else {
    fs.readdir(actualPath, (err, files) => {
      if (err) {
        console.log('un error ha ocurrido', err)
      }
      const res = []
      files.forEach((element, index) => {
        const newActualPath = path.join(actualPath, element)
        searchFileAsync(newActualPath, (file) => {
          res.push(file)
          if (index + 1 === res.length) {
            callback(res)
          }
        })
      })
    })
  }
}

// searchFileAsync('.', (files) => {
//     console.log('Hereerrearea')
//     console.log(files)
// })
// sincronico
function modulo (num) {
  if (num === 0 || num === 1) {
    return 1
  }
  return num * modulo(num - 1)
}

function fibonacci (num) {
  if (num === 0 || num === 1) {
    return num
  }
  return fibonacci(num - 1) + fibonacci(num - 2)
}

// console.log(modulo(3))
// console.log(fibonacci(3))

// asincrono
function moduloAsync (num, callback) {
  if (num === 0 || num === 1) {
    callback(1)
  } else {
    moduloAsync(num - 1, (numBefore) => {
      callback(num * numBefore)
    })
  }
}

function fibonacciAsync (num, callback) {
  if (num === 0 || num === 1) {
    callback(num)
  } else {
    fibonacciAsync(num - 2, (numA) => {
      fibonacciAsync(num - 1, (numB) => {
        callback(numA + numB)
      })
    })
  }
}

// moduloAsync(3, (num) => {
//     console.log(num)
// })

// fibonacciAsync(3, (num) => {
//     console.log(num)
// })
/*
    leer los elementos del directorio actual
    comprobar si son archivos o si son carpetas
    si son archivos se agregan a la lista de salida
    si son carpetas se repite el ciclo
*/
