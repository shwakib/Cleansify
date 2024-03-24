import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import Dropdown from '../../components/Dropdown'
import React, { Fragment, useState } from 'react'
import {
  generateDaysInMonth,
  generateMonthsArray,
  generateYearsArray
} from '../../utils/helper'
import { useFormik } from 'formik'
import { AccountTypes, StateNames } from '../../constants/common'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import app from '../../config/firebase.config'
import { FamilyMembers, PersonalUser } from '../../models/user.model'
import Backdrop from '../../components/Backdrop'

interface FormValues extends Omit<PersonalUser, 'userId'> {
  password: string
}

const PersonalSignupForm = () => {
  const [familyMembers, setFamilyMembers] = useState<Array<FamilyMembers>>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const auth = getAuth(app)
  const db = getFirestore(app)

  const initialValues: FormValues = {
    accountType: AccountTypes.PERSONAL,
    fullName: '',
    dateOfBirth: {
      day: '',
      month: '',
      year: ''
    },
    nationalId: '',
    address: {
      fullAddress: '',
      state: ''
    },
    email: '',
    phoneNumber: '',
    password: ''
  }

  const formik = useFormik({
    initialValues,
    onSubmit: async values => {
      setLoading(true)
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        )

        const user = userCredentials.user

        try {
          const userDoc: PersonalUser = {
            accountType: AccountTypes.PERSONAL,
            userId: user.uid,
            fullName: values.fullName,
            dateOfBirth: {
              day: values.dateOfBirth.day,
              month: values.dateOfBirth.month,
              year: values.dateOfBirth.year
            },
            address: {
              fullAddress: values.address.fullAddress,
              state: values.address.state
            },
            email: values.email,
            phoneNumber: values.phoneNumber,
            nationalId: values.nationalId,
            familyMembers
          }
          if (user) {
            await addDoc(collection(db, 'users'), userDoc)
          }
          formik.resetForm()
          setFamilyMembers([])
        } catch (error) {
          await user.delete()
        }
      } catch (error) {}
      setLoading(false)
    }
  })

  const familyFormik = useFormik({
    initialValues: {
      fullName: '',
      dateOfBirth: {
        day: '',
        month: '',
        year: ''
      },
      nationalId: ''
    },
    onSubmit: values => {
      const newMember: FamilyMembers = {
        fullName: values.fullName,
        nationalId: values.nationalId,
        dateOfBirth: {
          day: values.dateOfBirth.day,
          month: values.dateOfBirth.month,
          year: values.dateOfBirth.year
        }
      }

      setFamilyMembers(prevState => [...prevState, newMember])

      setShowForm(false)

      familyFormik.resetForm()
    }
  })

  return (
    <Fragment>
      {loading ? <Backdrop open={loading} /> : null}
      <form onSubmit={formik.handleSubmit}>
        <Grid container xs={12} spacing={5}>
          {/* 1st row start */}
          <Grid item xs={12}>
            <TextField
              label="Full name"
              variant="standard"
              fullWidth
              value={formik.values.fullName}
              onChange={formik.handleChange}
              name="fullName"
            />
          </Grid>

          {/* 2nd row start */}
          <Grid item container alignItems={'center'} xs={12} columnSpacing={5}>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight={'bold'}>
                Date of birth
              </Typography>
            </Grid>
            <Grid container item md={6} xs={12} spacing={3}>
              <Grid item md={3} xs={12}>
                <Dropdown
                  fullWidth
                  label="Day"
                  name="dateOfBirth.day"
                  options={generateDaysInMonth(
                    Number(formik.values.dateOfBirth.month),
                    Number(formik.values.dateOfBirth.year)
                  )}
                  value={formik.values.dateOfBirth.day}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <Dropdown
                  fullWidth
                  label="Month"
                  options={generateMonthsArray()}
                  value={formik.values.dateOfBirth.month}
                  onChange={formik.handleChange}
                  name="dateOfBirth.month"
                />
              </Grid>
              <Grid item md={5} xs={12}>
                <Dropdown
                  fullWidth
                  label="Year"
                  options={generateYearsArray()}
                  value={formik.values.dateOfBirth.year}
                  onChange={formik.handleChange}
                  name="dateOfBirth.year"
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="National Id"
                variant="standard"
                fullWidth
                value={formik.values.nationalId}
                onChange={formik.handleChange}
                name="nationalId"
              />
            </Grid>
          </Grid>
          {/* 3rd row start */}
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Full address"
                variant="standard"
                fullWidth
                value={formik.values.address.fullAddress}
                onChange={formik.handleChange}
                name="address.fullAddress"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Dropdown
                fullWidth
                label="State"
                value={formik.values.address.state}
                name="address.state"
                onChange={formik.handleChange}
                options={StateNames}
              />
            </Grid>
          </Grid>
          {/* 4th row start */}
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Email"
                variant="standard"
                type="email"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                name="email"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Phone number"
                variant="standard"
                type="number"
                fullWidth
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                name="phoneNumber"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Password"
                variant="standard"
                type="password"
                fullWidth
                value={formik.values.password}
                onChange={formik.handleChange}
                name="password"
              />
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Grid container item xs={12}>
        <Button
          variant="outlined"
          onClick={() => setShowForm(true)}
          size="medium"
        >
          Add Family Member
        </Button>
      </Grid>
      <>
        {showForm && (
          <form onSubmit={familyFormik.handleSubmit}>
            <Grid container xs={12} spacing={5} alignItems={'center'}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Name"
                  variant="standard"
                  value={familyFormik.values.fullName}
                  onChange={familyFormik.handleChange}
                  name="fullName"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="National ID"
                  variant="standard"
                  value={familyFormik.values.nationalId}
                  onChange={familyFormik.handleChange}
                  name="nationalId"
                  fullWidth
                />
              </Grid>
              <Grid container item xs={12} md={3} spacing={3}>
                <Grid item md={3} xs={12}>
                  <Dropdown
                    fullWidth
                    label="Day"
                    name="dateOfBirth.day"
                    options={generateDaysInMonth(
                      Number(familyFormik.values.dateOfBirth.month),
                      Number(familyFormik.values.dateOfBirth.year)
                    )}
                    value={familyFormik.values.dateOfBirth.day}
                    onChange={familyFormik.handleChange}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Dropdown
                    fullWidth
                    label="Month"
                    options={generateMonthsArray()}
                    value={familyFormik.values.dateOfBirth.month}
                    onChange={familyFormik.handleChange}
                    name="dateOfBirth.month"
                  />
                </Grid>
                <Grid item md={5} xs={12}>
                  <Dropdown
                    fullWidth
                    label="Year"
                    options={generateYearsArray()}
                    value={familyFormik.values.dateOfBirth.year}
                    onChange={familyFormik.handleChange}
                    name="dateOfBirth.year"
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button variant="contained" type="submit" fullWidth>
                  Add
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
        {familyMembers.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={'bold'}>
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={'bold'}>
                    National ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={'bold'}>
                    Date of Birth
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {familyMembers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>{member.fullName}</TableCell>
                  <TableCell>{member.nationalId}</TableCell>
                  <TableCell>{`${member.dateOfBirth.month}/${member.dateOfBirth.day}/${member.dateOfBirth.year}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent={'end'}>
          <Grid item md={4} xs={12}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              size="large"
              type="submit"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Fragment>
  )
}

export default PersonalSignupForm
