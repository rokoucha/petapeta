import React, { useCallback, useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputAdornment,
  LinearProgress,
  Modal,
  TextField,
  Typography,
} from '@mui/material'
import { Download, Search as SearchIcon } from '@mui/icons-material'
import { useLoadingProvider } from '../components/loadingProvider'

type Image = {
  downloadUrl: string
  id: string
  imageHeight: number
  imageUrl: string | null
  imageWidth: number
  mimeType: string
  name: string
  thumbnailUrl: string
}

export const Search: React.FC = () => {
  const [image, setImage] = useState<Image | null>(null)
  const [images, setImages] = useState<Map<string, Image>>(new Map())
  const [isLoading, setIsLoading] = useLoadingProvider()
  const [searchText, setSearchText] = useState('')
  const [viewerLoading, setViewerLoading] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)

  const onSearchTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value)
    },
    [],
  )

  const onSearchTextKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter' || isLoading) return

      e.preventDefault()

      onSearchClick()
    },
    [isLoading, searchText],
  )

  const onSearchClick = useCallback(async () => {
    setIsLoading(true)

    setImages(new Map())

    let res: gapi.client.Response<gapi.client.drive.FileList> | undefined =
      undefined
    try {
      res = await gapi.client.drive.files.list({
        q: `mimeType contains 'image/' and trashed = false and ( fullText contains '${searchText}' or name contains '${searchText}' ) and ( '1cAm3mhIxRaAGAI6-4_Irw4wA5GlTR9kT' in parents or '1yTUz48VtVq1TWNtVWXZECaqdSkYi5r5m' in parents )`,
        fields:
          'files(id,kind,mimeType,name,thumbnailLink,webContentLink,parents,imageMediaMetadata)',
      })
    } catch (e) {
      console.error(e)

      setIsLoading(false)
      return
    }

    setImages(
      new Map(
        (res?.result.files ?? []).map((f) => [
          f.id ?? '',
          {
            downloadUrl: f.webContentLink ?? '',
            id: f.id ?? '',
            imageHeight: f.imageMediaMetadata?.height ?? 0,
            imageUrl: null,
            imageWidth: f.imageMediaMetadata?.width ?? 0,
            mimeType: f.mimeType ?? 'application/octet-stream',
            name: f.name ?? '',
            thumbnailUrl: f.thumbnailLink ?? '',
          },
        ]),
      ),
    )

    setIsLoading(false)
  }, [searchText])

  const onImageClick = useCallback(async (i: Image) => {
    setImage(i)
    setViewerLoading(true)
    setViewerOpen(true)

    if (i.imageUrl === null) {
      const res = await gapi.client.drive.files.get({
        alt: 'media',
        fileId: i.id,
      })

      const imageBinary = new Uint8Array(
        Array.from(res.body).map((b) => b.charCodeAt(0)),
      )

      const imageBlob = new Blob([imageBinary], { type: i.mimeType })

      i = { ...i, imageUrl: URL.createObjectURL(imageBlob) }

      setImage(i)
      setImages((p) => p.set(i.id, i))
    }

    setViewerLoading(false)
  }, [])

  const onViewerClose = useCallback(() => {
    setViewerOpen(false)
    setImage(null)
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
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={onSearchTextChange}
        onKeyDown={onSearchTextKeyDown}
        value={searchText}
        variant="outlined"
      />
      <Button
        disabled={isLoading}
        onClick={onSearchClick}
        sx={{ mt: 2 }}
        variant="contained"
      >
        Seach
      </Button>
      <ImageList cols={3} gap={8} sx={{ width: '100%' }}>
        {[...images.values()].map((i) => (
          <ImageListItem
            key={i.id}
            sx={{
              '&:hover div': { visibility: 'visible' },
            }}
          >
            <img
              alt={i.name}
              loading="lazy"
              onClick={() => onImageClick(i)}
              src={i.thumbnailUrl}
              style={{ cursor: 'pointer' }}
            />
            <ImageListItemBar
              actionIcon={
                <IconButton
                  aria-label="Download"
                  href={i.downloadUrl}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <Download />
                </IconButton>
              }
              subtitle={i.id}
              sx={{ visibility: 'hidden' }}
              title={i.name}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Modal open={viewerOpen} onClose={onViewerClose}>
        <Box
          sx={{
            alignItems: 'center',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            left: '50%',
            p: 0.5,
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {image ? (
            <>
              {viewerLoading ? (
                <LinearProgress
                  sx={{ mt: 'auto', mb: 'auto', width: '100%' }}
                />
              ) : image.imageUrl !== null ? (
                <img
                  height={image.imageHeight}
                  src={image.imageUrl}
                  style={{ height: 'auto', width: '100%' }}
                  width={image.imageWidth}
                />
              ) : (
                <Typography>Failed to load image</Typography>
              )}
              <Typography m={1}>{image.name}</Typography>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Modal>
    </Box>
  )
}
