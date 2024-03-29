import { Grid, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../state/user/user.context'
import { OrgUser, PersonalUser } from '../models/user.model'
import { useParams } from 'react-router-dom'
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where
} from 'firebase/firestore'
import app from '../config/firebase.config'
import PersonalInfo from '../components/PersonalInfo'
import Backdrop from '../components/Backdrop'
import { AccountTypes } from '../constants/common'

const Dashboard = () => {
  const { userId } = useParams()
  const db = getFirestore(app)

  const { user, setUser } = useContext(UserContext)

  const [loading, setLoading] = useState<boolean>(false)

  const getUser = async (uid: string) => {
    setLoading(true)
    try {
      const userQuery = query(
        collection(db, 'users'),
        where('userId', '==', uid)
      )
      const userSnapshot = await getDocs(userQuery)

      if (!userSnapshot.empty) {
        setUser(userSnapshot.docs[0].data() as PersonalUser)
        setLoading(false)
      }

      const orgUserQuery = query(
        collection(db, 'orgUsers'),
        where('userId', '==', uid)
      )
      const orgUserSnapshot = await getDocs(orgUserQuery)
      console.log(orgUserSnapshot.docs[0])

      if (!orgUserSnapshot.empty) {
        setUser(orgUserSnapshot.docs[0].data() as OrgUser)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  useEffect(() => {
    if (userId) getUser(userId)
  }, [userId])

  return (
    <>
      {loading ? (
        <Backdrop open={loading} />
      ) : (
        <Grid container rowSpacing={3}>
          <Grid item xs={12}>
            {user?.accountType === AccountTypes.ORGANIZATION ? (
              <Typography variant="h4">Your Organization Account</Typography>
            ) : user?.accountType === AccountTypes.PERSONAL ? (
              <Typography variant="h4">Your Personal Account</Typography>
            ) : null}
          </Grid>
          <PersonalInfo
            name={
              (user as PersonalUser)?.fullName ?? (user as OrgUser)?.orgName
            }
            address={`${user?.address.fullAddress}, ${user?.address.state}`}
            email={user?.email ?? ''}
            phoneNumber={user?.phoneNumber ?? ''}
            dateOfBirth={(user as PersonalUser)?.dateOfBirth}
            nationalId={(user as PersonalUser)?.nationalId}
          />
        </Grid>
      )}
    </>
  )
}

export default Dashboard
