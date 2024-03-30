import { Alert, Grid, Typography } from '@mui/material'
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
import DataForm from '../components/DataForm'
import { getCurrentMonthYear } from '../utils/helper'
import DataTables from '../components/DataTables'
import { DataTable } from 'models/data.model'

const Dashboard = () => {
  const { userId } = useParams()
  const db = getFirestore(app)

  const { user, setUser } = useContext(UserContext)

  const [loading, setLoading] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const [data, setData] = useState<DataTable>()

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
    const isSubmitted = async () => {
      const userId = user?.userId
      const currentMonthYear = getCurrentMonthYear()

      if (userId && currentMonthYear) {
        const q = query(
          collection(db, 'data'),
          where('userId', '==', userId),
          where('date', '==', currentMonthYear)
        )

        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          setIsSubmitted(true)
        } else {
          setIsSubmitted(false)
        }
      }
    }

    const getDocsByYear = async () => {
      const q = query(collection(db, 'data'), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)

      const docsByYear: DataTable = {}

      // Iterate over each document in the query snapshot
      querySnapshot.forEach(doc => {
        // Extract the year part from the date property
        const year = doc.data().date.split('/')[1]

        if (!docsByYear[year]) {
          docsByYear[year] = []
        }

        docsByYear[year].push(doc.data())
      })
      setData(docsByYear)
    }

    isSubmitted()
    getDocsByYear()
  }, [user, formSubmitted])

  useEffect(() => {
    if (userId) getUser(userId)
  }, [userId])

  return (
    <>
      {loading ? (
        <Backdrop open={loading} />
      ) : (
        <Grid container spacing={3}>
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
          {isSubmitted ? (
            <Grid item container xs={12} md={6}>
              <Alert severity="success">
                You have made the submission for this month.
              </Alert>
            </Grid>
          ) : (
            <DataForm onFormSubmit={() => setFormSubmitted(true)} />
          )}
          <Grid item container xs={12}>
            <DataTables {...data} />
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default Dashboard
