import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NextUIProvider, createTheme } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

const lightTheme = createTheme({
  type: 'light',
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      background: 'rgb(24, 24, 24)',
    },
    shadows: {
      xs: '-4px 0 15px rgb(0 0 0 / 50%)',
      sm: '0 5px 20px -5px rgba(20, 20, 20, 0.3)',
      md: '0 8px 30px rgba(0, 0, 0, 0.7)',
      lg: '0 30px 60px rgba(0, 0, 0, 0.7)',
      xl: '0 40px 80px rgba(0, 0, 0, 0.7)',
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </NextThemesProvider>
  )
}

export default MyApp
