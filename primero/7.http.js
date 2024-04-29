const http = require('node:http')
const { findFreePort } = require('./8.free-port.js')

const server = http.createServer((req, res) => {
  console.log('request received')
  res.end('Hola mundo')
})

findFreePort(3000).then(port => {
  server.listen(port, () => {
    console.log(`Server listening on port: http://localhost:${server.address().port}`)
  })
})
