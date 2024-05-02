import { readJSON } from '../../utils.js'
import crypto from 'node:crypto'

const movies = readJSON('./movies.json')

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      return movies.filter(
        movie => movie.genre.some(
          g => g.toLowerCase() === genre.toLowerCase()
        )
      )
    }
    return movies
  }

  static async getById ({ id }) {
    return movies.find(movie => movie.id === id)
  }

  static async create ({ input }) {
    const newMovie = {
      id: crypto.randomUUID(),
      ...input
    }

    // guardar en base de datos
    movies.push(newMovie)

    return newMovie
  }

  static async delete ({ id }) {
    const indexMovie = movies.findIndex(movie => movie.id === id)

    if (indexMovie < 0) return false

    movies.splice(indexMovie, 1)
    return true
  }

  static async update ({ id, input }) {
    const indexMovie = movies.findIndex(movie => movie.id === id)
    if (indexMovie < 0) return false

    const updateMovie = {
      ...movies[indexMovie],
      ...input.data
    }

    // Base de datos
    movies[indexMovie] = updateMovie
    return true
  }
}
