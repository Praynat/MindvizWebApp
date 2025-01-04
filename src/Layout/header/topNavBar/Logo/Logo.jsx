import {  Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import ROUTES from '../../../../Routes/routesModel'
import { FiLayers } from "react-icons/fi";
import { useDarkLightTheme } from '../../../../Theme/ThemeProvider';
import NavBarLink from '../../../../Components/Routes/NavBarLink';

export default function Logo() {
  const { theme } = useDarkLightTheme();
  return (
    <NavBarLink to={ROUTES.HOME}>

      <Box sx={{margin:"1rem", display:"flex", alignItems:"center"}}>
        <IconButton>
              <FiLayers color={theme.strongTextColor}/>
        </IconButton>

          <Typography variant='h4'  sx={{
            fontFamily:"Open-Sans", fontWeight:"600",fontSize:"22px", marginRight:"2", color:theme.strongTextColor, textDecoration:"none" , 
          }}>
          Mindviz
          </Typography>
      </Box>

   </NavBarLink>
  )
}
