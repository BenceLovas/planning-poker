import React, { FunctionComponent } from 'react'
import { useTheme, Switch, Text } from '@nextui-org/react'
import { useTheme as useNextTheme } from 'next-themes'

export const ThemeSwitcher: FunctionComponent = ({}) => {
  const { setTheme } = useNextTheme()
  const { isDark } = useTheme()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Text h6 weight={isDark ? 'light' : 'bold'}>
        Light
      </Text>
      <Switch
        checked={isDark}
        size="sm"
        onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
      />
      <Text h6 weight={isDark ? 'bold' : 'light'}>
        Dark
      </Text>
    </div>
  )
}
