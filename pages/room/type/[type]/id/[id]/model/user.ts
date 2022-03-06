import { CardValue } from './room-card'

export interface User {
  name: string
  id: string
  hasPickedCard: boolean
  pickedValue: CardValue | null
}
