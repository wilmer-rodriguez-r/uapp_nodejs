import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

dotenv.config()

const port = process.env.PORT ?? 1234
const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})

const db = createClient({
  url: 'libsql://active-cammi-wilmer-rodriguez-r.turso.io',
  authToken: process.env.DB_TOKEN
})

await db.execute(
  `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT
  )`
)

io.on('connection', async (socket) => {
  console.log('a user has connected')

  socket.on('disconnect', () => {
    console.log('a user has disconnected')
  })

  socket.on('chat message', async (msg) => {
    let result
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content) VALUES (:message)',
        args: { message: msg }
      })
    } catch (error) {
      console.error(error)
      return
    }
    console.log('message: ' + msg)
    io.emit('chat message', msg, result.lastInsertRowid.toString())
  })

  if (!socket.recovered) {
    try {
      const result = await db.execute({
        sql: 'SELECT id, content FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffset ?? 0]
      })
      result.rows.forEach(row => {
        io.emit('chat message', row.content, row.id)
      })
    } catch (error) {
      console.log(error)
    }
  }
})
app.use(logger('dev'))

app.get('/', (req, res) => {
  console.log(process.cwd())
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`server started in: http://localhost:${port}`)
})
