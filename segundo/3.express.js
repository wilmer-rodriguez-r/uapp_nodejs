const express = require('express')
const ditto = require('./pokemon/ditto.json')
const app = express()

// desabilitar cabecera de la respuesta
app.disable('x-powered-by')

const PORT = process.env.PORT ?? 1234

app.use(express.json())

// middleware
// app.use((req, res, next) => {
//   console.log('Mi primer middleware')
//   // trackear las peticiones
//   // revisar cookies
//   // mutar peticiones
//   if (req.method !== 'POST') return next()
//   if (req.headers['content-type'] !== 'application/json') return next()

//   let body = ''

//   // escuchar evento 'data'
//   req.on('data', chunk => {
//     body += chunk.toString()
//   })

//   req.on('end', () => {
//     const data = JSON.parse(body)
//     // mutar la reqquest
//     req.body = data
//     next()
//   })
// })

app.get('/', (req, res) => {
  res.send('<h1>Mi página<h1>')
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(ditto)
})

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})

app.use((req, res) => {
  res.status(404).send('<h1>404<h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on port: http://localhost:${PORT}`)
})
