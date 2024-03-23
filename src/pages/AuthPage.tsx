import { Button, Grid, Typography, styled } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const StyledContainer = styled(Grid)(() => ({
  alignItems: 'center',
  textAlign: 'center'
}))

const AuthPage = () => {
  const navigate = useNavigate()

  return (
    <StyledContainer container md={6} xs={12} gap={5}>
      <Grid item xs={12}>
        <Typography variant="h2" fontWeight={'bold'}>
          Cleansify
        </Typography>
      </Grid>
      <Grid item container gap={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={() => {
              navigate('/signup')
            }}
          >
            Sign up
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" color="primary" size="large" fullWidth>
            Login
          </Button>
        </Grid>
      </Grid>
    </StyledContainer>
  )
}

export default AuthPage
