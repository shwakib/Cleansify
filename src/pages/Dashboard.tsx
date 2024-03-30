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

  const { user } = useContext(UserContext)

  const [loading, setLoading] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const [data, setData] = useState<DataTable | null>(null)

  useEffect(() => {
    const isSubmitted = async () => {
      setLoading(true)
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
      setLoading(false)
    }

    const getDocsByYear = async () => {
      setLoading(true)
      const q = query(collection(db, 'data'), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        setData(null)
        return
      }

      const docsByYear: DataTable = {}

      querySnapshot.forEach(doc => {
        const year = doc.data().date.split('/')[1]

        if (!docsByYear[year]) {
          docsByYear[year] = []
        }

        docsByYear[year].push(doc.data())
      })
      setData(docsByYear)
      setLoading(false)
    }

    isSubmitted()
    getDocsByYear()
  }, [user, formSubmitted])

  return (
    <>
      {loading ? (
        <Backdrop open={loading} />
      ) : (
        <Grid container spacing={5}>
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
            {data ? (
              <>
                <Grid item xs={12}>
                  <Typography variant="h5" fontWeight={'bold'} gutterBottom>
                    Your submission history
                  </Typography>
                </Grid>
                <DataTables {...data} />
              </>
            ) : (
              <Alert severity="warning">
                You have not made any submissions yet.
              </Alert>
            )}
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default Dashboard
