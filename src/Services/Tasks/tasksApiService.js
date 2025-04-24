import axios from "axios";
const apiUrl="https://localhost:7048/Tasks";

// Helper function for consistent error logging
const logApiError = (context, error) => {
  console.error(`❌ Error in ${context}:`, error.message); // Log error message
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(`   Response Status: ${error.response.status}`);
    console.error("   Response Data:", error.response.data);
    // console.error("   Response Headers:", error.response.headers); // Usually too verbose
    if (error.response.data?.errors) {
      console.error("   Validation Errors:", error.response.data.errors);
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error("   No response received for the request:", error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("   Error setting up the request:", error.message);
  }
};


export const MyTasks = async () => {
    const context = "MyTasks";
    console.log(`🚀 GET ${apiUrl}/my-tasks/`);
    try {
      const response = await axios.get(`${apiUrl}/my-tasks/`);
      console.log(`✅ ${context} Success:`, response.data);
      return response.data;
    } catch (error) {
      logApiError(context, error);
      return Promise.reject(error.message);
    }
  };

  export const TaskById = async (taskId) => {
    const context = "TaskById";
    console.log(`🚀 GET ${apiUrl}/task-id/${taskId}`);
    try {
      const { data } = await axios.get(`${apiUrl}/task-id/${taskId}`);
      console.log(`✅ ${context} Success (ID: ${taskId}):`, data);
      return data;
    } catch (error) {
      logApiError(context, error);
      return Promise.reject(error.message);
    }
  }

  export const TaskByName = async (name) => {
    const context = "TaskByName";
    // Note: The original code used /task-id/ for name lookup, assuming that's intended.
    console.log(`🚀 GET ${apiUrl}/task-id/${name}`);
    try {
      const { data } = await axios.get(`${apiUrl}/task-id/${name}`);
      console.log(`✅ ${context} Success (Name: ${name}):`, data);
      return data;
    } catch (error) {
      logApiError(context, error);
      return Promise.reject(error.message);
    }
  }

  export const createTask = async (task) => {
    const context = "createTask";
    console.log(`🚀 POST ${apiUrl}`, task);
    try {
      const { data } = await axios.post(apiUrl, task);
      console.log(`✅ ${context} Success:`, data);
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
    console.log(`🚀 PUT ${apiUrl}/${taskId}`, normalizedTask);
    try {
      const { data } = await axios.put(`${apiUrl}/${taskId}`, normalizedTask);
      console.log(`✅ ${context} Success (ID: ${taskId}):`, data);
      return data;
    } catch (error) {
      logApiError(context, error);
      return Promise.reject(error.message);
    }
  };

export const deleteTask = async (taskId) => {
  const context = "deleteTask";
  console.log(`🚀 DELETE ${apiUrl}/${taskId}`);
  try {
    const { data } = await axios.delete(`${apiUrl}/${taskId}`);
    console.log(`✅ ${context} Success (ID: ${taskId}):`, data);
    return data;
  } catch (error) {
    logApiError(context, error);
    return Promise.reject(error.message);
  }
};
