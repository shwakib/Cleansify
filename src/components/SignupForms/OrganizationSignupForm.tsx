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
import { AccountTypes, StateNames } from '../../constants/common'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { deleteObject, getStorage, ref, uploadBytes } from 'firebase/storage'
import app from '../../config/firebase.config'
import { OrgUser } from '../../models/user.model'
import Backdrop from '../../components/Backdrop'

interface Factory {
  address: {
    fullAddress: string
    state: string
  }
}

interface FormValues extends Omit<OrgUser, 'userId'> {
  password: string
}

type OrgUserDoc = Omit<OrgUser, 'file'>

const OrganizationSignupForm = () => {
  const [showForm, setShowForm] = useState(false)
  const [factories, setFactories] = useState<Factory[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const auth = getAuth(app)
  const db = getFirestore(app)

  const initialValues: FormValues = {
    accountType: AccountTypes.ORGANIZATION,
    orgName: '',
    productType: '',
    address: {
      fullAddress: '',
      state: ''
    },
    email: '',
    phoneNumber: '',
    password: '',
    file: null as unknown as File
  }

  const formik = useFormik({
    initialValues,
    onSubmit: async values => {
      let fileRef
      setLoading(true)
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        )

        const user = userCredentials.user

        try {
          const userDoc: OrgUserDoc = {
            accountType: AccountTypes.ORGANIZATION,
            userId: user.uid,
            orgName: values.orgName,
            productType: values.productType,
            address: {
              fullAddress: values.address.fullAddress,
              state: values.address.state
            },
            email: values.email,
            phoneNumber: values.phoneNumber,
            filePath: `files/${user.uid}/${values.file?.name}`
          }
          if (user) {
            await addDoc(collection(db, 'orgUsers'), userDoc)
          }

          // Create a reference to Firebase Storage
          const storage = getStorage()
          const storageRef = ref(storage)

          // Upload the file to Firebase Storage
          fileRef = ref(storageRef, `files/${user.uid}/${values.file?.name}`)
          await uploadBytes(fileRef, values.file)
          formik.resetForm()
        } catch (error) {
          await user.delete()
          if (fileRef) {
            try {
              await deleteObject(fileRef)
            } catch (deleteError) {
              console.error('Error deleting file:', deleteError)
            }
          }
          console.log(error)
        }
      } catch (err) {
        if (fileRef) {
          try {
            await deleteObject(fileRef)
          } catch (deleteError) {
            console.error('Error deleting file:', deleteError)
          }
        }
        console.log(err)
      }
      setLoading(false)
    }
  })

  const factoryFormik = useFormik({
    initialValues: {
      address: {
        fullAddress: '',
        state: ''
      }
    },
    onSubmit: values => {
      setFactories(prevState => [
        ...prevState,
        {
          address: {
            fullAddress: values.address.fullAddress,
            state: values.address.state
          }
        }
      ])
      setShowForm(false)
      factoryFormik.resetForm()
    }
  })

  const handleDownload = () => {
    if (formik.values.file) {
      // Create a temporary URL for the file
      const url = URL.createObjectURL(formik.values.file)

      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a')
      link.href = url
      link.download = formik.values.file.name
      document.body.appendChild(link)
      link.click()

      // Clean up by revoking the URL
      URL.revokeObjectURL(url)
    }
  }

  return (
    <>
      {loading ? <Backdrop open={loading} /> : null}
      <form>
        <Grid container xs={12} rowSpacing={3}>
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={12} md={7}>
              <TextField
                variant="standard"
                label="Organization name"
                fullWidth
                value={formik.values.orgName}
                name="orgName"
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                variant="standard"
                label="Product / Service type"
                fullWidth
                value={formik.values.productType}
                name="productType"
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={12} md={7}>
              <TextField
                variant="standard"
                label="Address"
                fullWidth
                value={formik.values.address.fullAddress}
                name="address.fullAddress"
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={5}>
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
          <Grid container item xs={12} spacing={5}>
            <Grid item xs={12} md={4}>
              <TextField
                variant="standard"
                label="Phone number"
                fullWidth
                type="number"
                value={formik.values.phoneNumber}
                name="phoneNumber"
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="email"
                variant="standard"
                label="Email"
                fullWidth
                value={formik.values.email}
                name="email"
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="password"
                variant="standard"
                label="Password"
                fullWidth
                value={formik.values.password}
                name="password"
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12}>
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
            <label htmlFor="file">
              <Button variant="contained" component="span">
                Upload File
              </Button>
            </label>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
                endAdornment: formik.values.file && (
                  <Button variant="text" onClick={handleDownload}>
                    Download
                  </Button>
                )
              }}
              value={formik.values.file ? formik.values.file.name : ''}
              error={formik.touched.file && Boolean(formik.errors.file)}
            />
          </Grid>
        </Grid>
      </form>
      <Grid container item xs={12}>
        <Button
          variant="outlined"
          onClick={() => setShowForm(true)}
          size="medium"
        >
          Add Factory
        </Button>
      </Grid>
      {showForm && (
        <form onSubmit={factoryFormik.handleSubmit}>
          <Grid container xs={12} spacing={5} alignItems={'center'}>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                label="Address"
                fullWidth
                name="address.fullAddress"
                value={factoryFormik.values.address.fullAddress}
                onChange={factoryFormik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Dropdown
                fullWidth
                label="State"
                value={factoryFormik.values.address.state}
                name="address.state"
                onChange={factoryFormik.handleChange}
                options={StateNames}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="contained" type="submit" fullWidth>
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
      {factories.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1" fontWeight={'bold'}>
                  Address
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight={'bold'}>
                  State
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {factories.map((factory, index) => (
              <TableRow key={index}>
                <TableCell>{factory.address.fullAddress}</TableCell>
                <TableCell>{factory.address.state}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
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

export default OrganizationSignupForm
