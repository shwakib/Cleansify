import { Grid, Stack } from '@mui/material'
import { AccountTypes, accountTypes } from '../constants/common'
import React from 'react'
import { useFormik } from 'formik'
import PersonalSignupForm from '../components/SignupForms/PersonalSignupForm'
import OrganizationSignupForm from '../components/SignupForms/OrganizationSignupForm'
import Dropdown from '../components/Dropdown'

const Signup = () => {
  const formik = useFormik({
    initialValues: {
      accountType: ''
    },
    onSubmit: values => {
      console.log(values)
    }
  })

  const renderSelectedForm = () => {
    if (formik.values.accountType === AccountTypes.PERSONAL) {
      return <PersonalSignupForm />
    } else if (formik.values.accountType === AccountTypes.ORGANIZATION) {
      return <OrganizationSignupForm />
    } else {
      return
    }
  }

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
      {renderSelectedForm()}
    </Stack>
  )
}

export default Signup
