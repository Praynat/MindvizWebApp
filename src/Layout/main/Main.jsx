import { Box } from '@mui/material'
import React from 'react'
import { useDarkLightTheme } from '../../Theme/ThemeProvider';

export default function Main({children}) {
  const { theme } = useDarkLightTheme();
  return (
    <Box sx={{
        display:"flex",
        flexDirection:"vertical",
        alignItems:"center",
        mt:"68px",
        minHeight:"85vh",
        backgroundColor:theme.backgroundColor,
        paddingBottom: '68px', // Space for the footer
        overflow:"auto"
        }}>
        {children}
    </Box>
  )
}
