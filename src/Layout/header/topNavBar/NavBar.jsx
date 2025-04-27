import React from 'react'
import LeftNavBar from './left-navigation/LeftNavBar'
import { AppBar,  Grid, Toolbar } from '@mui/material'
import RightNavBar from './right-navigation/RightNavBar'
import { MenuProvider } from './Menu/MenuProvider'
import Logo from './Logo/Logo'
import { useDarkLightTheme } from '../../../Theme/ThemeProvider'

export default function NavBar() {
  const { theme } = useDarkLightTheme();
  
  return (
    <MenuProvider>
      <AppBar sx={{position:'fixed !important' ,top:"0 !important", backgroundColor:theme.secondaryColor, height:"10vh"}} elevation={1}>
        <Toolbar sx={{justifyContent:"space-between", alignContent:"center"}}>

          <Grid container width={"100%"} justifyContent="space-between"alignItems="center">
            <Grid container={false} sm={5} sx={{ overflow: "hidden", minWidth: 0 }}>
                  <LeftNavBar noWrap/>
                </Grid>
                <Grid container={false} xs={4} sm={2}>
                  <Logo/>
                </Grid>
                <Grid container={false}  sm={5} sx={{display:"flex", justifyContent:"flex-end"}}>
                  <RightNavBar/>
                </Grid>
            </Grid>
        </Toolbar>
      </AppBar>
    </MenuProvider>
  )
}
