import type { NextPage } from 'next'
import Head from 'next/head'
import { Button, Text, Row, Spacer, styled } from '@nextui-org/react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import { ThemeSwitcher } from '../components/ThemeSwitcher'
import { menuItems } from '../models/menuItems'
import { Fragment } from 'react'

// this is an ugly hack to overwrite the styles (could not find any better working solution)
// the only other solution was to use the 'css' prop on the Button component which made the button flicker (original color first and suddenly changed to the custom one)
const MenuButton = styled(Button, {
  background: '$accents2 !important',
  color: '$text !important',
  '&:hover': {
    background: '$accents4 !important',
  },
})

const Home: NextPage = () => {
  const router = useRouter()

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
                <MenuButton
                  size="xl"
                  rounded
                  onClick={() =>
                    router.push(`/room/type/${menuItem.roomType}/id/${uuid()}`)
                  }
                  flat
                  ripple={false}
                >
                  {menuItem.buttonText}
                </MenuButton>
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
