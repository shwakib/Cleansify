import React, { ReactNode } from 'react'
import Container from '@mui/material/Container'
import { styled, useTheme } from '@mui/material'

interface AppContainerProps {
  children: ReactNode
}

const StyledContainer = styled(Container)(() => ({
  display: 'flex',
  justifyContent: 'center',
  height: 'max-content',
  alignItems: 'center',
  paddingTop: '120px',
  minHeight: '100vh',
  paddingBottom: '120px'
}))

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  const theme = useTheme()

  return (
    <div style={{ background: theme.palette.background.default }}>
      <StyledContainer maxWidth="lg">{children}</StyledContainer>
    </div>
  )
}

export default AppContainer
