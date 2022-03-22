import MenuItem from '../types/MenuItem'
import { RoomType } from '../types/RoomType'

export const menuItems: MenuItem[] = [
  {
    buttonText: 'Story estimation',
    roomType: RoomType.STORY,
  },
  {
    buttonText: 'T-shirt sizing',
    roomType: RoomType.T_SHIRT,
  },
  {
    buttonText: 'Confidence vote',
    roomType: RoomType.CONFIDENCE,
  },
]
