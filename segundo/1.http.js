const http = require('node:http')
const fs = require('node:fs')

const port = process.env.PORT ?? 3000

const processServer = (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')

  if (req.url === '/') {
    res.end('Hola mundo, ¿?')
  } else if (req.url === '/contacto') {
    res.end('que hubo')
  } else if (req.url === '/kitty') {
    fs.readFile('./cat.jpg', (err, image) => {
      if (err) {
        res.statusCode = 500
        res.end('Internal server error')
      } else {
        res.setHeader('Content-Type', 'image/jpg')
        res.end(image)
      }
    })
  } else {
    res.statusCode = 404
    res.end('404')
  }
}

const server = http.createServer(processServer)

server.listen(port, () => {
  console.log(`Server listening on port: http://localhost:${server.address().port}`)
})
