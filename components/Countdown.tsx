import React, { FunctionComponent, useState, useEffect } from 'react'
import { Text } from '@nextui-org/react'

export const Countdown: FunctionComponent = () => {
  const [counter, setCounter] = useState(3)

  useEffect(() => {
    if (counter === 1) {
      return
    }
    const intervalId = setTimeout(() => {
      setCounter(counter - 1)
      // this should be a one second (1000ms) countdown but making the timer faster makes UX better
    }, 680)

    return () => clearTimeout(intervalId)
  })

  return <Text h3>{counter}</Text>
}
