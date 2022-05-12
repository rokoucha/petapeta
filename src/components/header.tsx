import React, { useCallback } from 'react'
import {
  AppBar,
  Button,
  LinearProgress,
  Toolbar,
  Typography,
} from '@mui/material'
import { useGoogleAPIProvider } from './googleAPIProvider'
import { useLoadingProvider } from './loadingProvider'

export const Header: React.FC = () => {
  const { isSignedIn, signOut } = useGoogleAPIProvider()
  const [isLoading, setIsLoading] = useLoadingProvider()

  const onSignOutClick = useCallback(async () => {
    setIsLoading(true)
    await signOut()
    setIsLoading(false)
  }, [])

  return (
    <AppBar
      position="relative"
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar
        sx={{
          flexWrap: 'wrap',
          ml: 'auto',
          mr: 'auto',
          maxWidth: 'md',
          width: '100%',
        }}
      >
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          PetaPeta
        </Typography>
        {isSignedIn ? (
          <Button variant="outlined" color="error" onClick={onSignOutClick}>
            Sign Out
          </Button>
        ) : (
          <></>
        )}
      </Toolbar>
      <LinearProgress
        sx={{ width: '100%', visibility: isLoading ? 'visible' : 'hidden' }}
      />
    </AppBar>
  )
}
