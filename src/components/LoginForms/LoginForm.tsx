import { Alert, Backdrop, Button, Grid, TextField } from '@mui/material'
import app from '../../config/firebase.config'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import UserContext from '../../state/user/user.context'
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where
} from 'firebase/firestore'
import { AccountTypes } from '../../constants/common'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { OrgUser, PersonalUser } from '../../models/user.model'

interface LoginFormProps {
  accountType: AccountTypes
}

const LoginForm: React.FC<LoginFormProps> = ({ accountType }) => {
  const { setUser } = useContext(UserContext)

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const navigate = useNavigate()

  const auth = getAuth(app)
  const db = getFirestore(app)

  const getUserByUID = async (uid: string, collectionName: string) => {
    try {
      const q = query(
        collection(db, collectionName),
        where('userId', '==', uid)
      )

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data()
      } else {
        return null
      }
    } catch (error) {
      console.error('Error getting user:', error)
    }
  }

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async values => {
      setLoading(true)
      try {
        // Sign in user with email and password
        const user = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        )

        const currentUser = await getUserByUID(
          user.user.uid,
          accountType === AccountTypes.ORGANIZATION
            ? 'orgUsers'
            : accountType === AccountTypes.PERSONAL
            ? 'users'
            : ''
        )
        if (currentUser === null) {
          setUser(null)
          setError('User does not exist.')
          await signOut(auth)
        } else {
          if (accountType === AccountTypes.ORGANIZATION) {
            setUser(currentUser as OrgUser)
          } else if (accountType === AccountTypes.PERSONAL) {
            setUser(currentUser as PersonalUser)
          }
          navigate(`/Dashboard/${user.user.uid}`, { replace: true })
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError((error as Error).message)
        console.error('Error signing in:', error)
      }
      setLoading(false)
    },
    validationSchema,
    validateOnBlur: false,
    validateOnMount: false
  })

  return (
    <>
      {loading ? <Backdrop open={loading} /> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <form onSubmit={formik.handleSubmit}>
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
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
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
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              type="submit"
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default LoginForm
