import { roomTypeToCardModel, CardValue } from '../model/room-card'
import React, { FunctionComponent } from 'react'
import { Socket } from 'socket.io-client'
import { Text, useTheme } from '@nextui-org/react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

type CardPickerProps = {
  roomType: string
  socket: Socket | undefined
  selectedValueId: string | null
  setSelectedValueId: (id: string | null) => void
}

type CardProps = {
  borderColor: string | undefined
  backgroundColor: string | undefined
  hoverBackgroundColor: string | undefined
}

const Card = styled.div<CardProps>`
  border: ${(props) => `4px solid ${props.borderColor}`};
  background: ${(props) => props.backgroundColor};
  cursor: pointer;
  border-radius: 10px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  &:hover {
    background: ${(props) => props.hoverBackgroundColor};
  }
`

export const CardPicker: FunctionComponent<CardPickerProps> = ({
  roomType,
  socket,
  selectedValueId,
  setSelectedValueId,
}) => {
  const { theme } = useTheme()
  const renderValueCards = () => {
    const roomModel = roomTypeToCardModel[roomType]

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
        <Card
          key={value.id}
          as={motion.div}
          animate={{ y: value.id === selectedValueId ? -12 : 0 }}
          whileHover={{
            y: -12,
            transition: { duration: 0.4, ease: 'easeOut' },
          }}
          onClick={() => onClick(socket, value)}
          borderColor={theme?.colors.primary.value}
          backgroundColor={
            value.id === selectedValueId
              ? theme?.colors.primary.value
              : 'transparent'
          }
          hoverBackgroundColor={
            value.id === selectedValueId
              ? theme?.colors.primary.value
              : theme?.colors.primaryLight.value
          }
        >
          <Text
            h3
            color={
              value.id === selectedValueId ? 'white' : theme?.colors.text.value
            }
            style={{ userSelect: 'none' }}
          >
            {value.label}
          </Text>
        </Card>
      )
    })
  }

  return (
    <div style={{ overflowX: 'scroll', paddingBottom: 16, paddingTop: 24 }}>
      <div style={{ display: 'flex', gap: 6 }}>{renderValueCards()}</div>
    </div>
  )
}
