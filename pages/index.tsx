import type { NextPage } from 'next'
import Head from 'next/head'
import { Button } from '@nextui-org/react'

const Home: NextPage = () => {
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
        <Button size="lg" rounded>
          Create Planning Room
        </Button>
        <Button size="lg" rounded>
          Create T-Shit Sizing Room
        </Button>
        <Button size="lg" rounded>
          Create Confidence Room
        </Button>
      </main>

      <footer></footer>
    </>
  )
}

export default Home
