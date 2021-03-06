import React, { useCallback, useState } from 'react'
import { Box, Button, InputAdornment, TextField } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useLoadingProvider } from '../providers/loadingProvider'
import type { Image } from '../types'
import { ImageViewer } from '../components/imageViewer'
import { Gallery } from '../components/gallery'
import { queryToText } from '../utils'
import { useSettingsProvider } from '../providers/settingsProvider'

export const Search: React.FC = () => {
  const [image, setImage] = useState<Image | null>(null)
  const [images, setImages] = useState<Map<string, Image>>(new Map())
  const [isLoading, setIsLoading] = useLoadingProvider()
  const [searchText, setSearchText] = useState('')
  const [viewerLoading, setViewerLoading] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [settings] = useSettingsProvider()

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

    const query = [
      "mimeType contains 'image/'",
      settings.trashed ? '' : 'trashed = false',
      settings.searchByFullText
        ? queryToText([
            `fullText contains '${searchText}'`,
            settings.searchByName ? '' : `not name contains '${searchText}'`,
          ])
        : settings.searchByName
        ? `name contains '${searchText}'`
        : '',
      settings.parents.map((p) => `'${p}' in parents`),
    ]

    let res: gapi.client.Response<gapi.client.drive.FileList>
    try {
      res = await gapi.client.drive.files.list({
        q: queryToText(query),
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
        (res.result.files ?? []).map((f) => [
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
      let res: gapi.client.Response<gapi.client.drive.File>
      try {
        res = await gapi.client.drive.files.get({
          alt: 'media',
          fileId: i.id,
        })
      } catch (e) {
        console.error(e)

        setViewerLoading(true)
        return
      }

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
      <Gallery images={[...images.values()]} onImageClick={onImageClick} />
      {image ? (
        <ImageViewer
          image={image}
          loading={viewerLoading}
          open={viewerOpen}
          onClose={onViewerClose}
        />
      ) : (
        <></>
      )}
    </Box>
  )
}
