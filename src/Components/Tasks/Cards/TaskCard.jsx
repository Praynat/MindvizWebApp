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
  onUpdateTask,
  isRootTask,
  isSelected  // Accept the new prop
}) => {
  // If no isRootTask prop is passed explicitly, compute it as a fallback.
  const computedIsRootTask = typeof isRootTask !== 'undefined' 
    ? isRootTask 
    : (!task.parentIds || task.parentIds.length === 0);
  
    const handleCompletionToggle = (isComplete) => {
      onUpdateTask(task._id, { ...task, isChecked: isComplete });
    };

  const isCompleted = task.progress === 100;

  // Prepare a class name that TaskCard variants can use. For example, you might want to
  // pass both computedIsRootTask (for root styling) and isSelected (for selection styling).
  const cardProps = {
    task,
    isCompleted,
    onSelectTask,
    onToggleCompletion: handleCompletionToggle,
    // Pass computedIsRootTask so your subcomponent can apply “root-task” styling
    isRootTask: computedIsRootTask,
    // And pass isSelected to let the subcomponent add a “selected” class.
    isSelected
  };

  // Select the appropriate card layout based on mode.
  switch (mode) {
    case 'minimal':
      return <TaskCardMinimal {...cardProps} />;
    case 'medium':
      return <TaskCardMedium {...cardProps} />;
    case 'full':
      return (
        <TaskCardFull 
          {...cardProps} 
          allTasks={allTasks}
          onUpdateTask={onUpdateTask}
        />
      );
    default:
      return <TaskCardMinimal {...cardProps} />;
  }
};

export default TaskCard;
