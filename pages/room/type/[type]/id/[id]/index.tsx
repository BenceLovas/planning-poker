import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState, useMemo } from 'react'
import { Text, Button, useTheme, Popover, Dropdown } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'
import { CardPicker } from '../../../../../../components/CardPicker'
import { ThemeSwitcher } from '../../../../../../components/ThemeSwitcher'
import { IoCaretBack } from 'react-icons/io5'
import NameInputModal from '../../../../../../components/NameInputModal'
import { useSocket } from '../../../../../../hooks/useSocket'
import { AnimatePresence, motion } from 'framer-motion'
import { GameState } from '../../../../../../types/GameState'
import { TableCard } from '../../../../../../components/TableCard'
import { Countdown } from '../../../../../../components/Countdown'
import User from '../../../../../../types/User'
import roomTypeToCardDeck from '../../../../../../models/roomTypeToCardDeck'
import { RoomType } from '../../../../../../types/RoomType'

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
  const { theme, isDark } = useTheme()

  const [userName, setUserName] = useState('')
  const [userNameInput, setUserNameInput] = useState('')
  const [userId, setUserId] = useState('')
  const socket = useSocket(router.query.id as string, userName, userId)

  const [openModalForNameInput, setOpenModalForNameInput] = useState(false)
  const [socketsData, setSocketsData] = useState<SocketData[]>([])
  const [selectedValueId, setSelectedValueId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState>('pick')

  useEffect(() => {
    const userNameFromLocalStorage = localStorage.getItem('userName')
    if (userNameFromLocalStorage === null) {
      setOpenModalForNameInput(true)
    } else {
      if (userNameFromLocalStorage.trim().length < 3) {
        setOpenModalForNameInput(true)
      } else {
        setUserName(userNameFromLocalStorage.trim().substring(0, 20))
      }
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
        setSocketsData(payload)
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
        setGameState(payload[0].game.state)
      })
      socket.on('card-reveal', (payload: SocketData[]) => {
        setSocketsData(payload)
        setGameState(payload[0].game.state)
      })
      socket.on('card_reset', (payload: SocketData[]) => {
        setSocketsData(payload)
        setSelectedValueId(null)
        setGameState(payload[0].game.state)
      })

      socket.on('initiate-reveal-countdown', () => {
        setGameState('count-down')
      })

      socket.on('user_disconnected', (userId) => {
        setSocketsData(
          socketsData.filter((socketData) => socketData.user.id !== userId)
        )
      })

      socket.on('value_update', (value) => {
        setSelectedValueId(value.id)
      })
    }
  }, [socket, userId, socketsData])

  useEffect(() => {
    if (userName) {
      setUserNameInput('')
    }
  }, [userName])

  const closeModal = () => {
    if (userNameInput !== null) {
      localStorage.setItem('userName', userNameInput.trim())
      setUserName(userNameInput.trim())
      setOpenModalForNameInput(false)
    }
  }

  const renderControlButton = () => {
    switch (gameState) {
      case 'pick':
        return (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                rounded
                shadow
                onClick={() => {
                  socket?.emit('initiate-reveal-countdown')
                }}
                disabled={
                  !socketsData.some(
                    (socketData) => socketData.user.hasPickedCard
                  )
                }
                bordered={
                  !socketsData.some(
                    (socketData) => socketData.user.hasPickedCard
                  )
                }
              >
                Reveal cards
              </Button>
            </motion.div>
          </AnimatePresence>
        )
      case 'reveal':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button rounded bordered onClick={() => socket?.emit('card-reset')}>
              <Text h6 weight={'semibold'}>
                New game
              </Text>
            </Button>
          </motion.div>
        )
      case 'count-down': {
        return <Countdown />
      }
      default:
        return null
    }
  }

  const average = useMemo((): string => {
    const socketsWithValuablePicks = socketsData.filter(
      (socketData) =>
        socketData.user.pickedValue &&
        socketData.user.pickedValue.value !== null
    )
    const average =
      socketsWithValuablePicks.length !== 0
        ? socketsWithValuablePicks.reduce(
            (acc, socketData) =>
              socketData.user.pickedValue &&
              socketData.user.pickedValue.value !== null
                ? acc + socketData.user.pickedValue.value
                : acc,
            0
          ) / socketsWithValuablePicks.length
        : 0

    if (router.query.type === 't-shirt') {
      const roundedAverage = Math.round(average)
      const tShirtCard = roomTypeToCardDeck[router.query.type].values.find(
        (card) => card.value === roundedAverage
      )
      // currently tShirtCard should be alaways found but added N/A for fallback just in case
      return tShirtCard ? tShirtCard.label : 'N/A'
    } else {
      // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
      return socketsWithValuablePicks.length !== 0
        ? String(Math.round((average + Number.EPSILON) * 100) / 100)
        : 'N/A'
    }
  }, [gameState])

  return (
    <>
      <Head>
        <title>Planning Poker - Room</title>
      </Head>
      <div
        style={{
          background: theme?.colors.background.value,
          height: '100vh',
          display: 'grid',
          gridTemplateRows: '70px minmax(0, 1fr) 180px',
          gridTemplateColumns: '100vw',
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
            alignItems: 'center',
            padding: 20,
            background: isDark ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.03)',
            borderColor: isDark ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.03)',
            borderWidth: 2,
            borderStyle: 'solid',
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
              <Text h5>Create room</Text>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div>
              <Popover>
                <Popover.Trigger>
                  <Button
                    auto
                    bordered
                    rounded
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                    }}
                  >
                    <Text h6 weight={'semibold'}>
                      Invite others
                    </Text>
                  </Button>
                </Popover.Trigger>
                <Popover.Content>
                  <div style={{ padding: 24 }}>
                    <div>URL copied!</div>
                    <div>Share the URL with your teammates</div>
                  </div>
                </Popover.Content>
              </Popover>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderLeft: `3px solid ${theme?.colors.accents2.value}`,
                borderRight: `3px solid ${theme?.colors.accents2.value}`,
              }}
            >
              <Dropdown>
                <Dropdown.Button light ripple={false}>
                  <div
                    style={{ display: 'flex', gap: 12, alignItems: 'center' }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        background: theme?.colors.primaryLight.value,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text h5 style={{ color: theme?.colors.primary.value }}>
                        {userName && userName[0].toUpperCase()}
                      </Text>
                    </div>
                    <Text h5>{userName}</Text>
                  </div>
                </Dropdown.Button>
                <Dropdown.Menu
                  onAction={(key) => {
                    if (key === 'edit') {
                      setUserNameInput(userName)
                      setOpenModalForNameInput(true)
                    }
                  }}
                >
                  <Dropdown.Item key="edit">Edit name</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
        <div
          style={{
            margin: 30,
            gridArea: 'table',
            display: 'grid',
            gridTemplateRows: '1fr minmax(60px, 180px) 1fr',
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
            {socketsData.map((socketData, index) =>
              index % 2 !== 0 ? (
                <TableCard
                  user={socketData.user}
                  gameState={gameState}
                  nameOnTop={true}
                  key={socketData.user.id}
                />
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
                minWidth: 240,
                maxWidth: 540,
                width: '70%',
                background: isDark
                  ? 'rgba(255,255,255,.035)'
                  : 'rgba(0,0,0,.03)',
                borderColor: isDark
                  ? 'rgba(255,255,255,.035)'
                  : 'rgba(0,0,0,.03)',
                borderWidth: 2,
                borderStyle: 'solid',
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
            {socketsData.map((socketData, index) =>
              index % 2 === 0 ? (
                <TableCard
                  user={socketData.user}
                  gameState={gameState}
                  nameOnTop={false}
                  key={socketData.user.id}
                />
              ) : null
            )}
          </div>
        </div>
        <div
          style={{
            gridArea: 'cards',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          {gameState === 'reveal' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                padding: 48,
              }}
            >
              <Text h4 weight={'light'}>
                Average
              </Text>
              <Text h2>{average}</Text>
            </div>
          )}
          <AnimatePresence>
            {gameState === 'pick' && (
              <motion.div
                initial={{ y: 150 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.4,
                }}
                exit={{
                  y: 150,
                }}
              >
                <CardPicker
                  roomType={router.query.type as RoomType}
                  socket={socket}
                  selectedValueId={selectedValueId}
                  setSelectedValueId={setSelectedValueId}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
