import {
  BaseSelectProps,
  FormControl,
  FormHelperText,
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
  errorMessage?: string
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  onChange,
  options,
  value,
  name,
  fullWidth,
  error,
  errorMessage,
  ...props
}) => {
  return (
    <FormControl variant="standard" fullWidth={fullWidth} error={error}>
      <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        name={name}
        {...props}
      >
        {options.map(option => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.name}
            </MenuItem>
          )
        })}
      </Select>
      <FormHelperText>{error && errorMessage}</FormHelperText>
    </FormControl>
  )
}

export default Dropdown
