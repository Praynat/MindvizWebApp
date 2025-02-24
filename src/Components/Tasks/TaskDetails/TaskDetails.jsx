import React from 'react';
import './../Css/TaskDetailsGeneral.css';
import './../Css/TaskDetailsSidebar.css';
import './../Css/TaskDetailsPage.css';
import './../Css/TaskDetailsModal.css';
export default function TaskDetails({ task, allTasks, onSelectTask, mode, onClose }) {
  // Helper to find a task’s name by its id from allTasks
  const getTaskName = (id) => {
    const found = allTasks.find((t) => t._id === id);
    return found ? found.name : id;
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
              {task.childrenIds.map((childId) => (
                <div
                  key={childId}
                  className="card"
                  onClick={() =>
                    onSelectTask(allTasks.find((t) => t._id === childId))
                  }
                >
                  {getTaskName(childId)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
