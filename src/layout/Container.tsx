import React, { ReactNode } from 'react'
import Container from '@mui/material/Container'

interface AppContainerProps {
  children: ReactNode
}

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        alignItems: 'center'
      }}
    >
      {children}
    </Container>
  )
}

export default AppContainer
