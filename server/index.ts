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

  io.on('connection', async (socket: socketio.Socket) => {
    socket.data = {
      user: {
        name: socket.handshake.query.userName,
        id: socket.handshake.query.userId,
      },
    }
    // join room
    socket.join(socket.handshake.query.roomId as string)
    // update others about the join
    const socketsInRoom = await io
      .in(socket.handshake.query.roomId as string)
      .fetchSockets()
    io.in(socket.handshake.query.roomId as string).emit(
      'room_user_list_update',
      socketsInRoom.map((socket) => socket.data.user)
    )

    socket.on('value_update', (data) => {
      io.in(socket.handshake.query.roomId as string).emit('value_update', {
        user: {
          name: data.user.name,
          id: data.user.id,
        },
        value: data.value,
      })
    })

    socket.on('disconnect', async () => {
      console.log('client disconnected')
      const socketsInRoom = await io
        .in(socket.handshake.query.roomId as string)
        .fetchSockets()
      io.in(socket.handshake.query.roomId as string).emit(
        'room_user_list_update',
        socketsInRoom.map((socket) => socket.data.user)
      )
    })
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.all('*', (req: any, res: any) => nextHandler(req, res))

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})