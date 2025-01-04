import React from 'react';
import { useParams } from 'react-router-dom';

const EditTaskPage = () => {
  const { id } = useParams(); // Access the dynamic ':id' parameter

  return (
    <div>
      <h1>Edit Task</h1>
      <p>You are editing task with ID: {id}</p>
    </div>
  );
};

export default EditTaskPage;
