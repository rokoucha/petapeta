import type React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline } from '@mui/material'
import {
  GoogleApiProvider,
  useGoogleAPIProvider,
} from './providers/googleAPIProvider'
import {
  LoadingProvider,
  useLoadingProvider,
} from './providers/loadingProvider'
import { SettingsProvider } from './providers/settingsProvider'
import { useEffectOnce } from './hooks/useEffectOnce'

import { Footer } from './components/footer'
import { Header } from './components/header'

import { Landing } from './pages/landing'
import { Search } from './pages/search'
import { useState } from 'react'
import { Settings } from './pages/settings'

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
  const [_, setIsLoading] = useLoadingProvider()
  const [openSettings, setOpenSettings] = useState(false)
  const { isSignedIn, setUp } = useGoogleAPIProvider()

  useEffectOnce(() => {
    setIsLoading(true)
    setUp().then(() => setIsLoading(false))
  })

  return (
    <>
      <Header openSettings={openSettings} setOpenSettings={setOpenSettings} />
      <Container component="main" maxWidth="md">
        {!isSignedIn ? <Landing /> : openSettings ? <Settings /> : <Search />}
      </Container>
      <Footer />
    </>
  )
}

export const App: React.FC = () => (
  <LoadingProvider>
    <SettingsProvider>
      <GoogleApiProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Contents />
        </ThemeProvider>
      </GoogleApiProvider>
    </SettingsProvider>
  </LoadingProvider>
)
