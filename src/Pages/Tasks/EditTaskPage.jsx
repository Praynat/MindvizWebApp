import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Box, Container } from '@mui/material';
import useTasks from '../../Hooks/Tasks/useTasks';
import TaskForm from '../../Components/Forms/TaskForm';
import ROUTES from '../../Routes/routesModel';
import useForm from '../../Hooks/Forms/useForm';
import initialTaskForm from '../../Components/Forms/initialTaskForm';
import taskSchema from '../../Models/Tasks/taskSchema';

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getTaskById, handleUpdateCard, loading: loadingTaskDetails, error: taskError, tasks, getAllMyTasks } = useTasks();
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);

  const performUpdate = async (formDataFromHook) => {
    const payload = { ...formDataFromHook };
    
    // For tasks with no parents, ensure parentIds is an empty array to avoid validation error
    if (!payload.parentIds || payload.parentIds.length === 0) {
      payload.parentIds = [];
    }

    const success = await handleUpdateCard(id, payload);
    if (success) {
      const fromPath = location.state?.from?.pathname + location.state?.from?.search || ROUTES.MINDMAPPING_VIEW;
      navigate(fromPath, { replace: true });
    }
  };

  const {
    data,
    errors,
    setData,
    handleChange,
    handleReset,
    validateForm,
    onSubmit,
  } = useForm(initialTaskForm, taskSchema, performUpdate);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetchingInitialData(true);
      try {
        await getAllMyTasks(); // Fetch all tasks for dropdowns etc.
        const taskData = await getTaskById(id);

        if (taskData) {
          const isRootTask = taskData.isRoot || false;
          
          const populatedData = {
            ...initialTaskForm, // Start with defaults
            ...taskData,        // Override with fetched data

            // For root tasks, set empty parentIds to avoid validation error
            parentIds: isRootTask ? [] : (Array.isArray(taskData.parentIds) ? taskData.parentIds : []),
            
            // Ensure arrays are arrays
            links: Array.isArray(taskData.links) ? taskData.links : [],
            tags: Array.isArray(taskData.tags) ? taskData.tags : [],
            weekDays: Array.isArray(taskData.weekDays) ? taskData.weekDays : [],

            // Ensure these fields have valid values
            isRoot: isRootTask
          };

          setData(populatedData);
        } else {
          console.error("Task not found");
          navigate(ROUTES.TASKS, { replace: true });
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        setIsFetchingInitialData(false);
      }
    };

    fetchData();
  }, [id, getTaskById, getAllMyTasks, navigate, setData]);

  if (isFetchingInitialData || (loadingTaskDetails && !isFetchingInitialData)) {
    return <Typography>Loading task details...</Typography>;
  }
  if (taskError) {
    return <Typography color="error">Error: {taskError.message || 'Failed to load task'}</Typography>;
  }

  // Determine if this is a root task (either marked as isRoot OR has no parents)
  const isRootTask = data?.isRoot || (!data?.parentIds || data?.parentIds.length === 0);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Task
        </Typography>
        <TaskForm
          onSubmit={onSubmit}
          onReset={handleReset}
          errors={errors}
          onInputChange={handleChange}
          setData={setData}
          data={data}
          tasks={tasks}
          validateForm={validateForm}
          isEditing={true}
          isRootTask={isRootTask} // Pass either explicit isRoot or tasks with no parents
        />
      </Box>
    </Container>
  );
};

export default EditTaskPage;