import { useCallback, useEffect, useState } from "react";
import { useSnack } from "../../Providers/Utils/SnackbarProvider";
import useAxios from "../useAxios";
import {
  createTask,
  deleteTask,
  editTask,
  MyTasks,
  TaskById,
} from "../../Services/Tasks/tasksApiService";
import normalizeTask from "../../Helpers/Tasks/normalizeTask";
import initialTestModel from "../../Data/MindMapping/initialTestModel.json";

export default function useTasks() {
  const [task, setTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const setSnack = useSnack();

  useAxios();

  // Fetch all tasks
  const getAllMyTasks = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await MyTasks();
      setTasks(data || []); // Ensure tasks are always an array
      return data || []; // Return tasks for further use
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies to avoid re-creation

  // Initialize demo tasks if needed
  const initializeTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch existing tasks
      const existingTasks = await MyTasks();
      const existingIds = new Set(existingTasks.map((t) => t._id));

      // Filter tasks to create
      const tasksToCreate = initialTestModel.filter(
        (item) => !existingIds.has(item._id)
      );

      if (tasksToCreate.length === 0) {
        setSnack("info", "All demo tasks already exist");
        return;
      }

      // Create the new tasks
      const creationPromises = tasksToCreate.map(async (task) => {
        try {
          return await createTask(normalizeTask(task));
        } catch (error) {
          console.error("Error creating task:", error);
          return null;
        }
      });

      await Promise.all(creationPromises); // Wait for all tasks to be created
      setSnack("success", "Demo tasks initialized successfully!");
      await getAllMyTasks(); // Refresh the task list
    } catch (error) {
      console.error("Failed to initialize tasks:", error);
      setError(error.message);
      setSnack("error", "Failed to initialize tasks");
    } finally {
      setIsLoading(false);
    }
  }, [setSnack, getAllMyTasks]); // Proper dependencies for memoization

  // Effect to initialize tasks on first render
  useEffect(() => {
    const initialize = async () => {
      const fetchedTasks = await getAllMyTasks();
      if (fetchedTasks.length === 0) {
        await initializeTasks();
        await getAllMyTasks();
      }
    };
    initialize();
  }, [getAllMyTasks, initializeTasks]); // No `tasks.length` dependency to avoid loops

  const getTaskById = useCallback(async (id) => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await TaskById(id);
      setTask(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTaskByName = useCallback(async (name) => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await TaskById(name);
      setTask(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreateCard = useCallback(
    async (taskFromClient) => {      
      setError(null);
      setIsLoading(true);

      try {
        const newTask = await createTask(normalizeTask(taskFromClient));        
        setTask(newTask);
        setSnack("success", "A new task has been created");
        setTimeout(() => {
          getAllMyTasks();
        }, 1000);
        return newTask;
        
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [setSnack,getAllMyTasks]
  );

  const handleUpdateCard = useCallback(
    async (taskId, taskFromClient) => {
      setIsLoading(true);
      try {
        const updated = await editTask(taskId, normalizeTask(taskFromClient));
        setTask(updated);
        setSnack("success", "The task has been successfully updated");

        setTimeout(() => {
          getAllMyTasks();
        }, 1000);

      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [setSnack,getAllMyTasks]
  );

  async function handleDeleteCard(taskId, skipConfirm = false) {
    if (!skipConfirm) {
      const confirmed = window.confirm("Are you sure you want to delete this Task?");
      if (!confirmed) return;
    }
  
    setIsLoading(true);
    try {
      // 1) Get the "childTask" being deleted
      const childTask = await getTaskById(taskId);
      if (!childTask) throw new Error("Task not found");
  
      // 2) For each parent, remove this child from `childrenIds`
      const parentIds = childTask.parentIds || [];
      for (const parentId of parentIds) {
        const parentTask = await getTaskById(parentId);
        if (parentTask) {
          const updatedChildrenIds = (parentTask.childrenIds || []).filter(
            (cId) => cId !== taskId
          );
          await handleUpdateCard(parentId, {
            ...parentTask,
            childrenIds: updatedChildrenIds,
          });
        }
      }
  

      await deleteTask(taskId);
      setSnack("success", "Task deleted");

    } catch (error) {
      console.error("Error deleting task:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  


  

  return {
    tasks,
    task,
    error,
    isLoading,
    getAllMyTasks,
    getTaskById,
    getTaskByName,
    handleCreateCard,
    handleUpdateCard,
    handleDeleteCard,
    initializeTasks,
  };
}
