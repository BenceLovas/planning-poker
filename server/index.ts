import express, { Express } from 'express'
import * as http from 'http'
import next, { NextApiHandler } from 'next'
import * as socketio from 'socket.io'

const port: number = parseInt(process.env.PORT || '3000', 10)
const dev: boolean = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler: NextApiHandler = nextApp.getRequestHandler()

nextApp.prepare().then(async () => {
  const app: Express = express()
  const server: http.Server = http.createServer(app)
  const io: socketio.Server = new socketio.Server()
  io.attach(server)

  io.on('connection', (socket: socketio.Socket) => {
    socket.join(socket.handshake.query.roomId as string)
    socket
      .to(socket.handshake.query.roomId as string)
      .emit('update', 'new user joined the room')

    socket.on('disconnect', () => {
      console.log('client disconnected')
    })
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.all('*', (req: any, res: any) => nextHandler(req, res))

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
