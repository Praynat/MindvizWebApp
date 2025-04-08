import React from 'react';
import TaskCardMinimal from './TaskCardMinimal';
import TaskCardMedium from './TaskCardMedium';
import TaskCardFull from './TaskCardFull';
import './css/TaskCard.css';

const TaskCard = ({ 
  task, 
  allTasks = [], 
  mode = 'minimal', 
  onSelectTask, 
  onUpdateTask 
}) => {
     // Determine if this is a root task (has no parents)
  const isRootTask = !task.parentIds || task.parentIds.length === 0;
  
  // Helper functions that can be used by all card types
  const handleCompletionToggle = (isComplete) => {
    const updatedTask = {
      ...task,
      progress: isComplete ? 100 : 0
    };
    onUpdateTask(task._id, updatedTask);
  };

  const isCompleted = task.progress === 100;

  // Select the appropriate card layout based on mode
  switch (mode) {
    case 'minimal':
      return (
        <TaskCardMinimal 
          task={task} 
          isCompleted={isCompleted}
          onSelectTask={onSelectTask}
          isRootTask={isRootTask}
          onToggleCompletion={handleCompletionToggle}
        />
      );
    case 'medium':
      return (
        <TaskCardMedium 
          task={task} 
          isCompleted={isCompleted}
          onSelectTask={onSelectTask}
          isRootTask={isRootTask}
          onToggleCompletion={handleCompletionToggle}
        />
      );
    case 'full':
      return (
        <TaskCardFull 
          task={task} 
          allTasks={allTasks}
          isRootTask={isRootTask}
          isCompleted={isCompleted}
          onSelectTask={onSelectTask}
          onToggleCompletion={handleCompletionToggle}
          onUpdateTask={onUpdateTask}
        />
      );
    default:
      return (
        <TaskCardMinimal 
          task={task} 
          isCompleted={isCompleted}
          onSelectTask={onSelectTask}
          onToggleCompletion={handleCompletionToggle}
        />
      );
  }
};

export default TaskCard;