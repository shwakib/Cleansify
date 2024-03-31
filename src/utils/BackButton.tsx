import React from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

const BackButton = ({ onClick }) => {
  return (
    <div style={{ position: 'absolute', top: '15px', left: '30px',fontSize:20, color:'black' }}>
      <IconButton aria-label="back" onClick={onClick}>
        <ArrowBackIosNewOutlinedIcon />
      </IconButton>
    </div>
  );
};

export default BackButton;