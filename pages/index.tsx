import type { NextPage } from 'next'
import Head from 'next/head'
import { Button } from '@nextui-org/react'
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
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Row gap={1} justify="center" align="center">
            <Button
              size="lg"
              rounded
              shadow
              onClick={() => router.push(`/room/type/planning/id/${uuid()}`)}
            >
              Create Planning Room
            </Button>
          </Row>
          <Spacer y={1} />
          <Row gap={1} justify="center" align="center">
            <Button
              size="lg"
              rounded
              shadow
              onClick={() => router.push(`/room/type/t-shirt/id/${uuid()}`)}
            >
              Create T-Shit Sizing Room
            </Button>
          </Row>
          <Spacer y={1} />
          <Row gap={1} justify="center" align="center">
            <Button
              size="lg"
              rounded
              shadow
              onClick={() => router.push(`/room/type/confidence/id/${uuid()}`)}
            >
              Create Confidence Room
            </Button>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Home
