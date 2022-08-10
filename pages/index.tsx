import type { NextPage } from 'next'
import Head from 'next/head'
import { Button, Text, useTheme } from '@nextui-org/react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import { Row, Spacer } from '@nextui-org/react'
import { ThemeSwitcher } from '../components/ThemeSwitcher'
import { menuItems } from '../models/menuItems'
import { Fragment } from 'react'

const Home: NextPage = () => {
  const router = useRouter()
  const { theme } = useTheme()

  return (
    <>
      <Head>
        <title>Planning Poker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{
          padding: '23px 20px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
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
          <Text h2 b style={{ textAlign: 'center', letterSpacing: '0.03rem' }}>
            Create room
          </Text>
          <Spacer y={4} />
          {menuItems.map((menuItem) => (
            <Fragment key={menuItem.id}>
              <Row justify="center" align="center">
                <Button
                  size="xl"
                  rounded
                  onClick={() =>
                    router.push(`/room/type/${menuItem.roomType}/id/${uuid()}`)
                  }
                  flat
                  ripple={false}
                  css={{
                    background: theme?.colors.accents2.value,
                    color: theme?.colors.text.value,
                    '&:hover': {
                      background: theme?.colors.accents4.value,
                    },
                  }}
                >
                  {menuItem.buttonText}
                </Button>
              </Row>
              <Spacer y={1} />
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home
