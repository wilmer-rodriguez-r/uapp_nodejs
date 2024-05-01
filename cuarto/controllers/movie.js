import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/schema-movie.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })

    if (movie) {
      return res.json(movie)
    }

    res.status(404).json({ error: 'not found' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body)

    if (result.error) {
      // 422 unprocessable entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await MovieModel.create({ input: result.data })

    res.status(201).json(newMovie)
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body)

    if (result.error) {
      // 422 unprocessable entity
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updateMovie = await MovieModel.update({ id, input: result.data })

    if (!updateMovie) return res.status(404).json({ message: 'ID movie not found' })

    res.json({ message: 'Movie updated' })
  }

  static async delete (req, res) {
    const { id } = req.params
    const isDelete = await MovieModel.delete({ id })

    if (!isDelete) return res.status(404).json({ message: 'Not found' })

    return res.json({ message: 'Movie deleted' })
  }
}
