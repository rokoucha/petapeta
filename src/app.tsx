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
import {
  SettingsProvider,
  useSettingsProvider,
} from './providers/settingsProvider'
import { useEffectOnce } from './hooks/useEffectOnce'

import { Footer } from './components/footer'
import { Header } from './components/header'

import { Landing } from './pages/landing'
import { Search } from './pages/search'
import { useEffect, useState } from 'react'
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
  const [settings] = useSettingsProvider()
  const { isSignedIn, setUp, setClientId } = useGoogleAPIProvider()
  const [openSettings, setOpenSettings] = useState(false)

  useEffectOnce(() => {
    setIsLoading(true)
    setUp().then(() => setIsLoading(false))
  })

  useEffect(() => {
    setClientId(settings.clientId)
  }, [settings.clientId])

  return (
    <>
      <Header openSettings={openSettings} setOpenSettings={setOpenSettings} />
      <Container component="main" maxWidth="md">
        {openSettings ? <Settings /> : isSignedIn ? <Search /> : <Landing />}
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
