interface RoomTypeToModel {
  [key: string]: RoomModel
}

interface RoomModel {
  values: RoomValue[]
}

interface RoomValue {
  label: string
  value: number | null
}

export const roomTypeToModel: RoomTypeToModel = {
  planning: {
    values: [
      {
        label: '0',
        value: 0,
      },
      {
        label: '1',
        value: 1,
      },
      {
        label: '2',
        value: 2,
      },
      {
        label: '3',
        value: 3,
      },
      {
        label: '5',
        value: 5,
      },
      {
        label: '8',
        value: 8,
      },
      {
        label: '13',
        value: 13,
      },
      {
        label: '20',
        value: 20,
      },
      {
        label: '40',
        value: 40,
      },
      {
        label: '100',
        value: 100,
      },
      {
        label: '?',
        value: null,
      },
    ],
  },
  't-shirt': {
    values: [
      {
        label: 'xxs',
        value: 1,
      },
      {
        label: 'xs',
        value: 2,
      },
      {
        label: 's',
        value: 3,
      },
      {
        label: 'm',
        value: 4,
      },
      {
        label: 'l',
        value: 5,
      },
      {
        label: 'xl',
        value: 6,
      },
      {
        label: 'xxl',
        value: 7,
      },
    ],
  },
  confidence: {
    values: [
      {
        label: '1',
        value: 1,
      },
      {
        label: '2',
        value: 2,
      },
      {
        label: '3',
        value: 3,
      },
      {
        label: '4',
        value: 4,
      },
      {
        label: '5',
        value: 5,
      },
    ],
  },
}
