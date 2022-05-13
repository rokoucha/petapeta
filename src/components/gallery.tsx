import { Download } from '@mui/icons-material'
import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material'
import type React from 'react'
import { Image } from '../types'

type GalleryProps = {
  images: Image[]
  onImageClick: (i: Image) => any
}

export const Gallery: React.FC<GalleryProps> = ({ images, onImageClick }) => (
  <ImageList cols={3} gap={8} sx={{ width: '100%' }}>
    {images.map((i) => (
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
)
