import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import { useMyUser } from "../../Providers/Users/UserProvider";
import useTasks from "../../Hooks/Tasks/useTasks";
import useForm from "../../Hooks/Forms/useForm";
import initialTaskForm from "../../Components/Forms/initialTaskForm";
import taskSchema from "../../Models/Tasks/taskSchema";
import ROUTES from "../../Routes/routesModel";
import TaskForm from "../../Components/Forms/TaskForm";
import { useGroups } from "../../Hooks/Groups/useGroups";

// Helper maps for bitmask conversion (move to a utils file later?)
const weekDayMap = { Sunday: 1, Monday: 2, Tuesday: 4, Wednesday: 8, Thursday: 16, Friday: 32, Saturday: 64 };
const monthMap = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16, 6: 32, 7: 64, 8: 128, 9: 256, 10: 512, 11: 1024, 12: 2048 };

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useMyUser();
  const { tasks, isLoading: isLoadingTasks, error: tasksError, handleCreateCard } = useTasks();
  const {
    selectedId: selectedGroupId,
    
    getGroupIdByTaskId,
  } = useGroups();
  const {
    data,
    errors,
    setData,
    handleChange,
    handleReset,
    validateForm,
    onSubmit,
  } = useForm(initialTaskForm, taskSchema, handleCreateTask);

  // Effect to apply prefill data from navigation state
  useEffect(() => {
    const prefillData = location.state?.prefill;
    if (prefillData && setData) {
      // Merge prefill data with initial form state
      // Ensure parentIds is always an array
      const parentIds = Array.isArray(prefillData.parentIds) ? prefillData.parentIds : (prefillData.parentIds ? [prefillData.parentIds] : []);
      setData(prevData => ({
        ...prevData, // Keep existing defaults
        ...prefillData, // Apply prefilled values
        parentIds: parentIds, // Ensure parentIds is correct format
        isDeadline: !!prefillData.deadline, // Set isDeadline based on prefilled deadline
      }));
    }
  }, [location.state, setData]);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
    }
  }, [user, navigate]);

  async function handleCreateTask(formData) {
    try {
      const payload = { ...formData };

      payload.userId = user?._id;

      if (payload.weekDays && payload.frequency === 'Weekly') {
        payload.weekDays = payload.weekDays.reduce((mask, day) => mask | (weekDayMap[day] || 0), 0);
      } else {
        payload.weekDays = 0;
      }

      if (payload.monthOfYear && payload.frequency === 'Yearly') {
        payload.monthOfYear = monthMap[payload.monthOfYear] || 0;
      } else {
        payload.monthOfYear = 0;
      }

      payload.isDeadline = !!payload.deadline;

      if (!payload.isFrequency) {
        delete payload.frequency;
        delete payload.startDate;
        delete payload.endDate;
        delete payload.weekDays;
        delete payload.dayOfMonth;
        delete payload.monthOfYear;
        delete payload.frequencyInterval;
      } else if (payload.frequency !== 'Weekly') {
        delete payload.weekDays;
      } else if (payload.frequency !== 'Monthly') {
        delete payload.dayOfMonth;
      } else if (payload.frequency !== 'Yearly') {
        delete payload.monthOfYear;
      } else if (payload.frequency !== 'Custom') {
        delete payload.frequencyInterval;
      }

      if (!payload.description) delete payload.description;
      if (!payload.links?.length) delete payload.links;
      if (!payload.tags?.length) delete payload.tags;
      if (!payload.endDate) delete payload.endDate;

// resolve which group this new task belongs to
      // 1) if the form gave us a parent task, find its group
      // 2) otherwise fall back to the currently selected group
      let groupId = selectedGroupId;
      if (payload.parentIds?.length) {
        groupId = await getGroupIdByTaskId(payload.parentIds[0]);
      }
      await handleCreateCard(payload, groupId);

      const fromPath = location.state?.from?.pathname + location.state?.from?.search || ROUTES.MINDMAPPING_VIEW; 
      navigate(fromPath, { replace: true });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  if (isLoadingTasks) return <Typography>Loading tasks...</Typography>;
  if (tasksError) return <Typography color="error">Error loading tasks: {tasksError}</Typography>;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Task
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
          submitButtonText="Create Task"
        />
      </Box>
    </Container>
  );
}