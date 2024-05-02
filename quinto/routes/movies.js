import { Router } from 'express'
import { MovieController } from '../controllers/movie.js'

export const createRouterMovies = ({ movieModel }) => {
  const routerMovies = Router()
  const movieController = new MovieController({ movieModel })

  routerMovies.get('/', movieController.getAll)
  routerMovies.post('/', movieController.create)

  routerMovies.get('/:id', movieController.getById)
  routerMovies.patch('/:id', movieController.update)
  routerMovies.delete('/:id', movieController.delete)

  return routerMovies
}
