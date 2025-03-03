import React from 'react';
import TaskDetails from '../../Components/Tasks/TaskDetails/TaskDetails';

const TaskDetailsPage = ({ task, allTasks, onSelectTask, mode, onClose, onUpdateTask }) => {
  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className={`task-details-page ${mode}`}>
      <TaskDetails
        task={task}
        allTasks={allTasks}
        onSelectTask={onSelectTask}
        onUpdateTask={onUpdateTask}
        mode={mode}
        onClose={onClose}
      />
    </div>
  );
};

export default TaskDetailsPage;
