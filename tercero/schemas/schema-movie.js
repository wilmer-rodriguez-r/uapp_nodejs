const z = require('zod')

// para validar datos de entrada de la api
const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Crime', 'Drama', 'Fantasy', 'Biography', 'Romance', 'Sci-Fi', 'Animation'],
      {
        invalid_type_error: 'Movie genre must be an array of enum Genre',
        required_error: 'Movie genre is required'
      })
  )
})

function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}

function validateMovie (object) {
  return movieSchema.safeParse(object)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
