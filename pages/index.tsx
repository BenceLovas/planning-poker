import type { NextPage } from 'next'
import Head from 'next/head'
import { Button } from '@nextui-org/react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Planning Poker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <Button
          size="lg"
          rounded
          onClick={() => router.push(`/room/type/planning/id/${uuid()}`)}
        >
          Create Planning Room
        </Button>
        <Button
          size="lg"
          rounded
          onClick={() => router.push(`/room/type/t-shirt/id/${uuid()}`)}
        >
          Create T-Shit Sizing Room
        </Button>
        <Button
          size="lg"
          rounded
          onClick={() => router.push(`/room/type/confidence/id/${uuid()}`)}
        >
          Create Confidence Room
        </Button>
      </main>

      <footer></footer>
    </>
  )
}

export default Home
