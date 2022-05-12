import { Link, Typography } from '@mui/material'
import type React from 'react'

export const Footer: React.FC = () => (
  <Typography
    variant="body2"
    color="text.secondary"
    align="center"
    mt={8}
    mb={4}
  >
    PetaPeta - Google Drive search tool
    <br />
    <Link color="inherit" href="https://github.com/rokoucha/petapeta">
      source
    </Link>
  </Typography>
)
