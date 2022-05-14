import React, { useCallback } from 'react'
import { Box, Typography } from '@mui/material'
import { SignInWithGoogle } from '../components/signInWithGoogle'
import { useGoogleAPIProvider } from '../providers/googleAPIProvider'
import { useLoadingProvider } from '../providers/loadingProvider'
import { useSettingsProvider } from '../providers/settingsProvider'

export const Landing: React.FC = () => {
  const { signIn } = useGoogleAPIProvider()
  const [isLoading, setIsLoading] = useLoadingProvider()
  const [settings] = useSettingsProvider()

  const onSignInClick = useCallback(async () => {
    setIsLoading(true)
    await signIn()
    setIsLoading(false)
  }, [])

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        mt: 4,
      }}
    >
      <Typography component="h1" variant="h5">
        Search your Google Drive
      </Typography>
      <Box sx={{ mt: 2 }}>
        <SignInWithGoogle
          disabled={isLoading || settings.clientId === ''}
          onClick={onSignInClick}
        />
      </Box>
      {settings.clientId === '' && (
        <Typography sx={{ mt: 4 }}>
          Please set client id before sign in.
        </Typography>
      )}
    </Box>
  )
}
