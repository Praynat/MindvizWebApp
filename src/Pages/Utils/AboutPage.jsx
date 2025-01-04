import React from 'react'
import { Container, Typography } from '@mui/material'


export default function AboutPage() {
  return (
    <Container sx={{display:"flex", flexDirection:"column" , width:"60%", height:"55vh" }}>
      <Typography variant="h1" sx={{fontFamily:"roboto", fontWeight:"550",fontSize:"48px", marginBottom:"30px", color:'white'}}>
          About Cardify Pro
      </Typography>

      <Typography variant="body1" sx={{fontFamily:"Open-Sans", fontWeight:"200",fontSize:"18px", marginRight:"2", color:'#D1D5DB', lineHeight:"28px"}}>
        CardifyPro is a platform dedicated to connecting businesses and individuals through innovative card designs. Our mission is to provide a creative space where users can explore and create custom cards that represent their unique brand and personality.
      </Typography>
      <br />

      <Typography variant="body1" sx={{fontFamily:"Open-Sans", fontWeight:"200",fontSize:"18px", marginRight:"2", color:'#D1D5DB'}}>
         With a user-friendly interface and a wide range of customization options, CardifyPro empowers users to design cards that stand out. Whether you're looking to network, promote your business, or simply share your contact information, CardifyPro is your go-to solution for professional and personal card creation.
      </Typography>
      
    </Container>
  )
}
