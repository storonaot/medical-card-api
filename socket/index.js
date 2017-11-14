module.exports = (server) => {
  const io = require('socket.io')(server)

  io.on('connection', (socket) => {
    // socket.emit('news', { hello: 'word' })
    // socket.on('my other event', (data) => {
    //   console.log(data)
    // })

    console.log('a user connected')
  })

  return io
}
