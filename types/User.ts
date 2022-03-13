import CardValue from './CardValue'

export default interface User {
  name: string
  id: string
  hasPickedCard: boolean
  pickedValue: CardValue | null
  suit: 'clubs' | 'diamonds' | 'hearts' | 'spades'
}
