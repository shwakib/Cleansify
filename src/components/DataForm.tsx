import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
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
  electricityBill: File
  gasBill: File
  fuelBill: File
  carBill: File
}

interface DataDoc
  extends Omit<
    FormData,
    'electricityBill' | 'gasBill' | 'fuelBill' | 'carBill'
  > {
  userId: string
  accountType: string
  carbonFootPrint: string
  date: string
  electricityBillFilePath: string
  gasBillFilePath: string
  fuelBillFilePath: string
  carBillFilePath: string
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
    electricityBill: null as unknown as File,
    gasBill: null as unknown as File,
    fuelBill: null as unknown as File,
    carBill: null as unknown as File
  }

  const formik = useFormik({
    initialValues,
    onSubmit: async values => {
      let electricityFileRef
      let gasFileRef
      let fuelFileRef
      let carFileRef

      // Check if not submitted, then proceed to submit form and upload file
      const electricityBillFilePath = `files/${
        user?.userId
      }/${getCurrentMonthYear().replace('/', '-')}/electricity/${
        values.electricityBill?.name
      }`

      const gasBillFilePath = `files/${
        user?.userId
      }/${getCurrentMonthYear().replace('/', '-')}/gas/${values.gasBill?.name}`

      const fuelBillFilePath = `files/${
        user?.userId
      }/${getCurrentMonthYear().replace('/', '-')}/fuel/${
        values.fuelBill?.name
      }`

      const carBillFilePath = `files/${
        user?.userId
      }/${getCurrentMonthYear().replace('/', '-')}/car/${values.carBill?.name}`

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
          electricityBillFilePath,
          gasBillFilePath,
          fuelBillFilePath,
          carBillFilePath
        }

        await addDoc(collection(db, 'data'), dataDoc)

        // File upload
        const storage = getStorage()
        const storageRef = ref(storage)

        electricityFileRef = ref(storageRef, electricityBillFilePath)
        gasFileRef = ref(storageRef, gasBillFilePath)
        fuelFileRef = ref(storageRef, fuelBillFilePath)
        carFileRef = ref(storageRef, carBillFilePath)

        await uploadBytes(electricityFileRef, values.electricityBill)
        await uploadBytes(gasFileRef, values.gasBill)
        await uploadBytes(fuelFileRef, values.fuelBill)
        await uploadBytes(carFileRef, values.carBill)
      } catch (error) {
        console.log(error)
      }
    }
  })

  const calculate = () => {
    const result = `${
      Number(formik.values.electricUsage) * 105 +
      Number(formik.values.gasUsage) * 105 +
      Number(formik.values.fuelUsage) * 113 +
      Number(formik.values.avgMilesDriven) * 52
    } lbs`
    setCarbonFootPrint(result)
  }

  useEffect(() => {
    if (
      formik.values.electricUsage &&
      formik.values.fuelUsage &&
      formik.values.gasUsage &&
      formik.values.avgMilesDriven
    ) {
      calculate()
    }
  }, [
    formik.values.electricUsage,
    formik.values.fuelUsage,
    formik.values.gasUsage,
    formik.values.avgMilesDriven
  ])

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
              Carbon footprint:{' '}
              {carbonFootPrint ?? 'Please enter required values'}
            </Typography>
          </Grid>
          <Grid container item xs={12} alignItems={'center'}>
            <input
              type="file"
              id="electricityBill"
              name="electricityBill"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={event => {
                formik.setFieldValue(
                  'electricityBill',
                  event?.currentTarget?.files?.[0]
                )
              }}
              style={{ display: 'none' }}
            />
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={'bold'}>
                Upload your electricity bill
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <label htmlFor="electricityBill">
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
                value={
                  formik.values.electricityBill
                    ? formik.values.electricityBill.name
                    : ''
                }
                error={
                  formik.touched.electricityBill &&
                  Boolean(formik.errors.electricityBill)
                }
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems={'center'}>
            <input
              type="file"
              id="gasBill"
              name="gasBill"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={event => {
                formik.setFieldValue(
                  'gasBill',
                  event?.currentTarget?.files?.[0]
                )
              }}
              style={{ display: 'none' }}
            />
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={'bold'}>
                Upload your gas bill
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <label htmlFor="gasBill">
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
                value={formik.values.gasBill ? formik.values.gasBill.name : ''}
                error={formik.touched.gasBill && Boolean(formik.errors.gasBill)}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems={'center'}>
            <input
              type="file"
              id="fuelBill"
              name="fuelBill"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={event => {
                formik.setFieldValue(
                  'fuelBill',
                  event?.currentTarget?.files?.[0]
                )
              }}
              style={{ display: 'none' }}
            />
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={'bold'}>
                Upload your fuel bill
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <label htmlFor="fuelBill">
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
                value={
                  formik.values.fuelBill ? formik.values.fuelBill.name : ''
                }
                error={
                  formik.touched.fuelBill && Boolean(formik.errors.fuelBill)
                }
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems={'center'}>
            <input
              type="file"
              id="carBill"
              name="carBill"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={event => {
                formik.setFieldValue(
                  'carBill',
                  event?.currentTarget?.files?.[0]
                )
              }}
              style={{ display: 'none' }}
            />
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={'bold'}>
                Upload your car bill
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <label htmlFor="carBill">
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
                value={formik.values.carBill ? formik.values.carBill.name : ''}
                error={formik.touched.carBill && Boolean(formik.errors.carBill)}
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
