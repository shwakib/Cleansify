import {
  BaseSelectProps,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import React from 'react'
import { GenericItem } from '../types/common'

export interface DropdownProps extends BaseSelectProps {
  label: string
  value: string
  onChange: (e) => void
  options: GenericItem[]
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  onChange,
  options,
  value,
  name,
  fullWidth,
  ...props
}) => {
  return (
    <FormControl variant="standard" fullWidth={fullWidth}>
      <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        name={name}
        {...props}
      >
        {options.map(option => {
          return <MenuItem value={option.value}>{option.name}</MenuItem>
        })}
      </Select>
    </FormControl>
  )
}

export default Dropdown
