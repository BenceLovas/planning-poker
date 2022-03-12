import React, { FunctionComponent } from 'react'
import { Text, useTheme, Theme } from '@nextui-org/react'
import styled from 'styled-components'
import User from '../types/user'
import { GameState } from '../types/GameState'

type CardProps = {
  theme: Theme
  isFilled: boolean
  gameState: GameState
}

const Card = styled.div<CardProps>`
  border: ${(props) =>
    `3px solid ${
      props.isFilled
        ? props.theme.colors.primaryDark.value
        : props.theme.colors.accents2.value
    }`};
  background: ${(props) =>
    props.isFilled ? props.theme.colors.primary.value : 'transparent'};
  border-radius: 10px;
  width: 60px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  backface-visibility: hidden;
  transition: transform ease 500ms;
`

const CardFace = styled(Card)<CardProps>`
  position: absolute;
  z-index: 2;
  transform: ${(props) =>
    props.gameState === 'reveal' ? 'rotateY(0deg)' : 'rotateY(180deg)'};
`
const CardBack = styled(Card)<CardProps>`
  transform: ${(props) =>
    props.gameState === 'reveal' ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`

const CardContainer = styled.div`
  max-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`
type TableCardProps = {
  user: User
  gameState: GameState
  nameOnTop: boolean
}

export const TableCard: FunctionComponent<TableCardProps> = ({
  user,
  gameState,
  nameOnTop,
}) => {
  const { theme } = useTheme()

  return (
    <CardContainer key={user.id}>
      {nameOnTop && (
        <Text h5 style={{ textAlign: 'center', wordBreak: 'break-word' }}>
          {user.name}
        </Text>
      )}
      <div>
        <CardFace
          gameState={gameState}
          isFilled={user.hasPickedCard}
          theme={theme}
        >
          {gameState === 'reveal' && user.pickedValue && (
            <Text h3 color="white">
              {user.pickedValue.label}
            </Text>
          )}
        </CardFace>
        <CardBack
          gameState={gameState}
          isFilled={user.hasPickedCard}
          theme={theme}
        ></CardBack>
      </div>

      {!nameOnTop && (
        <Text h5 style={{ textAlign: 'center', wordBreak: 'break-word' }}>
          {user.name}
        </Text>
      )}
    </CardContainer>
  )
}
