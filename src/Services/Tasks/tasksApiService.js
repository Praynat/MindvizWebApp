import axios from "axios";
const apiUrl="https://localhost:7048/Tasks";

// Helper function for consistent error logging
const logApiError = (context, error) => {
  console.error(`❌ Error in ${context}:`, error.message); 
  if (error.response) {

    console.error(`   Response Status: ${error.response.status}`);
    console.error("   Response Data:", error.response.data);
    if (error.response.data?.errors) {
      console.error("   Validation Errors:", error.response.data.errors);
    }
  } else if (error.request) {
    console.error("   No response received for the request:", error.request);
  } else {
    console.error("   Error setting up the request:", error.message);
  }
};


export const MyTasks = async () => {
    const context = "MyTasks";
    try {
      const response = await axios.get(`${apiUrl}/my-tasks/`);
      return response.data;
    } catch (error) {
      logApiError(context, error);
      return Promise.reject(error.message);
    }
  };

  export const TaskById = async (taskId) => {
    const context = "TaskById";
    try {
      const { data } = await axios.get(`${apiUrl}/task-id/${taskId}`);
      return data;
    } catch (error) {
      logApiError(context, error);
      return Promise.reject(error.message);
    }
  }

  export const TaskByName = async (name) => {
    const context = "TaskByName";
    // Note: The original code used /task-id/ for name lookup, assuming that's intended.
    try {
      const { data } = await axios.get(`${apiUrl}/task-id/${name}`);
      return data;
    } catch (error) {
      logApiError(context, error);
      return Promise.reject(error.message);
    }
  }

  export const createTask = async (task) => {
    const context = "createTask";
    try {
      const { data } = await axios.post(apiUrl, task);
      return data;
    } catch (error) {
      logApiError(context, error);
      // Re-throw the original error object if you need more details upstream
      // throw error;
      // Or just reject/throw the message
      throw new Error(error.message);
    }
  };

  export const editTask = async (taskId, normalizedTask) => {
    const context = "editTask";
    try {
      const { data } = await axios.put(`${apiUrl}/${taskId}`, normalizedTask);
      return data;
    } catch (error) {
      logApiError(context, error);
      return Promise.reject(error.message);
    }
  };

export const deleteTask = async (taskId) => {
  const context = "deleteTask";
  try {
    const { data } = await axios.delete(`${apiUrl}/${taskId}`);
    return data;
  } catch (error) {
    logApiError(context, error);
    return Promise.reject(error.message);
  }
};
