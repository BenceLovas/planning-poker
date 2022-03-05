import type { NextPage } from 'next'
import Head from 'next/head'
import { Button, Text } from '@nextui-org/react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import { Row, Spacer } from '@nextui-org/react'
import { useTheme as useNextTheme } from 'next-themes'
import { Switch, useTheme } from '@nextui-org/react'

const Home: NextPage = () => {
  const router = useRouter()
  const { setTheme } = useNextTheme()
  const { isDark, type } = useTheme()

  return (
    <>
      <Head>
        <title>Planning Poker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        The current theme is: {type}
        <Switch
          checked={isDark}
          onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text h2 b style={{ textAlign: 'center' }}>
            Create room
          </Text>
          <Spacer x={2} />
          <Row justify="center" align="center">
            <Button
              size="xl"
              rounded
              shadow
              onClick={() => router.push(`/room/type/story/id/${uuid()}`)}
            >
              Story Estimation
            </Button>
          </Row>
          <Spacer x={1} />
          <Row justify="center" align="center">
            <Button
              size="xl"
              rounded
              shadow
              onClick={() => router.push(`/room/type/t-shirt/id/${uuid()}`)}
            >
              T-Shit Sizing
            </Button>
          </Row>
          <Spacer x={1} />
          <Row justify="center" align="center">
            <Button
              size="xl"
              rounded
              shadow
              onClick={() => router.push(`/room/type/confidence/id/${uuid()}`)}
            >
              Confidence Vote
            </Button>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Home
