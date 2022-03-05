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

      <main>
        <Button>Create Planning Room</Button>
        <Button>Create Confidence Room</Button>
      </main>

      <footer></footer>
    </>
  )
}

export default Home
