import express, { json } from 'express'
import { createRouterMovies } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
// import { MovieModel } from './models/mysql/movie.js'

// inyectando la dependencia del modelo
export const createApp = ({ movieModel }) => {
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
  const routerMovies = createRouterMovies({ movieModel })
  app.use('/movies', routerMovies)

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`listening on port: http://localhost:${PORT}`)
  })
}
