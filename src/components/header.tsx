import React, { useCallback } from 'react'
import {
  AppBar,
  Button,
  LinearProgress,
  Toolbar,
  Typography,
} from '@mui/material'
import { useLoadingProvider } from '../providers/loadingProvider'

type HeaderProps = {
  openSettings: boolean
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>
}

export const Header: React.FC<HeaderProps> = ({
  openSettings,
  setOpenSettings,
}) => {
  const [isLoading] = useLoadingProvider()

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
        <Button
          onClick={onSettingsClick}
          variant={openSettings ? 'contained' : 'outlined'}
        >
          Settings
        </Button>
      </Toolbar>
      <LinearProgress
        sx={{ width: '100%', visibility: isLoading ? 'visible' : 'hidden' }}
      />
    </AppBar>
  )
}
