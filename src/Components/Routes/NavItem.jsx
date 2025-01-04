import React from 'react'
import NavBarLink from './NavBarLink'
import { Button, Typography } from '@mui/material'

export default function NavItem({to,sx,label,buttonSx,variant = 'default',color='inherit'}) {
  return (
    <NavBarLink to={to} sx={{display:"flex",alignItems:"center",...sx}}>
        <Button variant={variant} color={color} sx={{
          ...buttonSx, 
          '&:hover': {
            backgroundColor: buttonSx.backgroundColor, 
            color: buttonSx.color,
          },}}> 
            <Typography>
                {label}
            </Typography>
        </Button>
    </NavBarLink>
  )
}
