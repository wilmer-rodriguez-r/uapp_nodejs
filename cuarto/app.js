import express, { json } from 'express'

import { routerMovies } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
app.disable('x-powered-by')

// middlewares
app.use(corsMiddleware())
app.use(json())

// ruta raiz
app.get('/', (req, res) => {
  res.send('<h1>Hola mundo<h1>')
})

// rutas para el recurso movies
app.use('/movies', routerMovies)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`listening on port: http://localhost:${PORT}`)
})
