interface RoomTypeToModel {
  [key: string]: RoomModel
}

interface RoomModel {
  values: RoomValue[]
}

interface RoomValue {
  label: string
  value: number | null
  id: string
}

export const roomTypeToModel: RoomTypeToModel = {
  story: {
    values: [
      {
        label: '0',
        value: 0,
        id: '1',
      },
      {
        label: '1',
        value: 1,
        id: '2',
      },
      {
        label: '2',
        value: 2,
        id: '3',
      },
      {
        label: '3',
        value: 3,
        id: '4',
      },
      {
        label: '5',
        value: 5,
        id: '5',
      },
      {
        label: '8',
        value: 8,
        id: '6',
      },
      {
        label: '13',
        value: 13,
        id: '7',
      },
      {
        label: '20',
        value: 20,
        id: '8',
      },
      {
        label: '40',
        value: 40,
        id: '9',
      },
      {
        label: '100',
        value: 100,
        id: '10',
      },
      {
        label: '?',
        value: null,
        id: '11',
      },
    ],
  },
  't-shirt': {
    values: [
      {
        label: 'xxs',
        value: 1,
        id: '1',
      },
      {
        label: 'xs',
        value: 2,
        id: '2',
      },
      {
        label: 's',
        value: 3,
        id: '3',
      },
      {
        label: 'm',
        value: 4,
        id: '4',
      },
      {
        label: 'l',
        value: 5,
        id: '5',
      },
      {
        label: 'xl',
        value: 6,
        id: '6',
      },
      {
        label: 'xxl',
        value: 7,
        id: '7',
      },
    ],
  },
  confidence: {
    values: [
      {
        label: '1',
        value: 1,
        id: '1',
      },
      {
        label: '2',
        value: 2,
        id: '2',
      },
      {
        label: '3',
        value: 3,
        id: '3',
      },
      {
        label: '4',
        value: 4,
        id: '4',
      },
      {
        label: '5',
        value: 5,
        id: '5',
      },
    ],
  },
}
