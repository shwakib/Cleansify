import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack
} from '@mui/material'
import { AccountTypes, accountTypes } from '../constants/common'
import React from 'react'
import { useFormik } from 'formik'
import PersonalSignupForm from '../components/SignupForms/PersonalSignupForm'
import OrganizationSignupForm from '../components/SignupForms/OrganizationSignupForm'

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
    <Stack width={'100%'}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container xs={12}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Account type
              </InputLabel>
              <Select
                value={formik.values.accountType}
                label="Account type"
                name="accountType"
                onChange={formik.handleChange}
                fullWidth
              >
                {accountTypes.map(at => {
                  return <MenuItem value={at.value}>{at.name}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </form>
      {renderSelectedForm()}
    </Stack>
  )
}

export default Signup
