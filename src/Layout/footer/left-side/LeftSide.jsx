import React from 'react'
import ROUTES from '../../../Routes/routesModel'
import { Box } from '@mui/material'
import { useDarkLightTheme } from '../../../Theme/ThemeProvider';
import { useLocation } from 'react-router-dom';
import NavItem from '../../../Components/Routes/NavItem';

export default function LeftSide() {
  const { theme } = useDarkLightTheme();
  const location = useLocation();
  const getButtonStyle = (route) => ({
    color: theme.strongTextColor,
    
    backgroundColor: location.pathname === route ? theme.highlightColor : theme.secondaryColor,
  });
  return (
    <Box sx={{ml:"1rem"}}>
    <NavItem
          buttonSx={getButtonStyle(ROUTES.ABOUT)}
          sx={{height:"100px"}}
          to={ROUTES.ABOUT} 
          label={"About us"}/>
      <NavItem
          buttonSx={getButtonStyle(ROUTES.CONTACT)}
          sx={{height:"100px"}}
          to={ROUTES.CONTACT} 
          label={"Contact us"}/>
    </Box>
  )
}
