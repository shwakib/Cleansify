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
import app from '../config/firebase.config'
import { getAuth, signOut } from '@firebase/auth'
import { useNavigate } from 'react-router'
import BackButton from '../utils/BackButton'

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

  const { user, setUser } = useContext(UserContext)
  const auth = getAuth(app)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    setUser(null)
    navigate('/')
  }

  const handleSubmitButton = () =>{
    navigate(`/Submit/${user?.userId}`)
  }

  const handleBackButton = () =>{
    navigate(`/Dashboard/${user?.userId}`)
  }

  return (
    <div style={{ background: theme.palette.background.default }}>
      {user && (
        <AppBar>
          <Toolbar>
          <BackButton onClick={handleBackButton}/>
            <StyledAppbar maxWidth="lg">
              <Stack alignItems="center">
                <Typography marginLeft={80} marginTop={.6}>Signed in as: {(user as PersonalUser)?.fullName ??
                    (user as OrgUser)?.orgName}</Typography>
              </Stack>
              <Button onClick={handleSubmitButton}>
                <Typography color={'white'} marginLeft={5}>
                  Upload
                </Typography>
              </Button>
              <Button
                variant="text"
                color="error"
                startIcon={<ExitToAppIcon style={{ fill: 'white' }} />}
                onClick={handleLogout}
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
