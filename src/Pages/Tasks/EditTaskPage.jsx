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

    const success = await handleUpdateCard(id, payload); // Use handleUpdateCard
    if (success) {
      const fromPath = location.state?.from?.pathname + location.state?.from?.search || ROUTES.MINDMAPPING_VIEW; // Default to mindmap view
      navigate(fromPath, { replace: true }); // Use replace to avoid adding edit page to history
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
          const populatedData = {
            ...initialTaskForm, // Start with defaults
            ...taskData,        // Override with fetched data

            // Ensure arrays are arrays
            parentIds: Array.isArray(taskData.parentIds) ? taskData.parentIds : [],
            links: Array.isArray(taskData.links) ? taskData.links : [],
            tags: Array.isArray(taskData.tags) ? taskData.tags : [],
            weekDays: Array.isArray(taskData.weekDays) ? taskData.weekDays : [], // Ensure weekDays is always an array

            // Ensure frequency-specific fields are null if not applicable or invalid
            monthOfYear: taskData.monthOfYear,
            dayOfMonth: taskData.dayOfMonth,
            frequencyInterval: taskData.frequencyInterval,
          };

          if (!populatedData.isFrequency) {
            populatedData.frequency = null;
            populatedData.startDate = null;
            populatedData.endDate = null;
            populatedData.weekDays = [];
            populatedData.dayOfMonth = null;
            populatedData.monthOfYear = null;
            populatedData.frequencyInterval = null;
          }

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
          isRootTask={data?.isRoot || false} // <-- Pass isRoot status here
        />
      </Box>
    </Container>
  );
};

export default EditTaskPage;