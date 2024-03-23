import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    background: {
      default: '#f6f6f6'
    }
  },

  components: {
    MuiInput: {
      styleOverrides: {
        root: {
          '& input[type=number]': {
            '-moz-appearance': 'textfield'
          },
          '& input[type=number]::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
          },
          '& input[type=number]::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
          }
        }
      }
    }
  }
})

export default theme
