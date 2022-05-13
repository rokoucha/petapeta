import type React from 'react'
import { Box, LinearProgress, Modal, Typography } from '@mui/material'
import { Image } from '../types'

type ImageViewerProps = {
  image: Image
  loading: boolean
  onClose: (...args: any[]) => any
  open: boolean
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  image,
  loading,
  onClose,
  open,
}) => (
  <Modal open={open} onClose={onClose}>
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
      {loading ? (
        <LinearProgress sx={{ mt: 'auto', mb: 'auto', width: '100%' }} />
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
    </Box>
  </Modal>
)
