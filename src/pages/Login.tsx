import { Grid, Stack } from '@mui/material'
import { accountTypes } from '../constants/common'
import React from 'react'
import { useFormik } from 'formik'
import Dropdown from '../components/Dropdown'
import LoginForm from '../components/LoginForms/LoginForm'

const Login = () => {
  const formik = useFormik({
    initialValues: {
      accountType: ''
    },
    onSubmit: values => {
      console.log(values)
    }
  })

  return (
    <Stack width={'100%'} gap={5}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container xs={12}>
          <Grid item xs={12} md={6}>
            <Dropdown
              value={formik.values.accountType}
              label="Account type"
              name="accountType"
              onChange={formik.handleChange}
              fullWidth
              options={accountTypes}
            />
          </Grid>
        </Grid>
      </form>
      {formik.values.accountType && <LoginForm />}
    </Stack>
  )
}

export default Login
