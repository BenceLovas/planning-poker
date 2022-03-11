import type { NextPage } from 'next'
import Head from 'next/head'
import { Button, Text } from '@nextui-org/react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import { Row, Spacer } from '@nextui-org/react'
import { ThemeSwitcher } from '../components/ThemeSwitcher'

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Planning Poker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ padding: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <ThemeSwitcher />
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
          <Spacer y={4} />
          <Row justify="center" align="center">
            <Button
              size="xl"
              rounded
              onClick={() => router.push(`/room/type/story/id/${uuid()}`)}
              flat
              ripple={false}
              css={{
                background: '$accents2',
                color: '$text',
              }}
            >
              Story estimation
            </Button>
          </Row>
          <Spacer y={1} />
          <Row justify="center" align="center">
            <Button
              size="xl"
              rounded
              onClick={() => router.push(`/room/type/t-shirt/id/${uuid()}`)}
              ripple={false}
              css={{
                background: '$accents2',
                color: '$text',
              }}
            >
              T-shit sizing
            </Button>
          </Row>
          <Spacer y={1} />
          <Row justify="center" align="center">
            <Button
              size="xl"
              rounded
              onClick={() => router.push(`/room/type/confidence/id/${uuid()}`)}
              ripple={false}
              css={{
                background: '$accents2',
                color: '$text',
              }}
            >
              Confidence vote
            </Button>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Home
