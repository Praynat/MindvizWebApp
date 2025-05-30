import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import ROUTES from "../../../../Routes/routesModel";
import { useDarkLightTheme } from "../../../../Theme/ThemeProvider";
import { useLocation } from "react-router-dom";
import NavItem from "../../../../Components/Routes/NavItem";
import { useMyUser } from "../../../../Providers/Users/UserProvider";

export default function LeftNavBar() {  
  const { user } = useMyUser();
  const matchesMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const { theme } = useDarkLightTheme();
  const location = useLocation();  

  const getButtonStyle = (route) => ({
    color: theme.strongTextColor,
    m: "0 1rem",
    backgroundColor: location.pathname === route ? theme.highlightColor : theme.secondaryColor,
  });

  return (
    
    <Box sx={{ display: "flex", alignItems: "center", overflow: 'hidden' }}>
      {matchesMd && (
        <>
        {!user && (
          <NavItem
            buttonSx={getButtonStyle(ROUTES.HOME)}
            sx={{ height: "100px" }}
            to={ROUTES.HOME}
            label={"Home"}
          />
        )}
          {user && (
            <NavItem
              buttonSx={getButtonStyle(ROUTES.MINDMAPPING_VIEW)}
              sx={{ height: "100px" }}
              to={ROUTES.MINDMAPPING_VIEW}
              label={"Mindmapping"}
            />
          )}
          
          {user && (
            <NavItem
              buttonSx={getButtonStyle(ROUTES.LIST_VIEW)}
              sx={{ height: "100px" }}
              to={ROUTES.LIST_VIEW}
              label={"LIST"}
            />
          )}
          {user && (
            <NavItem
              buttonSx={getButtonStyle(ROUTES.GROUPS_VIEW)}
              sx={{ height: "100px" }}
              to={ROUTES.GROUPS_VIEW}
              label={"GROUPS"}
            />
          )}
         
        </>
      )}
    </Box>
  );
}
