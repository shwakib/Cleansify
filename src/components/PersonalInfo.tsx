import { Grid, Paper, Stack, Typography, TypographyProps } from '@mui/material'
import React from 'react'
import { PersonalInfoProps } from 'types/personalInfo.type'

const StyledLabel: React.FC<TypographyProps> = ({
  variant = 'body2',
  fontWeight = 'bold',
  ...props
}) => {
  return <Typography variant={variant} fontWeight={fontWeight} {...props} />
}

const StyledData: React.FC<TypographyProps> = ({
  variant = 'subtitle2',
  fontWeight = 'bold',
  ...props
}) => {
  return <Typography variant={variant} {...props} />
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  name,
  address,
  email,
  phoneNumber,
  dateOfBirth,
  nationalId
}) => {
  return (
    <Grid item container xs={12} md={6}>
      <Paper elevation={3} sx={{ padding: '30px' }}>
        <Grid container item spacing={2}>
          <Grid item spacing={1} container xs={12}>
            <Stack>
              <StyledLabel variant="body2">Name</StyledLabel>
              <StyledData>{name}</StyledData>
            </Stack>
          </Grid>
          <Grid item spacing={1} container xs={12}>
            <Stack>
              <StyledLabel variant="body2">Email</StyledLabel>
              <StyledData>{email}</StyledData>
            </Stack>
          </Grid>
          <Grid item spacing={1} container xs={12}>
            <Stack>
              <StyledLabel variant="body2">Address</StyledLabel>
              <StyledData>{address}</StyledData>
            </Stack>
          </Grid>
          <Grid item spacing={1} container xs={12}>
            <Stack>
              <StyledLabel variant="body2">Phone number</StyledLabel>
              <StyledData>{phoneNumber}</StyledData>
            </Stack>
          </Grid>
          {dateOfBirth ? (
            <Grid item spacing={1} container xs={12}>
              <Stack>
                <StyledLabel variant="body2">Date of birth</StyledLabel>
                <StyledData>
                  {dateOfBirth.month}/{dateOfBirth.day}/{dateOfBirth.year}
                </StyledData>
              </Stack>
            </Grid>
          ) : null}
          {nationalId ? (
            <Grid item spacing={1} container xs={12}>
              <Stack>
                <StyledLabel variant="body2">National Id</StyledLabel>
                <StyledData>{nationalId}</StyledData>
              </Stack>
            </Grid>
          ) : null}
        </Grid>
      </Paper>
    </Grid>
  )
}

export default PersonalInfo
