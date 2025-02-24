import axios from "axios";
const apiUrl="https://localhost:7048/Tasks";

export const MyTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/my-tasks/`);
      const data = response.data;   
      return data;
    } catch (error) {
      return Promise.reject(error.message);
    }
  };
  export const TaskById = async (taskId) => {
    try {
      const { data } = await axios.get(`${apiUrl}/task-id/${taskId}`);
      return data;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
  export const TaskByName = async (name) => {
    try {
      const { data } = await axios.get(`${apiUrl}/task-id/${name}`);
      return data;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }

  export const createTask = async (task) => {
    console.log("Creating task:", task);
    
    try {
      const { data } = await axios.post(apiUrl, task);
      console.log("Backend Response (createTask):", data);
      return data;
    } catch (error) {
      console.error("Error making request:", error.message); // Log error message
      if (error.response && error.response.data && error.response.data.errors) {
        console.error("Validation Errors:", error.response.data.errors);
      }
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received for the request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up the request:", error.message);
      }
      throw new Error(error.message);
    }
  };

  export const editTask = async (taskId, normalizedTask) => {
    try {
      const { data } = await axios.put(`${apiUrl}/${taskId}`, normalizedTask);
      return data;
    } catch (error) {
      console.error("Error making request:", error.message); // Log error message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received for the request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up the request:", error.message);
      }
      return Promise.reject(error.message);
    }
  };
export const deleteTask = async (taskId) => {
  try {
    const { data } = await axios.delete(`${apiUrl}/${taskId}`);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
};
