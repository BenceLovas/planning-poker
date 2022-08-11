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
  isDark: boolean | undefined
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
  background: ${(props) =>
    props.isDark ? 'rgba(0,0,0,.1)' : 'rgba(0,0,0,.02)'};
  border: ${(props) => `2px solid ${props.theme.colors.accents3.value}`};
  position: absolute;
  z-index: 2;
  transform: ${(props) =>
    props.gameState === 'reveal' ? 'rotateY(0deg)' : 'rotateY(180deg)'};
`
const CardBack = styled(Card)<CardProps>`
  background: ${(props) => {
    if (props.isFilled) {
      return props.theme.colors.primary.value
    }
    if (props.isDark) {
      return 'rgba(0,0,0,.1)'
    } else {
      return 'rgba(0,0,0,.02)'
    }
  }};
  border: ${(props) =>
    `2px solid ${
      props.isFilled
        ? props.theme.colors.primarySolidHover.value
        : props.theme.colors.accents3.value
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
  const { theme, isDark } = useTheme()

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
          isDark={isDark}
        >
          {gameState === 'reveal' && user.pickedValue && (
            <Text h3>{user.pickedValue.label}</Text>
          )}
        </CardFace>
        <CardBack
          gameState={gameState}
          isFilled={user.hasPickedCard}
          theme={theme}
          isDark={isDark}
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
