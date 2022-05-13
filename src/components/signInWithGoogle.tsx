import type React from 'react'
import { Button, type ButtonProps, Typography } from '@mui/material'
import { GoogleIcon } from './googeIcon'

export const SignInWithGoogle: React.FC<ButtonProps> = (props) => (
  <Button
    size="small"
    sx={{
      backgroundColor: '#4285F4',
      color: '#FFFFFF',
      borderRadius: '2px',
      p: 0,
    }}
    {...props}
  >
    <GoogleIcon />
    <Typography
      sx={{
        fontFamily: 'Roboto',
        fontSize: '1rem',
        fontWeight: 500,
        ml: 1,
        mr: 1,
      }}
      noWrap
    >
      Sign in with Google
    </Typography>
  </Button>
)
