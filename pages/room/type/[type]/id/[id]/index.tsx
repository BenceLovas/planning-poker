import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Text, Button, useTheme, Avatar } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'
import { CardPicker } from './components/CardPicker'
import { ThemeSwitcher } from '../../../../../components/ThemeSwitcher'
import { IoPerson } from 'react-icons/io5'
import { NameInputModal } from './components/NameInputModal'
import { useSocket } from '../../../../../hooks/useSocket'
import { User } from './model/user'

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
        <div style={{ gridArea: 'users' }}>
          <Button onClick={() => socket?.emit('card-reveal')}>
            Reveal Cards
          </Button>
          <Button onClick={() => socket?.emit('card-reset')}>
            Reset Cards
          </Button>
          <Text h3>Users</Text>
          <div style={{ display: 'flex', gap: 10 }}>
            {usersInRoom.map((user) => {
              return (
                <div key={user.id}>
                  <div
                    style={{
                      border: `3px solid ${theme?.colors.accents2.value}`,
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
                      transform: user.pickedValue
                        ? 'rotateY(0deg)'
                        : 'rotateY(180deg)',
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
                      border: `3px solid ${theme?.colors.accents2.value}`,
                      background: user.hasPickedCard
                        ? theme?.colors.primaryDark.value
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
                      transform: user.pickedValue
                        ? 'rotateY(180deg)'
                        : 'rotateY(0deg)',
                    }}
                  ></div>
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
          <CardPicker
            roomType={router.query.type as string}
            socket={socket}
            selectedValueId={selectedValueId}
            setSelectedValueId={setSelectedValueId}
          />
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
