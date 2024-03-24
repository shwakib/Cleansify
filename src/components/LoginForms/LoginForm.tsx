import { Button, Grid, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'

const LoginForm = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      console.log(values)
    }
  })

  return (
    <>
      <form>
        <Grid container md={6} xs={12} spacing={5}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="standard"
              fullWidth
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              name="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              variant="standard"
              fullWidth
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              name="password"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="success" size="large" fullWidth>
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default LoginForm
