import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Text, Button, useTheme, Avatar } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'
import { CardPicker } from '../../../../../../components/CardPicker'
import { ThemeSwitcher } from '../../../../../../components/ThemeSwitcher'
import { IoPerson } from 'react-icons/io5'
import NameInputModal from '../../../../../../components/NameInputModal'
import { useSocket } from '../../../../../../hooks/useSocket'
import User from '../../../../../../model/user'
import { motion } from 'framer-motion'

// this is needed to keep the router query up to date on page refresh
export async function getServerSideProps() {
  return {
    props: {},
  }
}

const Room: NextPage = () => {
  const router = useRouter()
  const [openModalForNameInput, setOpenModalForNameInput] = useState(false)
  const [userName, setUserName] = useState('')
  const [userNameInput, setUserNameInput] = useState('')
  const [userId, setUserId] = useState('')
  const socket = useSocket(
    location.origin.replace(/^http/, 'ws'),
    router.query.id as string,
    userName,
    userId
  )
  const [usersInRoom, setUsersInRoom] = useState<User[]>([])
  const [selectedValueId, setSelectedValueId] = useState<string | null>(null)
  const { theme } = useTheme()
  const [isCardPickerHidden, setCardPickerHidden] = useState(false)
  const [controlButtonState, setControlButtonState] = useState('reveal')

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
      socket.on('card-reveal', (payload) => {
        setUsersInRoom(payload)
        setControlButtonState('reset')
      })
      socket.on('card_reset', (payload) => {
        setUsersInRoom(payload)
        setSelectedValueId(null)
        setCardPickerHidden(false)
        setControlButtonState('reveal')
      })

      socket.on('initiate-reveal-countdown', () => {
        setCardPickerHidden(true)
        setControlButtonState('count-down')
      })
    }
  }, [socket])

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
    if (controlButtonState === 'hidden') {
      return null
    }
    switch (controlButtonState) {
      case 'hidden':
        return null
      case 'reveal':
        return (
          <Button
            rounded
            onClick={() => {
              socket?.emit('initiate-reveal-countdown')
            }}
            disabled={!usersInRoom.some((user) => user.hasPickedCard)}
          >
            Reveal Cards
          </Button>
        )
      case 'reset':
        return (
          <Button rounded onClick={() => socket?.emit('card-reset')}>
            New Game
          </Button>
        )

      case 'count-down': {
        return <div style={{ fontSize: 50 }}>🥁</div>
      }
      default:
        return null
    }
  }

  const renderTableUser = (user: User) => {
    return (
      <div
        key={user.id}
        style={{
          maxWidth: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            border: `3px solid ${
              user.hasPickedCard
                ? theme?.colors.primaryDark.value
                : theme?.colors.accents2.value
            }`,
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
            position: 'absolute',
            backfaceVisibility: 'hidden',
            transition: 'transform ease 500ms',
            zIndex: 2,
            transform: user.pickedValue ? 'rotateY(0deg)' : 'rotateY(180deg)',
          }}
        >
          {user.pickedValue && (
            <Text h3 color="white">
              {user.pickedValue.label}
            </Text>
          )}
        </div>
        <div
          style={{
            border: `3px solid ${
              user.hasPickedCard
                ? theme?.colors.primaryDark.value
                : theme?.colors.accents2.value
            }`,
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
            backfaceVisibility: 'hidden',
            transition: 'transform ease 500ms',
            transform: user.pickedValue ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        ></div>
        <Text h5 style={{ textAlign: 'center', wordBreak: 'break-word' }}>
          {user.name}
        </Text>
      </div>
    )
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
          <ThemeSwitcher />
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
            gap: 12,
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
              index % 2 !== 0 ? renderTableUser(user) : null
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
              index % 2 === 0 ? renderTableUser(user) : null
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
            animate={{ y: isCardPickerHidden ? 150 : 0 }}
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
