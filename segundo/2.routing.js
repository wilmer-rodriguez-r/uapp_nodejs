const http = require('node:http')
const ditto = require('./pokemon/ditto.json')
const port = process.env.PORT ?? 3000

const processServer = (req, res) => {
  const { url, method } = req
  switch (method) {
    case 'GET' :
      switch (url) {
        case '/':
          res.setHeader('ContentType', 'text/HTML')
          res.end('probando...')
          break
        case '/pokemon/ditto':
          res.setHeader('ContentType', 'application/json')
          res.end(JSON.stringify(ditto))
          break
        default:
          res.setHeader('ContentType', 'text/HTML')
          res.statusCode = 400
          res.end('Not found')
          break
      }
      break
    case 'POST':
      switch (url) {
        case '/pokemon': {
          let body = ''

          // escuchar evento 'data'
          req.on('data', chunk => {
            body += chunk.toString()
          })

          req.on('end', () => {
            const data = JSON.parse(body)
            // realizar persistencia de los datos
            res.writeHead(201, { ContentType: 'application/json; charset=utf-8' })
            res.end(JSON.stringify(data))
          })
          break
        }
        default:
          res.setHeader('ContentType', 'text/HTML')
          res.statusCode = 400
          res.end('Not found')
          break
      }
      break
  }
}

const server = http.createServer(processServer)

server.listen(port, () => {
  console.log(`Server listening on port: http://localhost:${port}`)
})
