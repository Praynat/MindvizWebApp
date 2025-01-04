import { Box, IconButton, Typography } from '@mui/material';
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import React from 'react'
import { useDarkLightTheme } from '../../../Theme/ThemeProvider';

export default function RightSide() {
  const { toggleTheme,isToggleDark} = useDarkLightTheme();
  const { theme } = useDarkLightTheme();

  return (
    
    <Box sx={{display:"flex", alignItems:"center",m:"0.01rem"}}>
    <Typography variant="body1" color={theme.strongTextColor}>&copy;2024 CardifyPro</Typography>
    <IconButton sx={{ ml: 1 }} onClick={toggleTheme}>
          {isToggleDark ? 
          <LightModeIcon sx={{ color: 'white' }}/> : 
          <DarkModeIcon sx={{ color: 'black' }}/>}
        </IconButton>
    </Box>
  )
}
