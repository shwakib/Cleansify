import { DataTable } from '../models/data.model'
import React from 'react'
import Accordion from './Accordion'

const DataTables: React.FC<DataTable> = props => {
  return (
    <>
      {Object.keys(props).map(year => (
        <Accordion title={year}>
          {props[year].map((data, index) => {
            console.log(data)

            return <li key={index}>{data.userId}</li>
          })}
        </Accordion>
      ))}
    </>
  )
}

export default DataTables
