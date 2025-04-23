import React, { useEffect, useState } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import { Typography, Box, Container } from '@mui/material'; // Import necessary MUI components
import useTasks from '../../Hooks/Tasks/useTasks';
import TaskForm from '../../Components/Forms/TaskForm';
import ROUTES from '../../Routes/routesModel';
import useForm from '../../Hooks/Forms/useForm'; // Import useForm
import initialTaskForm from '../../Components/Forms/initialTaskForm'; // Import initial form state
import taskSchema from '../../Models/Tasks/taskSchema'; // Import the schema

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getTaskById, handleUpdateCard, loading: loadingTaskDetails, error: taskError, tasks, getAllMyTasks } = useTasks();
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);

  // Define the actual update logic function to pass to useForm
  const performUpdate = async (formDataFromHook) => {
    const payload = { ...formDataFromHook };

    const success = await handleUpdateCard(id, payload); // Use handleUpdateCard
    if (success) {
      const fromPath = location.state?.from?.pathname + location.state?.from?.search || ROUTES.MINDMAPPING_VIEW; // Default to mindmap view
      navigate(fromPath, { replace: true }); // Use replace to avoid adding edit page to history
        }
  };

  // Use the useForm hook
  const {
    data,
    errors,
    setData, // Get setData to populate the form
    handleChange,
    handleReset,
    validateForm,
    onSubmit, // Use onSubmit from the hook
  } = useForm(initialTaskForm, taskSchema, performUpdate); // Pass the update logic

  useEffect(() => {
    const fetchData = async () => {
        setIsFetchingInitialData(true);
        try {
            await getAllMyTasks(); // Fetch all tasks for dropdowns etc.
            const taskData = await getTaskById(id);

            if (taskData) {
                // Use setData from useForm to populate the form state
                // Ensure data structure matches initialTaskForm and schema requirements
                 const populatedData = {
                    ...initialTaskForm, // Start with defaults
                    ...taskData,        // Override with fetched data

                    // Ensure arrays are arrays
                    parentIds: Array.isArray(taskData.parentIds) ? taskData.parentIds : [],
                    links: Array.isArray(taskData.links) ? taskData.links : [],
                    tags: Array.isArray(taskData.tags) ? taskData.tags : [],
                    weekDays: Array.isArray(taskData.weekDays) ? taskData.weekDays : [], // Ensure weekDays is always an array

                    // Ensure frequency-specific fields are null if not applicable or invalid
                    // (Check against valid values if necessary, otherwise default to null/initial)
                    monthOfYear: taskData.monthOfYear, // Assuming taskData.monthOfYear is valid or null if fetched
                    dayOfMonth: taskData.dayOfMonth,   // Assuming taskData.dayOfMonth is valid or null if fetched
                    frequencyInterval: taskData.frequencyInterval, // Assuming taskData.frequencyInterval is valid or null

                    // You might need more specific checks depending on how data is stored/fetched:
                    // Example: If monthOfYear could be invalid string "None" from backend:
                    // monthOfYear: (typeof taskData.monthOfYear === 'number' || monthOfYearValues.includes(taskData.monthOfYear))
                    //                 ? taskData.monthOfYear
                    //                 : null,
                };

                // If the task is NOT recurring, explicitly nullify frequency fields
                // that might have been spread from initialTaskForm
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
                navigate(ROUTES.TASKS, { replace: true }); // Redirect if task not found
            }
        } catch (err) {
            console.error("Error fetching initial data:", err);
        } finally {
            setIsFetchingInitialData(false);
        }
    };

    fetchData();
  }, [id, getTaskById, getAllMyTasks, navigate, setData]);

  // Combine loading states
  if (isFetchingInitialData || (loadingTaskDetails && !isFetchingInitialData)) {
    return <Typography>Loading task details...</Typography>;
  }

  // Display error
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
          // Pass props from useForm hook
          onSubmit={onSubmit} // Pass onSubmit from useForm
          onReset={handleReset}
          errors={errors}
          onInputChange={handleChange} // Pass generic handleChange
          // Pass handleCheckboxChange if TaskForm uses checkboxes directly needing it
          // handleCheckboxChange={handleCheckboxChange}
          setData={setData} // Pass setData if TaskForm needs direct manipulation (less ideal)
          data={data} // Pass form data state
          tasks={tasks} // Pass all tasks for dropdowns
          validateForm={validateForm} // Pass validation status for button disabling
          isEditing={true} // Keep isEditing flag if TaskForm uses it for conditional rendering
        />
      </Box>
    </Container>
  );
};

export default EditTaskPage;