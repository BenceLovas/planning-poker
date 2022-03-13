import React, { FunctionComponent } from 'react'
import { Text, useTheme, Theme } from '@nextui-org/react'
import styled from 'styled-components'
import { GameState } from '../types/GameState'
import User from '../types/User'
import {
  BsSuitClubFill,
  BsSuitDiamondFill,
  BsSuitHeartFill,
  BsSuitSpadeFill,
} from 'react-icons/bs'

type CardProps = {
  theme: Theme
  isFilled: boolean
  gameState: GameState
}

const Card = styled.div<CardProps>`
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
  background: transparent;
  border: ${(props) => `3px solid ${props.theme.colors.accents2.value}`};
  position: absolute;
  z-index: 2;
  transform: ${(props) =>
    props.gameState === 'reveal' ? 'rotateY(0deg)' : 'rotateY(180deg)'};
`
const CardBack = styled(Card)<CardProps>`
  background: ${(props) =>
    props.isFilled ? props.theme.colors.primary.value : 'transparent'};
  border: ${(props) =>
    `3px solid ${
      props.isFilled
        ? props.theme.colors.primaryDark.value
        : props.theme.colors.accents2.value
    }`};
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

const suitToIcon = {
  clubs: <BsSuitClubFill key={1} size={22} color={'white'} />,
  diamonds: <BsSuitDiamondFill key={2} size={22} color={'white'} />,
  hearts: <BsSuitHeartFill key={3} size={20} color={'white'} />,
  spades: <BsSuitSpadeFill key={4} size={22} color={'white'} />,
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
            <Text h3>{user.pickedValue.label}</Text>
          )}
        </CardFace>
        <CardBack
          gameState={gameState}
          isFilled={user.hasPickedCard}
          theme={theme}
        >
          {user.hasPickedCard && suitToIcon[user.suit]}
        </CardBack>
      </div>

      {!nameOnTop && (
        <Text h5 style={{ textAlign: 'center', wordBreak: 'break-word' }}>
          {user.name}
        </Text>
      )}
    </CardContainer>
  )
}
