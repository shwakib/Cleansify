import {
  Alert,
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
import React, { useState } from 'react'
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
import * as yup from 'yup'
import { useNavigate } from 'react-router'

interface FormValues extends Omit<PersonalUser, 'userId'> {
  password: string
}

const PersonalSignupForm = () => {
  const [familyMembers, setFamilyMembers] = useState<Array<FamilyMembers>>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const auth = getAuth(app)
  const db = getFirestore(app)

  const validationSchema = yup.object({
    accountType: yup.string().required('Account type is required'),
    fullName: yup.string().required('Full name is required'),
    dateOfBirth: yup.object().shape({
      day: yup.string().required('Day of birth is required'),
      month: yup.string().required('Month of birth is required'),
      year: yup.string().required('Year of birth is required')
    }),
    nationalId: yup.string().required('National ID is required'),
    address: yup.object().shape({
      fullAddress: yup.string().required('Full address is required'),
      state: yup.string().required('State is required')
    }),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  })

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

          navigate('/login')
        } catch (error) {
          setError((error as Error).message)
          await user.delete()
        }
      } catch (error) {
        setError((error as Error).message)
      }
      setLoading(false)
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false
  })

  const familyValidationSchema = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    dateOfBirth: yup.object().shape({
      day: yup.string().required('Day of birth is required'),
      month: yup.string().required('Month of birth is required'),
      year: yup.string().required('Year of birth is required')
    }),
    nationalId: yup.string().required('National ID is required')
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
    },
    validationSchema: familyValidationSchema,
    validateOnBlur: false,
    validateOnMount: false
  })

  return (
    <>
      {loading ? <Backdrop open={loading} /> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

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
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
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
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.dateOfBirth?.day &&
                    Boolean(formik.errors.dateOfBirth?.day)
                  }
                  errorMessage={formik.errors.dateOfBirth?.day}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <Dropdown
                  fullWidth
                  label="Month"
                  options={generateMonthsArray()}
                  value={formik.values.dateOfBirth.month}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="dateOfBirth.month"
                  error={
                    formik.touched.dateOfBirth?.month &&
                    Boolean(formik.errors.dateOfBirth?.month)
                  }
                  errorMessage={formik.errors.dateOfBirth?.month}
                />
              </Grid>
              <Grid item md={5} xs={12}>
                <Dropdown
                  fullWidth
                  label="Year"
                  options={generateYearsArray()}
                  value={formik.values.dateOfBirth.year}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="dateOfBirth.year"
                  error={
                    formik.touched.dateOfBirth?.year &&
                    Boolean(formik.errors.dateOfBirth?.year)
                  }
                  errorMessage={formik.errors.dateOfBirth?.year}
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
                onBlur={formik.handleBlur}
                name="nationalId"
                error={
                  formik.touched.nationalId && Boolean(formik.errors.nationalId)
                }
                helperText={
                  formik.touched.nationalId && formik.errors.nationalId
                }
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
                onBlur={formik.handleBlur}
                name="address.fullAddress"
                error={
                  formik.touched.address?.fullAddress &&
                  Boolean(formik.errors.address?.fullAddress)
                }
                helperText={
                  formik.touched.address?.fullAddress &&
                  formik.errors.address?.fullAddress
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Dropdown
                fullWidth
                label="State"
                value={formik.values.address.state}
                name="address.state"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={StateNames}
                error={
                  formik.touched.address?.state &&
                  Boolean(formik.errors.address?.state)
                }
                errorMessage={formik.errors.address?.state}
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
                onBlur={formik.handleBlur}
                name="email"
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
                onBlur={formik.handleBlur}
                name="phoneNumber"
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
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
                onBlur={formik.handleBlur}
                name="password"
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Grid container item xs={12}>
        <Button
          variant="outlined"
          onClick={() => setShowForm(prevState => !prevState)}
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
                  onBlur={familyFormik.handleBlur}
                  error={
                    familyFormik.touched.fullName &&
                    Boolean(familyFormik.errors.fullName)
                  }
                  helperText={
                    familyFormik.touched.fullName &&
                    familyFormik.errors.fullName
                  }
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
                  onBlur={familyFormik.handleBlur}
                  error={
                    familyFormik.touched.nationalId &&
                    Boolean(familyFormik.errors.nationalId)
                  }
                  helperText={
                    familyFormik.touched.nationalId &&
                    familyFormik.errors.nationalId
                  }
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
                    onBlur={familyFormik.handleBlur}
                    error={
                      familyFormik.touched.dateOfBirth?.day &&
                      Boolean(familyFormik.errors.dateOfBirth?.day)
                    }
                    errorMessage={familyFormik.errors.dateOfBirth?.day}
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
                    onBlur={familyFormik.handleBlur}
                    error={
                      familyFormik.touched.dateOfBirth?.month &&
                      Boolean(familyFormik.errors.dateOfBirth?.month)
                    }
                    errorMessage={familyFormik.errors.dateOfBirth?.month}
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
                    onBlur={familyFormik.handleBlur}
                    error={
                      familyFormik.touched.dateOfBirth?.year &&
                      Boolean(familyFormik.errors.dateOfBirth?.year)
                    }
                    errorMessage={familyFormik.errors.dateOfBirth?.year}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  color="success"
                  type="submit"
                  fullWidth
                >
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
              Sign up
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default PersonalSignupForm
