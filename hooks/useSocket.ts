import { useEffect, useState } from 'react'
import socketIOClient, { Socket } from 'socket.io-client'

export function useSocket(roomId: string, userName: string, userId: string) {
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    if (roomId && userName && userId) {
      const socketIo = socketIOClient(
        String(process.env.NEXT_PUBLIC_WS_SERVER_URL),
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
  }, [userName, userId, roomId])

  return socket
}
