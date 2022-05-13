import React, { useCallback } from 'react'
import {
  AppBar,
  Button,
  LinearProgress,
  Toolbar,
  Typography,
} from '@mui/material'
import { useGoogleAPIProvider } from '../providers/googleAPIProvider'
import { useLoadingProvider } from '../providers/loadingProvider'

type HeaderProps = {
  openSettings: boolean
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>
}

export const Header: React.FC<HeaderProps> = ({
  openSettings,
  setOpenSettings,
}) => {
  const { isSignedIn, signOut } = useGoogleAPIProvider()
  const [isLoading, setIsLoading] = useLoadingProvider()

  const onSignOutClick = useCallback(async () => {
    setIsLoading(true)
    await signOut()
    setIsLoading(false)
  }, [])

  const onSettingsClick = useCallback(() => setOpenSettings((p) => !p), [])

  return (
    <AppBar
      position="relative"
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar
        sx={{
          flexWrap: 'wrap',
          maxWidth: 'md',
          ml: 'auto',
          mr: 'auto',
          width: '100%',
        }}
      >
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          PetaPeta
        </Typography>
        {isSignedIn ? (
          <>
            <Button
              onClick={onSettingsClick}
              variant={openSettings ? 'contained' : 'outlined'}
            >
              Settings
            </Button>
            <Button
              color="error"
              onClick={onSignOutClick}
              sx={{ ml: 1 }}
              variant="outlined"
            >
              Sign Out
            </Button>
          </>
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
