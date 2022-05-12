import type React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline } from '@mui/material'
import { GoogleApiProvider, useGoogleAPIProvider } from './googleAPIProvider'
import { LoadingProvider, useLoadingProvider } from './loadingProvider'
import { useEffectOnce } from '../hooks/useEffectOnce'

import { Footer } from './footer'
import { Header } from './header'

import { Landing } from '../pages/landing'
import { Search } from '../pages/search'

const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
    fontFamily: 'sans-serif',
  },
  palette: {
    mode: 'dark',
  },
})

const Contents: React.FC = () => {
  const { isSignedIn, setUp } = useGoogleAPIProvider()
  const [_, setIsLoading] = useLoadingProvider()

  useEffectOnce(() => {
    setIsLoading(true)
    setUp().then(() => setIsLoading(false))
  })

  return (
    <>
      <Header />
      <Container component="main" maxWidth="md">
        {isSignedIn ? <Search /> : <Landing />}
      </Container>
      <Footer />
    </>
  )
}

export const App: React.FC = () => (
  <LoadingProvider>
    <GoogleApiProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Contents />
      </ThemeProvider>
    </GoogleApiProvider>
  </LoadingProvider>
)
