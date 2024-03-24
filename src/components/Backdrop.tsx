import React from 'react'
import { BackdropProps, Backdrop as MuiBackdrop } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

const Backdrop: React.FC<BackdropProps> = ({ open }) => {
  return (
    <MuiBackdrop open={open} sx={{ zIndex: 1000 }}>
      <CircularProgress />
    </MuiBackdrop>
  )
}

export default Backdrop
