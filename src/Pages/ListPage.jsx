import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TaskDetails from '../Components/Tasks/TaskDetails/TaskDetails';
import { useSnack } from '../Providers/Utils/SnackbarProvider';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import useTasks from '../Hooks/Tasks/useTasks';
import QuickAddBar from '../Components/Tasks/QuickAddBar/QuickAddBar'; 
import './Css/ListPage.css';
import { useNavigate, useLocation } from 'react-router-dom';import ROUTES from '../Routes/routesModel';

const ListPage = () => {
  // Get handleCreateCard from useTasks
  const { tasks, isLoading, error, getAllMyTasks, handleUpdateCard, handleCreateCard,handleDeleteCard } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const { setSnack } = useSnack();
  const navigate = useNavigate(); // Initialize navigate
    const location = useLocation(); // Get current location

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
  const handleAddChildFromSidebar = useCallback((parentTask) => {
    navigate(ROUTES.CREATE_TASK, {
      state: {
        prefill: { parentIds: [parentTask._id] },
        from: location
      }
    });

  }, [navigate, location]); // Add navigate and location as dependencies
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

  // Define the handler for when a task is created via QuickAddBar
  const handleQuickTaskCreated = async (newTaskData) => {
    const success = await handleCreateCard(newTaskData);
    if (success) {
      // Optionally refresh all tasks, though handleCreateCard should update the state
      // await getAllMyTasks();
    }
    // Error handling is done within handleCreateCard/useTasks
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
          onDeleteTask={handleDeleteCard} // Pass delete handler
          onAddChild={handleAddChildFromSidebar} // This now navigates
          onNavigate={navigate} // Pass navigate function
          onClose={() => setSelectedTask(null)}
        />
      )}
      {/* Render QuickAddBar at the bottom */}
      <QuickAddBar
        tasks={tasks}
        selectedTask={selectedTask} // Pass the currently selected task (optional, for default parent)
        onTaskCreated={handleQuickTaskCreated} // Pass the creation handler
      />
    </div>
  );
};

export default ListPage;