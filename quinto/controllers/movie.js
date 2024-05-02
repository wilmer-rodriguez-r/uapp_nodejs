// import { MovieModel } from '../models/local-file-system/movie.js'
// import { MovieModel } from '../models/mysql/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/schema-movie.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getAll({ genre })
    res.json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const movie = await this.movieModel.getById({ id })

    if (movie) {
      return res.json(movie)
    }

    res.status(404).json({ error: 'not found' })
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)

    if (result.error) {
      // 422 unprocessable entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await this.movieModel.create({ input: result.data })

    res.status(201).json(newMovie)
  }

  update = async (req, res) => {
    const result = validatePartialMovie(req.body)

    if (result.error) {
      // 422 unprocessable entity
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updateMovie = await this.movieModel.update({ id, input: result.data })

    if (!updateMovie) return res.status(404).json({ message: 'ID movie not found' })

    res.json({ message: 'Movie updated' })
  }

  delete = async (req, res) => {
    const { id } = req.params
    const isDelete = await this.movieModel.delete({ id })

    if (!isDelete) return res.status(404).json({ message: 'Not found' })

    return res.json({ message: 'Movie deleted' })
  }
}
