import React, { ReactNode, useContext } from 'react'
import Container from '@mui/material/Container'
import {
  AppBar,
  Button,
  Stack,
  Toolbar,
  Typography,
  styled,
  useTheme
} from '@mui/material'
import UserContext from '../state/user/user.context'
import { OrgUser, PersonalUser } from '../models/user.model'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

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

const StyledAppbar = styled(Container)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%'
}))

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  const theme = useTheme()

  const { user } = useContext(UserContext)

  return (
    <div style={{ background: theme.palette.background.default }}>
      {user && (
        <AppBar>
          <Toolbar>
            <StyledAppbar maxWidth="lg">
              <Stack>
                <Typography>Signed in as: </Typography>{' '}
                <Typography fontWeight={'bold'} ml={2}>
                  {(user as PersonalUser)?.fullName ??
                    (user as OrgUser)?.orgName}
                </Typography>
              </Stack>
              <Button
                variant="text"
                color="error"
                startIcon={<ExitToAppIcon style={{ fill: 'white' }} />}
              >
                <Typography variant="body1" fontWeight={'bold'} color={'white'}>
                  Logout
                </Typography>
              </Button>
            </StyledAppbar>
          </Toolbar>
        </AppBar>
      )}
      <StyledContainer maxWidth="lg">{children}</StyledContainer>
    </div>
  )
}

export default AppContainer
