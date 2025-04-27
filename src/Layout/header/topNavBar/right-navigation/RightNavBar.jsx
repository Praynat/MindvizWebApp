import { Box, IconButton, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { useMyUser } from "../../../../Providers/Users/UserProvider";
import { useDarkLightTheme } from "../../../../Theme/ThemeProvider";
import Logged from "./Logged";
import NotLogged from "./NotLogged";
import MoreButton from "./MoreButton";
import SearchModal from "../../../../Components/Search/SearchModal";
import useTasks from "../../../../Hooks/Tasks/useTasks"; // Import the hook, not the context provider

export default function RightNavBar() {
  const { user, loading } = useMyUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme } = useDarkLightTheme();
  
  // Use your existing hook
  const { 
    tasks,  
    handleUpdateCard, 
  } = useTasks();
  
  // Get the selected task ID from wherever it's being stored
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  const handleSelectTask = (task) => {
    setSelectedTaskId(task?._id || null);
    // Navigate to task or perform other actions as needed
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "right",
          width: "100%",
        }}
      >
        <IconButton 
          onClick={handleSearchClick} 
          sx={{ 
            mr: 2,
            color: theme.strongTextColor
          }}
        >
          <SearchIcon />
        </IconButton>

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

      {/* Search Modal */}
      <SearchModal
        open={isSearchOpen}
        onClose={handleCloseSearch}
        tasks={tasks || []}
        onSelectTask={handleSelectTask}
        onUpdateTask={handleUpdateCard}
        selectedTaskId={selectedTaskId}
      />
    </>
  );
}
