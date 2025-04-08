import { Box, IconButton,CircularProgress } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { useMyUser } from "../../../../Providers/Users/UserProvider";
import { useDarkLightTheme } from "../../../../Theme/ThemeProvider";
import Logged from "./Logged";
import NotLogged from "./NotLogged";
import MoreButton from "./MoreButton";


export default function RightNavBar() {
  const { user,loading } = useMyUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme } = useDarkLightTheme();
  const searchBarRef = useRef(null);

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleClickOutside = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent:"right",
          width: "100%",
        }}
      >
        {/* <div ref={searchBarRef} style={{height:"100%", display:"flex", alignItems:"center"}}>
          <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div> */}
        
        {/* <IconButton onClick={handleSearchClick} sx={{display:isSearchOpen?"none":"flex"}}>
          <SearchIcon sx={{color:theme.strongTextColor}}/>
        </IconButton> */}


{loading ? (
          <CircularProgress size={24} sx={{ mr: 2 }} />
        ) : (
          <>
            {user && <Logged />}
            {!user && <NotLogged />}
          </>
        )}
      </Box>
      <MoreButton />
    </>
  );
}
