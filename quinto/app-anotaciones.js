import express, { json } from 'express'
import crypto from 'node:crypto'
import { validateMovie, validatePartialMovie } from './schemas/schema-movie.js'
import cors from 'cors'

// Leer JSON en ESModules

// NO ES UN ESTANDAR TODAVIA, PUEDE CONTENER FALLOS
// import movies from './movies.json' with { type: 'json' }

// Primera forma de leer json con ECJS
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// Segunda forma de importar JSON
// Creando tu propio require, usando forma nativa
// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url)
// const movies = require('./movies.json')

import { readJSON } from './utils.js'
const movies = readJSON('./movies.json')

// iniciar aplicación
const app = express()
app.disable('x-powered-by')

// ya existe un middleware que se encarga de los CORS, sin embargo este permite todo el trafico por defecto.
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://127.0.0.1:5500',
      'http://localhost:5500'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed CORS'))
  }
})
)
// middleware que permite mutar la petición para adjuntar todo el body
app.use(json())
// metodos "normales": GET/HEAD/POST
// metodos complejos: PUT/PATCH/DELETE (solicitan de OPTIONS), Preflight
// app.options('/movies/:id', (req, res) => {
//   const origin = req.header('origin')
//   if (ACCEPTED_ORIGINS.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//   }
//   res.send()
// })

app.get('/', (req, res) => {
  res.send('<h1>Hola mundo<h1>')
})

app.get('/movies', (req, res) => {
  // Header que permite el uso compartido de recursos para distintos origenes al local
  // En el caso de la petición sea del mismo origen, la req.header('origin') es undifined porque el navegador no la envía.
  // res.header('Access-Control-Allow-Origin', '*')
  // res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
  // res.header('Access-Control-Allow-Origin', 'http://localhost:5500')
  // const origin = req.header('origin')
  // if (ACCEPTED_ORIGINS.includes(origin)) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  const { genre, limit } = req.query
  let moviesRes = movies
  if (genre) {
    moviesRes = movies.filter(movie => {
      return movie.genre.some(genreMovie => genreMovie.toLowerCase() === genre.toLowerCase())
    })
  }
  if (limit) {
    moviesRes = moviesRes.slice(0, limit)
  }
  res.json(moviesRes)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) {
    return res.json(movie)
  }
  res.status(404).json({ error: 'not found' })
})

app.post('/movies', (req, res) => {
  // validar los datos de entrada
  const result = validateMovie(req.body)

  // Si ocurrio un error
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  // crear nueva pelicula y persistencia
  const newMovie = {
    id: crypto.randomUUID(),
    ...result
  }
  movies.push(newMovie)

  // respuesta
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const indexMovie = movies.findIndex(movie => movie.id === id)

  if (indexMovie < 0) return res.status(404).json({ message: 'ID movie not found' })

  const updateMovie = {
    ...movies[indexMovie],
    ...result.data
  }

  movies[indexMovie] = updateMovie

  res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  // const origin = req.header('origin')
  // if (ACCEPTED_ORIGINS.includes(origin)) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  const { id } = req.params
  const indexMovie = movies.findIndex(movie => movie.id === id)

  if (indexMovie < 0) {
    return res.status(404).json({ messae: 'Not found' })
  }

  movies.splice(indexMovie, 1)
  return res.json({ message: 'Movie deleted' })
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`listening on port: http://localhost:${PORT}`)
})
