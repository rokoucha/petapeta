import { CreateNewFolder, Delete, Folder } from '@mui/icons-material'
import {
  Avatar,
  Box,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useEffectOnce } from '../hooks/useEffectOnce'
import { useLoadingProvider } from '../providers/loadingProvider'
import { useSettingsProvider } from '../providers/settingsProvider'

export const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useLoadingProvider()
  const [settings, setSettings] = useSettingsProvider()
  const [parents, setParents] = useState<gapi.client.drive.File[]>([])
  const [newParent, setNewParent] = useState('')

  useEffectOnce(() => {
    ;(async () => {
      setIsLoading(true)

      let res: gapi.client.Response<gapi.client.drive.File>[]
      try {
        res = await Promise.all(
          settings.parents.map((p) =>
            gapi.client.drive.files.get({ fileId: p }),
          ),
        )
      } catch (e) {
        console.error(e)

        return
      }

      setParents(res.map((r) => r.result))

      setIsLoading(false)
    })()
  })

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

  const onNewParentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNewParent(e.target.value),
    [],
  )

  const onNewParentKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter' || isLoading) return

      e.preventDefault()

      onNewParentClick()
    },
    [isLoading, newParent, settings.parents],
  )

  const onNewParentClick = useCallback(async () => {
    if (newParent === '' || settings.parents.includes(newParent)) {
      return
    }

    setIsLoading(true)

    let res: gapi.client.Response<gapi.client.drive.File>
    try {
      res = await gapi.client.drive.files.get({ fileId: newParent })
    } catch (e) {
      console.error(e)

      setIsLoading(false)
      return
    }

    setSettings((p) => ({ ...p, parents: [...p.parents, newParent] }))
    setParents((p) => [...p, res.result])

    setNewParent('')

    setIsLoading(false)
  }, [newParent, settings.parents])

  const onRemoveParentClick = useCallback((id: string) => {
    setIsLoading(true)

    setSettings((p) => ({
      ...p,
      parents: p.parents.filter((f) => f !== id),
    }))
    setParents((p) => p.filter((f) => f.id !== id))

    setIsLoading(false)
  }, [])

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
      <Typography component="h2" variant="h6" sx={{ mt: 1 }}>
        Include folder
      </Typography>
      <Box sx={{ width: '40%', mt: 1 }}>
        <List>
          {parents.map((p, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <IconButton
                  aria-label="delete"
                  disabled={isLoading}
                  edge="end"
                  onClick={() => onRemoveParentClick(p.id ?? '')}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <Folder />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    component="span"
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {p.name ?? ''}
                  </Typography>
                }
                secondary={
                  <Typography
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {p.id ?? ''}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Typography sx={{ mt: 1 }}>Add folder</Typography>
      <Box sx={{ mt: 1, alignItems: 'center', display: 'flex' }}>
        <TextField
          disabled={isLoading}
          onChange={onNewParentChange}
          onKeyDown={onNewParentKeyDown}
          size="small"
          value={newParent}
          variant="outlined"
        />
        <IconButton
          aria-label="add"
          disabled={isLoading}
          onClick={onNewParentClick}
          size="large"
          sx={{ ml: 1, mt: 'auto', mb: 'auto' }}
        >
          <CreateNewFolder />
        </IconButton>
      </Box>
    </Box>
  )
}
