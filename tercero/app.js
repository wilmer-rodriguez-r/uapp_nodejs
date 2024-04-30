const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./schemas/schema-movie')

// iniciar aplicación
const app = express()

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 1234

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hola mundo<h1>')
})

app.get('/movies', (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*')
  // console.log(req.origin)
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
  // res.header('Access-Control-Allow-Origin', 'http://localhost:5500')
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

  // crear nueva peilicula y persistencia
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

app.listen(PORT, () => {
  console.log(`listening on port: http://localhost:${PORT}`)
})
