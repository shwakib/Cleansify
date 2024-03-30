import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary,
  AccordionProps as MuiAccordionProps
} from '@mui/material'
import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface AccordionProps extends MuiAccordionProps {
  //   open: boolean
  //   setOpen: () => void
  title: string
}

const Accordion: React.FC<AccordionProps> = ({
  //   open,
  //   setOpen,
  children,
  title,
  key,
  ...props
}) => {
  return (
    <MuiAccordion key={key} {...props}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {title}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </MuiAccordion>
  )
}

export default Accordion
