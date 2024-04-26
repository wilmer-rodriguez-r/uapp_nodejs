const fs = require('node:fs/promises');

// leyendo archivos de manera asincrona pero con async y await
(async () => {
    const contText1 = await fs.readFile('./hola.txt', 'utf-8')
    console.log(contText1)
})()