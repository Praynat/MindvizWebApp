import React, { useEffect } from 'react';
import '../Css/TaskDetailsModal.css';
import TaskCardMinimal from '../Cards/TaskCardMinimal';

const ModalLayout = ({ task, allTasks, onSelectTask, onUpdateTask, onClose }) => {
  // Add ESC key handler
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    // Add event listener
    window.addEventListener('keydown', handleEsc);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Helper to check if a task is completed (progress = 100%)
  const isTaskCompleted = (taskId) => {
    const taskToCheck = allTasks.find((t) => t._id === taskId);
    return taskToCheck && taskToCheck.progress === 100;
  };

  // Helper to check if a task's parent is completed
  const isParentCompleted = (taskId) => {
    const taskToCheck = allTasks.find((t) => t._id === taskId);
    if (!taskToCheck || !taskToCheck.parentIds || taskToCheck.parentIds.length === 0) return false;
    return taskToCheck.parentIds.some(parentId => isTaskCompleted(parentId));
  };

  // Handle task completion toggle
  const handleCompletionToggle = (childId, isComplete) => {
    const childTask = allTasks.find((t) => t._id === childId);
    if (!childTask) return;
    onUpdateTask(childId, { ...childTask, isChecked: isComplete }, { silent: true });
  };

  return (
    <div className="task-details modal">
      <div className="header">
        <h2>{task.name}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="description">
        <p>{task.description}</p>
      </div>
      
      <div className="metrics">
        <span>Progress: {task.progress}%</span>
        <span> | Weight: {task.weight}</span>
      </div>
      
      <div className="dates">
        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
        <span> | Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
        {task.startDate && (
          <span> | Start: {new Date(task.startDate).toLocaleDateString()}</span>
        )}
        {task.endDate && (
          <span> | End: {new Date(task.endDate).toLocaleDateString()}</span>
        )}
      </div>
      
      <div className="relationships">
        {task.parentIds && task.parentIds.length > 0 && (
          <div className="parents">
            <h3>Parent Task(s):</h3>
            <div className="card-container">
              {task.parentIds.map((parentId) => {
                const parentTask = allTasks.find((t) => t._id === parentId);
                const isCompleted = isTaskCompleted(parentId);
                const isRootTask = !parentTask.parentIds || parentTask.parentIds.length === 0;
                
                return parentTask ? (
                  <div key={parentId} className="parent-card-wrapper">
                    <TaskCardMinimal
                      task={parentTask}
                      isCompleted={isCompleted}
                      onSelectTask={() => onSelectTask(parentTask)}
                      isRootTask={isRootTask}
                      onToggleCompletion={(checked) => handleCompletionToggle(parentId, checked)}
                    />
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
        
        {task.childrenIds && task.childrenIds.length > 0 && (
          <div className="children">
            <h3>SubTasks:</h3>
            <div className="card-container task-details-subtasks">
              {task.childrenIds.map((childId) => {
                const childTask = allTasks.find((t) => t._id === childId);
                const isCompleted = isTaskCompleted(childId);
                const isDisabled = isParentCompleted(childId);
                
                return childTask ? (
                  <div 
                    key={childId} 
                    className={`subtask-card-wrapper ${isDisabled ? 'disabled' : ''}`}
                  >
                    <TaskCardMinimal
                      task={childTask}
                      isCompleted={isCompleted}
                      onSelectTask={() => !isDisabled && onSelectTask(childTask)}
                      isRootTask={false}
                      onToggleCompletion={(checked) => handleCompletionToggle(childId, checked)}
                    />
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalLayout;