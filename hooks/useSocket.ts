import { useEffect, useState } from 'react'
import socketIOClient, { Socket } from 'socket.io-client'

export function useSocket(
  url: string,
  roomId: string,
  userName: string,
  userId: string
) {
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    if (roomId && userName && userId) {
      const socketIo = socketIOClient(
        'https://planning-poker-ws-server.herokuapp.com',
        {
          query: {
            roomId,
            userName,
            userId,
          },
        }
      )
      setSocket(socketIo)

      return () => {
        socketIo.disconnect()
      }
    }
  }, [userName, userId, roomId, url])

  return socket
}
