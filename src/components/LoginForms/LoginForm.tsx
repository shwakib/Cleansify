import { Button, Grid, TextField } from '@mui/material'
import app from '../../config/firebase.config'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useFormik } from 'formik'
import React, { useContext } from 'react'
import UserContext from '../../state/user/user.context'
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where
} from 'firebase/firestore'
import { AccountTypes } from '../../constants/common'
import { OrgUser, PersonalUser } from '../../models/user.model'

interface LoginFormProps {
  accountType: AccountTypes
}

const LoginForm: React.FC<LoginFormProps> = ({ accountType }) => {
  const { user, setUser } = useContext(UserContext)

  const auth = getAuth(app)
  const db = getFirestore(app)

  const getUserByUID = async (uid: string, collectionName: string) => {
    try {
      const q = query(
        collection(db, collectionName),
        where('userId', '==', uid)
      )

      const querySnapshot = await getDocs(q)
      console.log(querySnapshot)

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data()
      } else {
        return null
      }
    } catch (error) {
      console.error('Error getting user:', error)
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async values => {
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
          setUser(null) // Set user state to null if currentUser is null
        } else {
          // Cast currentUser to OrgUser or PersonalUser based on your application logic
          setUser(currentUser as OrgUser | PersonalUser)
        }

        // You can redirect the user to another page or perform any other action upon successful login
      } catch (error) {
        console.error('Error signing in:', error)
      }
    }
  })

  console.log(user)

  return (
    <>
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
