import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Modal, Text, Input, Button, useTheme } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { roomTypeToModel, CardValue } from './model/room-types'
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
  pickedValue: CardValue | null
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
      socket.on('card_reset', (payload) => {
        setUsersInRoom(payload)
        setSelectedValueId(null)
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

    const onClick = (socket: Socket | undefined, value: CardValue) => {
      if (value.id !== selectedValueId) {
        if (selectedValueId === null) {
          if (socket) {
            socket.emit('user_has_picked_card')
          }
        }
        if (socket) {
          socket.emit('value_update', {
            value,
          })
        }
        setSelectedValueId(value.id)
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
          onClick={() => onClick(socket, value)}
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
          <Text
            h3
            color={
              value.id === selectedValueId ? 'white' : theme?.colors.text.value
            }
          >
            {value.label}
          </Text>
        </div>
      )
    })
  }

  return (
    <>
      <Head>
        <title>Planning Poker - Room</title>
      </Head>
      <div
        style={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: '200px 1fr 200px',
          gridTemplateAreas: `
          'header'
          'users'
          'cards'
        `,
        }}
      >
        <div style={{ gridArea: 'header' }}>
          <Text h1>{userName}</Text>
          <Button onClick={() => socket?.emit('card-reveal')}>
            Reveal Cards
          </Button>
          <Button onClick={() => socket?.emit('card-reset')}>
            Reset Cards
          </Button>
        </div>
        <div style={{ gridArea: 'users' }}>
          <Text h3>Users</Text>
          <div style={{ display: 'flex', gap: 10 }}>
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
                  >
                    {user.pickedValue && (
                      <Text h3 color="white">
                        {user.pickedValue.label}
                      </Text>
                    )}
                  </div>
                  <Text h4>{user.name}</Text>
                </div>
              )
            })}
          </div>
        </div>
        <div
          style={{
            overflowX: 'scroll',
            gridArea: 'cards',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            padding: 20,
          }}
        >
          <div style={{ overflowX: 'scroll', paddingBottom: 16 }}>
            <div style={{ display: 'flex', gap: 6 }}>{renderValueCards()}</div>
          </div>
        </div>
      </div>

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
