import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Text, Button, useTheme, Tooltip, Loading } from '@nextui-org/react'
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
import { useMediaQuery } from '@mantine/hooks'

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
  const isMobileView = useMediaQuery('(max-width: 576px)')
  const [isSettingsDrawerOpen, setSettingsDrawerOpen] = useState(false)

  const [userName, setUserName] = useState('')
  const [userNameInput, setUserNameInput] = useState('')
  const [userId, setUserId] = useState('')
  const socket = useSocket(router.query.id as string, userName, userId)

  const [openModalForNameInput, setOpenModalForNameInput] = useState(false)
  const [socketsData, setSocketsData] = useState<SocketData[]>([])
  const [selectedValueId, setSelectedValueId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState>('pick')

  // useEffect(() => {

  // }, [isMobileView])

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
          <Button
            rounded
            onClick={() => {
              socket?.emit('initiate-reveal-countdown')
            }}
            disabled={
              !socketsData.some((socketData) => socketData.user.hasPickedCard)
            }
            auto={isMobileView}
          >
            Reveal cards
          </Button>
        )
      case 'reveal':
        return (
          <Button
            rounded
            onClick={() => socket?.emit('card-reset')}
            auto={isMobileView}
          >
            New game
          </Button>
        )

      case 'count-down': {
        return <Countdown />
      }
      default:
        return null
    }
  }

  const getAverage = () => {
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
      return socketsWithValuablePicks.length !== 0 ? average : 'N/A'
    }
  }

  return (
    <>
      <Head>
        <title>Planning Poker - Room</title>
      </Head>
      <AnimatePresence>
        {isSettingsDrawerOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{
              x: 0,
            }}
            exit={{
              x: '100%',
            }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            style={{
              background: theme?.colors.background.value,
              height: '100vh',
              width: '100%',
              position: 'absolute',
              zIndex: 888,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: 20,
              }}
            >
              <Button
                auto
                rounded
                bordered
                onClick={() => setSettingsDrawerOpen(false)}
              >
                <Text h6>Close settings</Text>
              </Button>
            </div>
            <div
              style={{
                padding: 20,
                display: 'grid',
                gap: 40,
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip
                  trigger="click"
                  content={'Share the URL with your teammates'}
                  placement={'bottom'}
                >
                  <Button auto rounded size="md">
                    Invite players
                  </Button>
                </Tooltip>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Text h4>{userName}</Text>
                <Button
                  auto
                  rounded
                  bordered
                  size="xs"
                  style={{ width: 60 }}
                  onClick={() => {
                    setUserNameInput(userName)
                    setOpenModalForNameInput(true)
                  }}
                >
                  {openModalForNameInput ? (
                    <Loading
                      type="points-opacity"
                      color={isDark ? 'white' : 'primary'}
                      size="sm"
                    />
                  ) : (
                    <Text h6 weight={'normal'}>
                      Edit
                    </Text>
                  )}
                </Button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ThemeSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          background: theme?.colors.background.value,
          height: '100%',
          display: 'grid',
          gridTemplateRows: '70px minmax(0, 1fr) 200px',
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
          {isMobileView ? (
            <Button
              auto
              rounded
              bordered
              onClick={() => setSettingsDrawerOpen(true)}
            >
              <Text h6>Settings</Text>
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div>
                <Tooltip
                  trigger="click"
                  content={'Share the URL with your teammates'}
                  placement={'bottom'}
                >
                  <Button auto rounded size="sm">
                    Invite players
                  </Button>
                </Tooltip>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '4px 20px',
                  borderLeft: `3px solid ${theme?.colors.accents2.value}`,
                  borderRight: `3px solid ${theme?.colors.accents2.value}`,
                }}
              >
                <Text h4>{userName}</Text>
                <Button
                  auto
                  rounded
                  bordered
                  size="xs"
                  style={{ width: 60 }}
                  onClick={() => {
                    setUserNameInput(userName)
                    setOpenModalForNameInput(true)
                  }}
                >
                  {openModalForNameInput ? (
                    <Loading
                      type="points-opacity"
                      color={isDark ? 'white' : 'primary'}
                      size="sm"
                    />
                  ) : (
                    <Text h6 weight={'normal'}>
                      Edit
                    </Text>
                  )}
                </Button>
              </div>

              <div>
                <ThemeSwitcher />
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            gridArea: 'table',
            display: 'grid',
            gridTemplateRows: isMobileView ? '1fr 60px 1fr' : '1fr 1fr 1fr',
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
                padding: 50,
              }}
            >
              <Text h4 weight={'light'}>
                Average
              </Text>
              <Text h2>{getAverage()}</Text>
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
