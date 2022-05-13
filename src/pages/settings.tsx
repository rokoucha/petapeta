import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from '@mui/material'
import React, { useCallback } from 'react'
import { useLoadingProvider } from '../providers/loadingProvider'
import { useSettingsProvider } from '../providers/settingsProvider'

export const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useLoadingProvider()
  const [settings, setSettings] = useSettingsProvider()

  const onTrashedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(true)
      setSettings((p) => ({ ...p, trashed: e.target.checked }))
      setIsLoading(false)
    },
    [],
  )

  const onSearchByNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(true)
      setSettings((p) => ({ ...p, searchByName: e.target.checked }))
      setIsLoading(false)
    },
    [],
  )

  const onSearchByFullTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(true)
      setSettings((p) => ({ ...p, searchByFullText: e.target.checked }))
      setIsLoading(false)
    },
    [],
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mt: 4,
      }}
    >
      <Typography component="h1" variant="h5">
        Settings
      </Typography>
      <Typography component="h2" variant="h6" sx={{ mt: 1 }}>
        Search options
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={settings.trashed}
              disabled={isLoading}
              onChange={onTrashedChange}
            />
          }
          label="Search in the trash"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.searchByName}
              disabled={isLoading}
              onChange={onSearchByNameChange}
            />
          }
          label="Search by name"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.searchByFullText}
              disabled={isLoading}
              onChange={onSearchByFullTextChange}
            />
          }
          label="Search by full text"
        />
      </FormGroup>
    </Box>
  )
}
