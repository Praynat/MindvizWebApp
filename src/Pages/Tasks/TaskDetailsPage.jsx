import React from 'react';
import { useParams } from 'react-router-dom';

const TaskDetailsPage = () => {
  const { id } = useParams(); // Access the dynamic ':id' parameter

  return (
    <div>
      <h1>Task Details</h1>
      <p>Details for task with ID: {id}</p>
    </div>
  );
};

export default TaskDetailsPage;
