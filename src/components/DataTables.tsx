import { DataTable } from '../models/data.model'
import React from 'react'
import Accordion from './Accordion'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { getMonthName } from '../utils/helper'
import { StyledLabel } from './PersonalInfo'

const DataTables: React.FC<DataTable> = props => {
  return (
    <>
      {Object.keys(props).map(year => (
        <Accordion title={year}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <StyledLabel>Month</StyledLabel>
                  </TableCell>
                  <TableCell>
                    <StyledLabel>Electricity Usage</StyledLabel>
                  </TableCell>
                  <TableCell>
                    <StyledLabel>Gas Usage</StyledLabel>
                  </TableCell>
                  <TableCell>
                    <StyledLabel>Fuel Usage</StyledLabel>
                  </TableCell>
                  <TableCell>
                    <StyledLabel>Average Miles Driven</StyledLabel>
                  </TableCell>
                  <TableCell>
                    <StyledLabel>Carbon Footprint</StyledLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props[year].map((data, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{getMonthName(data.date)}</TableCell>
                      <TableCell>{data.electricUsage}</TableCell>
                      <TableCell>{data.gasUsage}</TableCell>
                      <TableCell>{data.fuelUsage}</TableCell>
                      <TableCell>{data.avgMilesDriven}</TableCell>
                      <TableCell>{data.carbonFootPrint}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Accordion>
      ))}
    </>
  )
}

export default DataTables
