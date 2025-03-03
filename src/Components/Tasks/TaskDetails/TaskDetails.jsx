import React from 'react';
import './../Css/TaskDetailsGeneral.css';
import './../Css/TaskDetailsSidebar.css';
import './../Css/TaskDetailsPage.css';
import './../Css/TaskDetailsModal.css';

export default function TaskDetails({ task, allTasks, onSelectTask, mode, onClose, onUpdateTask }) {
  // Helper to find a task's name by its id from allTasks
  const getTaskName = (id) => {
    const found = allTasks.find((t) => t._id === id);
    return found ? found.name : id;
  };

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
    const taskToUpdate = allTasks.find((t) => t._id === childId);
    if (taskToUpdate) {
      const updatedTask = {
        ...taskToUpdate,
        progress: isComplete ? 100 : 0
      };
      onUpdateTask(childId, updatedTask);
    }
  };

  return (
    <div className={`task-details ${mode}`}>
      <div className="header">
        <h2>{task.name}</h2>
        {mode === 'modal' && (
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        )}
      </div>
      <div className="description">
        <p>{task.description}</p>
      </div>
      
      {/* Metrics: Progress and Weight combined */}
      <div className="metrics">
        <span>Progress: {task.progress}%</span>
        <span> | Weight: {task.weight}</span>
      </div>
      
      {/* Dates combined */}
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
      
      {/* Relationships: Parent and Children displayed as clickable cards */}
      <div className="relationships">
        {task.parentIds && task.parentIds.length > 0 && (
          <div className="parents">
            <h3>Parent Task(s):</h3>
            <div className="card-container">
              {task.parentIds.map((parentId) => (
                <div
                  key={parentId}
                  className="card"
                  onClick={() =>
                    onSelectTask(allTasks.find((t) => t._id === parentId))
                  }
                >
                  {getTaskName(parentId)}
                </div>
              ))}
            </div>
          </div>
        )}
        {task.childrenIds && task.childrenIds.length > 0 && (
          <div className="children">
            <h3>SubTasks:</h3>
            <div className="card-container task-details-subtasks">
              {task.childrenIds.map((childId) => {
                const isCompleted = isTaskCompleted(childId);
                const isDisabled = isParentCompleted(childId);
                
                return (
                  <div
                    key={childId}
                    className={`card subtask-card ${isCompleted ? 'completed' : ''} ${isDisabled ? 'disabled' : ''}`}
                  >
                    <div className="subtask-content">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={(e) => handleCompletionToggle(childId, e.target.checked)}
                        className="subtask-checkbox"
                      />
                      <span 
                        className="subtask-name"
                        onClick={() => !isDisabled && onSelectTask(allTasks.find((t) => t._id === childId))}
                      >
                        {getTaskName(childId)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
