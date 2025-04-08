import React, { useState, useEffect, useMemo } from 'react';
import TaskDetails from '../Components/Tasks/TaskDetails/TaskDetails';
import { useSnack } from '../Providers/Utils/SnackbarProvider';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import useTasks from '../Hooks/Tasks/useTasks';
import './Css/ListPage.css';
const ListPage = () => {
  const { tasks, isLoading, error, getAllMyTasks, handleUpdateCard } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const { setSnack } = useSnack();

  // Derive categories from tasks data
  const categories = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    
    // Find the root task
    const rootTask = tasks.find(t => !t.parentIds || t.parentIds.length === 0);
    if (!rootTask) return [];
    
    // Get all category tasks (children of root)
    return rootTask.childrenIds
      .map(childId => {
        const category = tasks.find(t => t._id === childId);
        if (!category) return null;
        
        // For each category, find its items (children)
        const items = category.childrenIds?.map(itemId => {
          const item = tasks.find(t => t._id === itemId);
          if (!item) return null;
          return {
            _id: item._id,
            id: item._id, // For compatibility with both props
            name: item.name,
            subCategories: [] // Add subcategories if needed
          };
        }).filter(Boolean) || [];
        
        return {
          _id: category._id,
          id: category._id, // For compatibility with both props
          name: category.name,
          items: items
        };
      })
      .filter(Boolean);
  }, [tasks]);

  useEffect(() => {
    getAllMyTasks();
  }, [getAllMyTasks]);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      // Select the first root task as default (usually your main task)
      const rootTask = tasks.find(t => !t.parentIds || t.parentIds.length === 0);
      setSelectedTask(rootTask || tasks[0]);
    }
  }, [tasks]);

  useEffect(() => {
    if (error) {
      setSnack("error", "Failed to load tasks: " + error);
    }
  }, [error, setSnack]);

  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="list-page-container">
      {selectedTask && (
        <TaskDetails
          mode="page"
          task={selectedTask}
          allTasks={tasks || []}
          categories={categories}
          onSelectTask={handleSelectTask}
          onUpdateTask={handleUpdateCard}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default ListPage;