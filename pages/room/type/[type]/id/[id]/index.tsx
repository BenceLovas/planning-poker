import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Modal, Text, Input, Button } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { roomTypeToModel } from './model/room-types'
import socketIOClient, { Socket } from 'socket.io-client'

export async function getServerSideProps() {
  return {
    props: {},
  }
}

function useSocket(url: string, roomId: string) {
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    const socketIo = socketIOClient(url, {
      query: {
        roomId,
      },
    })

    setSocket(socketIo)

    function cleanup() {
      socketIo.disconnect()
    }
    return cleanup

    // should only run once and not on every re-render,
    // so pass an empty array
  }, [])

  return socket
}

const Room: NextPage = () => {
  const router = useRouter()
  const [openModalForNameInput, setOpenModalForNameInput] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const socket = useSocket('http://localhost:3000', router.query.id as string)

  useEffect(() => {
    const displayNameFromLocalStorage = localStorage.getItem('displayName')
    if (displayNameFromLocalStorage === null) {
      setOpenModalForNameInput(true)
    } else {
      setDisplayName(displayNameFromLocalStorage)
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('update', (payload) => {
        console.log(payload)
      })
    }
  }, [socket])

  const closeModal = () => {
    if (displayName !== null) {
      localStorage.setItem('displayName', displayName)
      setOpenModalForNameInput(false)
    }
  }

  const renderValueCards = () => {
    const roomType: string = router.query.type as string
    const roomModel = roomTypeToModel[roomType]

    return roomModel.values.map((value) => {
      return (
        <Button key={value.label} bordered shadow auto>
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
      <h1>{displayName}</h1>
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
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            onClick={closeModal}
            rounded
            disabled={!Boolean(displayName?.length)}
          >
            Continue to game
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Room
