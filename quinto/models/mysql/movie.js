import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'root12345',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

// se puede realizar consultas de la siguiente manera, aunque no es recomendable
// connection.query('SELECT * FROM ...', (err, results) => {
//   // no es recomendable
// })
export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      const [genres] = await connection.query(
        'SELECT * FROM genre WHERE LOWER(name) = ?',
        [lowerCaseGenre]
      )

      if (genres.lenght === 0) return []
      const [{ id: genreId }] = genres
      const [movies] = await connection.query(
        `SELECT BIN_TO_UUID(movie.id) as id, movie.title, movie.year, movie.director, movie.duration, movie.poster, movie.rate 
          FROM movie 
          INNER JOIN movie_genre on movie.id = movie_genre.movie_id 
          WHERE movie_genre.genre_id = ?;`,
        [genreId]
      )
      return movies
    }
    const [movies] = await connection.query(
      `SELECT BIN_TO_UUID(id) as id, title, year, director, duration, poster, rate 
        FROM movie;`
    )
    // console.log(result)
    return movies
  }

  static async getById ({ id }) {
    const [movie] = await connection.query(
      `SELECT BIN_TO_UUID(id) as id, title, year, director, duration, poster, rate 
        FROM movie 
        WHERE movie.id = UUID_TO_BIN(?);`,
      [id]
    )
    if (movie.lenght === 0) return null
    return movie
  }

  static async create ({ input }) {
    const { title, year, director, duration, rate, poster, genre: genres } = input

    // crear uuid con crypto
    // const uuid = crypto.randomUUID()
    // crear UUID con base de datos
    // suponiendo que los generos ya existen
    const [[{ uuid }]] = await connection.query('SELECT UUID() uuid')
    try {
      // primero se crea la pelicual
      await connection.query(
        `INSERT INTO movie(id, title, year, director, duration, rate, poster)
        VALUES(UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`,
        [uuid, title, year, director, duration, rate, poster]
      )

      // mapear los generos a la pelicula
      genres.forEach(async genre => {
        const [[{ id: genreId }]] = await connection.query(
          `SELECT *
            FROM genre
            WHERE name = ?`,
          [genre]
        )

        await connection.query(
          `INSERT INTO movie_genre(genre_id, movie_id)
            VALUES (?, UUID_TO_BIN(?))`,
          [genreId, uuid]
        )
      })
    } catch (err) {
      // capturar errores para no mostrar a usuario final
      // guardar err de la base de datos en un log para consulta posterior
      console.log(err)
    }

    const [[newMovie]] = await connection.query(
      `SELECT BIN_TO_UUID(id) as id, title, year, director, duration, poster, rate 
        FROM movie
        WHERE movie.id = UUID_TO_BIN(?)`,
      [uuid]
    )

    return newMovie
  }

  static async delete ({ id }) {
    const movie = await this.getById(id)
    if (movie) {
      try {
        await connection.query(
          `DELETE FROM movie 
            WHERE id = UUID_TO_BIN(?)`,
          [id]
        )
        return true
      } catch (error) {
        throw (new Error('Can not delete movie'))
      }
    }
    return false
  }

  static async update ({ id, input }) {
    const movie = await this.getById(id)
    if (movie) {
      try {
        await connection.query(
          `UPDATE movie
            SET ?
            WHERE movie.id = UUID_TO_BIN(?);`,
          [input, id]
        )
        return true
      } catch (error) {
        console.log(error.message)
      }
    }
    return false
  }
}
