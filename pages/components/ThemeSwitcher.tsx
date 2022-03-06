import React, { FunctionComponent } from 'react'
import { useTheme, Switch } from '@nextui-org/react'
import { useTheme as useNextTheme } from 'next-themes'
import { IoMoon, IoSunny } from 'react-icons/io5'

export const ThemeSwitcher: FunctionComponent = ({}) => {
  const { setTheme } = useNextTheme()
  const { isDark } = useTheme()

  return (
    <Switch
      checked={isDark}
      size="xl"
      iconOn={<IoMoon />}
      iconOff={<IoSunny />}
      onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
    />
  )
}
