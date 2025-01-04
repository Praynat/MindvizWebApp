import {  Paper } from '@mui/material'
import React from 'react'

import LeftSide from './left-side/LeftSide';
import RightSide from './right-side/RightSide';
import { useDarkLightTheme } from '../../Theme/ThemeProvider';

export default function Footer() {
  const { theme } = useDarkLightTheme();
  return (
    <Paper 
    elevation={3}
    sx={{position:"fixed", bottom:"0",left:"0",right:"0",width:"100%",backgroundColor:theme.secondaryColor, height:"68px",display:"flex",alignItems:"center",justifyContent:"space-between"}}
    >
      
      <LeftSide/>
      <RightSide/>
      
    </Paper>
  )
}
