import React from "react";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";
import { useDarkLightTheme } from "../../../../Theme/ThemeProvider";
import NavItem from "../../../../Components/Routes/NavItem";
import ROUTES from "../../../../Routes/routesModel";

const NotLogged = () => {
  const { theme } = useDarkLightTheme();
  const location = useLocation();
  const getButtonStyle = (route) => ({
    color: theme.strongTextColor,
    m:"0 0.1rem",
    backgroundColor: location.pathname === route ? theme.highlightColor : theme.secondaryColor,
  });
  return (
    <Box sx={{ display:{ xs: "none", md: "flex" }}}>
      
      <NavItem
      buttonSx={getButtonStyle(ROUTES.LOGIN)}
      sx={{height:"100px"}}
      to={ROUTES.LOGIN} 
      label={"Login"}/>
      <NavItem
      buttonSx={{color:"white", m:"0 0.1rem"}}
      sx={{height:"100px"}}
      to={ROUTES.SIGNUP} 
      label={"Signup"}
      variant="contained"
      color="primary"
      />
        
    </Box>
  );
};

export default NotLogged;