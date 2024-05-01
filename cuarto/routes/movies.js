import { Router } from 'express'
import { MovieController } from '../controllers/movie.js'

export const routerMovies = Router()

routerMovies.get('/', MovieController.getAll)
routerMovies.post('/', MovieController.create)

routerMovies.get('/:id', MovieController.getById)
routerMovies.patch('/:id', MovieController.update)
routerMovies.delete('/:id', MovieController.delete)
