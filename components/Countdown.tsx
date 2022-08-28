import React, { FunctionComponent, useState, useEffect } from 'react'
import { Text, useTheme } from '@nextui-org/react'
import { motion } from 'framer-motion'

export const Countdown: FunctionComponent = () => {
  const { isDark } = useTheme()
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

  return (
    <div
      style={{
        position: 'relative',
        width: 80,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text h3>{counter}</Text>
      <svg
        height="80"
        width="80"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <motion.circle
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: 240 }}
          transition={{
            duration: 0.66 * 3,
            ease: [0.17, 0.67, 0.7, 0.17],
          }}
          cx="40"
          cy="40"
          r="32"
          stroke={isDark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.07)'}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={250}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
