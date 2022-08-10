import roomTypeToCardDeck from '../models/roomTypeToCardDeck'
import React, { FunctionComponent } from 'react'
import { Socket } from 'socket.io-client'
import { Text, useTheme, Theme } from '@nextui-org/react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import CardValue from '../types/CardValue'
import { RoomType } from '../types/RoomType'

type CardPickerProps = {
  roomType: RoomType
  socket: Socket | undefined
  selectedValueId: string | null
  setSelectedValueId: (id: string | null) => void
}

type CardProps = {
  theme: Theme
  selected: boolean
}

const Card = styled.div<CardProps>`
  flex: 0 0 auto;
  border: ${(props) =>
    `3px solid ${
      props.selected
        ? props.theme.colors.primarySolidHover.value
        : props.theme.colors.accents2.value
    }`};
  background: ${(props) =>
    props.selected ? props.theme.colors.primary.value : 'transparent'};
  cursor: pointer;
  border-radius: 10px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  box-shadow: ${(props) =>
    props.selected
      ? props.theme.shadows.md.value
      : props.theme.shadows.sm.value};
  &:hover {
    background: ${(props) =>
      props.selected ? props.theme.colors.primary.value : 'trasparent'};
    box-shadow: ${(props) => props.theme.shadows.md.value};
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
    const cardDeck = roomTypeToCardDeck[roomType]

    const onClick = (socket: Socket | undefined, value: CardValue) => {
      if (value.id !== selectedValueId) {
        if (socket) {
          socket.emit('value_update', {
            value,
          })
        }
        setSelectedValueId(value.id)
      } else {
        if (socket) {
          socket.emit('value_update', {
            value: null,
          })
        }
        setSelectedValueId(null)
      }
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          padding: 20,
        }}
      >
        {cardDeck.values.map((value: CardValue) => {
          return (
            <Card
              key={value.id}
              as={motion.div}
              animate={{ y: value.id === selectedValueId ? -8 : 0 }}
              whileHover={{
                y: -8,
                transition: { duration: 0.4, ease: 'easeOut' },
              }}
              onClick={() => onClick(socket, value)}
              theme={theme}
              selected={value.id === selectedValueId}
            >
              <Text
                h3
                color={
                  value.id === selectedValueId
                    ? 'white'
                    : theme?.colors.text.value
                }
                css={{
                  userSelect: 'none',
                }}
              >
                {value.label}
              </Text>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ padding: '0px 40px 0px 40px', maxWidth: '100vw' }}>
      <div style={{ padding: '44px 0px 36px 0px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 6 }}>{renderValueCards()}</div>
      </div>
    </div>
  )
}
