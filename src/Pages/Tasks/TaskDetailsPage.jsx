import React from 'react';
import TaskDetails from '../../Components/Tasks/TaskDetails/TaskDetails';

export default function TaskDetailsPage({ task, allTasks, onSelectTask, mode, onClose }) {
  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className={`task-details-page ${mode}`}>
      <TaskDetails
        task={task}
        allTasks={allTasks}
        onSelectTask={onSelectTask}
        mode={mode}
        onClose={onClose}
      />
    </div>
  );
}
