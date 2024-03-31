import { Grid, Stack } from '@mui/material'
import { AccountTypes, accountTypes } from '../constants/common'
import React from 'react'
import { useFormik } from 'formik'
import Dropdown from '../components/Dropdown'
import LoginForm from '../components/LoginForms/LoginForm'
import BackButton from '../utils/BackButton'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const formik = useFormik({
    initialValues: {
      accountType: ''
    },
    onSubmit: values => {
      console.log(values)
    }
  })

  const navigate=useNavigate();

  const handleBackButton = () =>{
    navigate('/')
  }

  return (
    <Stack width={'100%'} gap={5}>
      <BackButton onClick={handleBackButton}/>
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
      {formik.values.accountType && (
        <LoginForm accountType={formik.values.accountType as AccountTypes} />
      )}
    </Stack>
  )
}

export default Login
