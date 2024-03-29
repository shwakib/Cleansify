import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import { getCurrentMonthYear } from '../utils/helper'
import UserContext from '../state/user/user.context'
import { addDoc, collection, getFirestore } from '@firebase/firestore'
import app from '../config/firebase.config'
import { getStorage, ref, uploadBytes } from '@firebase/storage'

type FormData = {
  electricUsage: string
  gasUsage: string
  fuelUsage: string
  avgMilesDriven: string
  file: File
}

interface DataDoc extends Omit<FormData, 'file'> {
  userId: string
  accountType: string
  carbonFootPrint: string
  date: string
  filePath: string
}

const DataForm = () => {
  const { user } = useContext(UserContext)

  const db = getFirestore(app)

  const [carbonFootPrint, setCarbonFootPrint] = useState<string>('')

  const initialValues: FormData = {
    electricUsage: '',
    gasUsage: '',
    fuelUsage: '',
    avgMilesDriven: '',
    file: null as unknown as File
  }

  const formik = useFormik({
    initialValues,
    onSubmit: async values => {
      let fileRef

      // Check if not submitted, then proceed to submit form and upload file

      try {
        const dataDoc: DataDoc = {
          userId: user?.userId ?? '',
          accountType: user?.accountType ?? '',
          electricUsage: values.electricUsage,
          gasUsage: values.gasUsage,
          fuelUsage: values.fuelUsage,
          avgMilesDriven: values.avgMilesDriven,
          carbonFootPrint,
          date: getCurrentMonthYear(),
          filePath: `files/${user?.userId}/${getCurrentMonthYear()}/${
            values.file?.name
          }`
        }

        await addDoc(collection(db, 'data'), dataDoc)

        // File upload
        const storage = getStorage()
        const storageRef = ref(storage)

        fileRef = ref(
          storageRef,
          `files/${user?.userId}/bills/${getCurrentMonthYear()}/${
            values.file?.name
          }`
        )
        await uploadBytes(fileRef, values.file)
      } catch (error) {}
    }
  })

  console.log(getCurrentMonthYear())

  const calculate = () => {
    if (
      formik.values.electricUsage &&
      formik.values.fuelUsage &&
      formik.values.gasUsage &&
      formik.values.avgMilesDriven
    ) {
      const result = `${
        Number(formik.values.electricUsage) * 105 +
        Number(formik.values.gasUsage) * 105 +
        Number(formik.values.fuelUsage) * 113 +
        Number(formik.values.avgMilesDriven) * 52
      } lbs`
      setCarbonFootPrint(result)
      return result
    }
    return 'Please enter the required fields'
  }

  return (
    <Grid item container xs={12} md={6} rowSpacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6">Enter your data</Typography>
      </Grid>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              label="Electric Usage"
              fullWidth
              type="number"
              value={formik.values.electricUsage}
              name="electricUsage"
              onChange={formik.handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kWh</InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              label="Gass Usage"
              fullWidth
              type="number"
              value={formik.values.gasUsage}
              name="gasUsage"
              onChange={formik.handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">ft³</InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              label="Fuel Usage"
              fullWidth
              type="number"
              value={formik.values.fuelUsage}
              name="fuelUsage"
              onChange={formik.handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">gal</InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              label="Average Miles Driven Per Car"
              fullWidth
              type="number"
              value={formik.values.avgMilesDriven}
              name="avgMilesDriven"
              onChange={formik.handleChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">mi</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight={'bold'}>
              Carbon footprint: {calculate()}
            </Typography>
          </Grid>
          <Grid container item xs={12} alignItems={'center'}>
            <input
              type="file"
              id="file"
              name="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={event => {
                formik.setFieldValue('file', event?.currentTarget?.files?.[0])
              }}
              style={{ display: 'none' }}
            />
            <Grid item xs={12} md={4}>
              <label htmlFor="file">
                <Button variant="contained" component="span">
                  Upload File
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true
                }}
                value={formik.values.file ? formik.values.file.name : ''}
                error={formik.touched.file && Boolean(formik.errors.file)}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth type="submit" variant="contained" color="success">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  )
}

export default DataForm
