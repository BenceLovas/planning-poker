import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Text, Button, useTheme, Avatar } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'
import { CardPicker } from '../../../../../../components/CardPicker'
import { ThemeSwitcher } from '../../../../../../components/ThemeSwitcher'
import { IoPerson, IoCaretBack } from 'react-icons/io5'
import NameInputModal from '../../../../../../components/NameInputModal'
import { useSocket } from '../../../../../../hooks/useSocket'
import User from '../../../../../../types/user'
import { motion } from 'framer-motion'
import { GameState } from '../../../../../../types/GameState'
import { TableCard } from '../../../../../../components/TableCard'

// this is needed to keep the router query up to date on page refresh
export async function getServerSideProps() {
  return {
    props: {},
  }
}

type SocketData = {
  user: User
  game: {
    state: GameState
  }
}

const Room: NextPage = () => {
  const router = useRouter()
  const { theme } = useTheme()

  const [userName, setUserName] = useState('')
  const [userNameInput, setUserNameInput] = useState('')
  const [userId, setUserId] = useState('')
  const socket = useSocket(router.query.id as string, userName, userId)

  const [openModalForNameInput, setOpenModalForNameInput] = useState(false)
  const [usersInRoom, setUsersInRoom] = useState<SocketData[]>([])
  const [selectedValueId, setSelectedValueId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState>('pick')

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
      socket.on('room_user_list_update', (payload: SocketData[]) => {
        setUsersInRoom(payload)
        const socketData = payload.find(
          (data: SocketData) => data.user.id === userId
        )
        setSelectedValueId(
          (socketData &&
            socketData.user &&
            socketData.user.pickedValue &&
            socketData.user.pickedValue.id) ||
            null
        )
        console.log('room update - setting game state ', payload[0].game.state)
        setGameState(payload[0].game.state)
        console.log(payload)
      })
      socket.on('card-reveal', (payload: SocketData[]) => {
        setUsersInRoom(payload)
        setGameState(payload[0].game.state)
        console.log('card reveal - setting game state ', payload[0].game.state)
      })
      socket.on('card_reset', (payload: SocketData[]) => {
        setUsersInRoom(payload)
        setSelectedValueId(null)
        setGameState(payload[0].game.state)
        console.log('card reset - setting game state ', payload[0].game.state)
      })

      socket.on('initiate-reveal-countdown', () => {
        setGameState('count-down')
      })

      socket.on('user_disconnected', (userId) => {
        setUsersInRoom(usersInRoom.filter((user) => user.user.id !== userId))
      })

      socket.on('value_update', (value) => {
        setSelectedValueId(value.id)
      })
    }
  }, [socket, userId, usersInRoom])

  useEffect(() => {
    if (userName) {
      setUserNameInput('')
    }
  }, [userName])

  const closeModal = () => {
    if (userNameInput !== null) {
      localStorage.setItem('userName', userNameInput)
      setUserName(userNameInput)
      setOpenModalForNameInput(false)
    }
  }

  const renderControlButton = () => {
    switch (gameState) {
      case 'pick':
        return (
          <Button
            rounded
            onClick={() => {
              socket?.emit('initiate-reveal-countdown')
            }}
            disabled={!usersInRoom.some((user) => user.user.hasPickedCard)}
          >
            Reveal Cards
          </Button>
        )
      case 'reveal':
        return (
          <Button rounded onClick={() => socket?.emit('card-reset')}>
            New Game
          </Button>
        )

      case 'count-down': {
        return <Text h5>3.. 2.. 1..</Text>
      }
      default:
        return null
    }
  }

  return (
    <>
      <Head>
        <title>Planning Poker - Room</title>
      </Head>
      <div
        style={{
          background: theme?.colors.background.value,
          height: '100%',
          display: 'grid',
          gridTemplateRows: '100px 1fr 200px',
          gridTemplateAreas: `
          'header'
          'table'
          'cards'
        `,
        }}
      >
        <div
          style={{
            gridArea: 'header',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
              }}
              onClick={() => router.push('/')}
            >
              <IoCaretBack />
              <Text h5>Home</Text>
            </div>
            <ThemeSwitcher />
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Text h3>{userName}</Text>
            <Avatar
              icon={<IoPerson size={20} color={theme?.colors.primary.value} />}
            />
          </div>
        </div>
        <div
          style={{
            gridArea: 'table',
            display: 'grid',
            gridTemplateRows: '1fr 1fr 1fr',
            gap: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 20,
              alignItems: 'flex-end',
            }}
          >
            {usersInRoom.map((user, index) =>
              index % 2 !== 0 ? (
                <TableCard user={user.user} gameState={gameState} />
              ) : null
            )}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                borderRadius: 100,
                height: '100%',
                width: '40%',
                background: theme?.colors.accents2.value,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {renderControlButton()}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 20,
              alignItems: 'flex-start',
            }}
          >
            {usersInRoom.map((user, index) =>
              index % 2 === 0 ? (
                <TableCard user={user.user} gameState={gameState} />
              ) : null
            )}
          </div>
        </div>
        <div
          style={{
            overflowX: 'scroll',
            gridArea: 'cards',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <motion.div
            initial={{ y: 150 }}
            animate={{ y: gameState === 'pick' ? 0 : 150 }}
            transition={{
              duration: 0.4,
            }}
          >
            <CardPicker
              roomType={router.query.type as string}
              socket={socket}
              selectedValueId={selectedValueId}
              setSelectedValueId={setSelectedValueId}
            />
          </motion.div>
        </div>
      </div>
      <NameInputModal
        closeModal={closeModal}
        openModalForNameInput={openModalForNameInput}
        userNameInput={userNameInput}
        setUserNameInput={setUserNameInput}
      />
    </>
  )
}

export default Room
