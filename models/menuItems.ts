import MenuItem from '../types/MenuItem'
import { RoomType } from '../types/RoomType'

export const menuItems: MenuItem[] = [
  {
    id: 1,
    buttonText: 'Story estimation',
    roomType: RoomType.STORY,
  },
  {
    id: 2,
    buttonText: 'T-shirt sizing',
    roomType: RoomType.T_SHIRT,
  },
  {
    id: 3,
    buttonText: 'Confidence vote',
    roomType: RoomType.CONFIDENCE,
  },
]
