import React, { useState, useRef, useEffect } from 'react';
import { Box, Modal, TextField, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDarkLightTheme } from '../../Theme/ThemeProvider';
import TaskCard from '../Tasks/Cards/TaskCard';
import './SearchModal.css';

const SearchModal = ({ open, onClose, tasks, onSelectTask, onUpdateTask, selectedTaskId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useDarkLightTheme();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const filteredTasks = tasks ? tasks.filter(task => 
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="search-modal-title"
    >
      <Box className="search-modal-container" sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '900px',
        height: '80vh',
        bgcolor: "white",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="search-modal-title" variant="h6" component="h2" sx={{ color: theme.strongTextColor }}>
            Search Tasks
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: theme.strongTextColor }} />
          </IconButton>
        </Box>
        
        <TextField
          inputRef={searchInputRef}
          fullWidth
          variant="outlined"
          placeholder="Search for tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: theme.borderColor },
              '&:hover fieldset': { borderColor: theme.accentColor },
              '&.Mui-focused fieldset': { borderColor: theme.accentColor },
            },
            '& .MuiInputBase-input': { color: theme.strongTextColor }
          }}
        />
        
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <Box key={task._id} sx={{ mb: 1 }}>
                <TaskCard
                  task={task}
                  allTasks={tasks}
                  mode="medium"
                  onSelectTask={() => {
                    onSelectTask(task);
                    onClose();
                  }}
                  onUpdateTask={onUpdateTask}
                  isRootTask={!task.parentIds || task.parentIds.length === 0}
                  isSelected={selectedTaskId === task._id}
                />
              </Box>
            ))
          ) : (
            <Typography sx={{ color: theme.weakTextColor, textAlign: 'center', mt: 4 }}>
              {searchTerm ? 'No tasks found matching your search' : 'Start typing to search tasks'}
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default SearchModal;