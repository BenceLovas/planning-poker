import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Modal, Text, Input, Button, useTheme } from '@nextui-org/react'
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
  hasPickedCard: boolean
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
  const [selectedValueId, setSelectedValueId] = useState<string | null>(null)
  const { theme } = useTheme()

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

    const onClick = (
      socket: Socket | undefined,
      value: number | null,
      id: string
    ) => {
      if (id !== selectedValueId) {
        if (selectedValueId === null) {
          if (socket) {
            socket.emit('user_has_picked_card')
          }
        }
        if (socket) {
          socket.emit('value_update', {
            user: {
              name: userName,
              id: userId,
            },
            value,
          })
        }
        setSelectedValueId(id)
      } else {
        if (socket) {
          socket.emit('user_has_not_picked_card')
        }
        setSelectedValueId(null)
      }
    }

    return roomModel.values.map((value) => {
      return (
        <div
          key={value.id}
          onClick={() => onClick(socket, value.value, value.id)}
          style={{
            border: `4px solid ${theme?.colors.primary.value}`,
            background:
              value.id === selectedValueId
                ? theme?.colors.primary.value
                : 'transparent',
            cursor: 'pointer',
            borderRadius: 10,
            width: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 10px',
          }}
        >
          <Text h3>{value.label}</Text>
        </div>
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
            <div key={user.id}>
              <div
                style={{
                  border: `4px solid ${theme?.colors.primary.value}`,
                  background: user.hasPickedCard
                    ? theme?.colors.primary.value
                    : 'transparent',
                  borderRadius: 10,
                  width: 60,
                  height: 84,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px 10px',
                }}
              ></div>
              <Text h4>{user.name}</Text>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>{renderValueCards()}</div>

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
