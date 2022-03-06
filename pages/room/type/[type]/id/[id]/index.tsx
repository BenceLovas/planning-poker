import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Modal, Text, Input, Button } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { roomTypeToModel } from './model/room-types'
import socketIOClient, { Socket } from 'socket.io-client'
import { v4 as uuid } from 'uuid'

export async function getServerSideProps() {
  return {
    props: {},
  }
}

interface User {
  name: string
  id: string
}

function useSocket(
  url: string,
  roomId: string,
  userName: string,
  userId: string
) {
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    if (roomId && userName && userId) {
      const socketIo = socketIOClient(url, {
        query: {
          roomId,
          userName,
          userId,
        },
      })
      setSocket(socketIo)

      return () => {
        socketIo.disconnect()
      }
    }
  }, [userName, userId, roomId, url])

  return socket
}

const Room: NextPage = () => {
  const router = useRouter()
  const [openModalForNameInput, setOpenModalForNameInput] = useState(false)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const socket = useSocket(
    'http://localhost:3000',
    router.query.id as string,
    userName,
    userId
  )
  const [usersInRoom, setUsersInRoom] = useState<User[]>([])

  useEffect(() => {
    const userNameFromLocalStorage = localStorage.getItem('userName')
    if (userNameFromLocalStorage === null) {
      setOpenModalForNameInput(true)
    } else {
      setUserName(userNameFromLocalStorage)
    }

    const userIdFromLocalStorage = localStorage.getItem('userId')
    if (userIdFromLocalStorage === null) {
      const userId = uuid()
      localStorage.setItem('userId', userId)
      setUserId(userId)
    } else {
      setUserId(userIdFromLocalStorage)
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('value_update', (payload) => {
        console.log(payload)
      })
      socket.on('room_user_list_update', (payload) => {
        setUsersInRoom(payload)
        console.log(payload)
      })
    }
  }, [socket])

  const closeModal = () => {
    if (userName !== null) {
      localStorage.setItem('userName', userName)
      setOpenModalForNameInput(false)
    }
  }

  const renderValueCards = () => {
    const roomType: string = router.query.type as string
    const roomModel = roomTypeToModel[roomType]

    const sendValue = (socket: Socket | undefined, value: number | null) => {
      if (socket) {
        socket.emit('value_update', {
          user: {
            name: userName,
            id: userId,
          },
          value,
        })
      }
    }

    return roomModel.values.map((value) => {
      return (
        <Button
          key={value.label}
          bordered
          shadow
          auto
          onClick={() => sendValue(socket, value.value)}
        >
          <Text h3>{value.label}</Text>
        </Button>
      )
    })
  }

  return (
    <>
      <Head>
        <title>Planning Poker - Room</title>
      </Head>
      <Text h1>{userName}</Text>
      <Text h3>Users</Text>
      <div>
        {usersInRoom.map((user) => {
          return (
            <Text h4 key={user.id}>
              {user.name}
            </Text>
          )
        })}
      </div>
      <div style={{ display: 'flex' }}>{renderValueCards()}</div>

      <Modal
        aria-labelledby="modal-title"
        open={openModalForNameInput}
        onClose={closeModal}
        blur
        preventClose
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Choose your display name
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Enter your display name"
            rounded
            onChange={(e) => setUserName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            onClick={closeModal}
            rounded
            disabled={!Boolean(userName?.length)}
          >
            Continue to game
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Room
