// SidebarLayout.jsx
import React from 'react';
import './../Css/TaskDetailsSidebar.css';
import TaskCard from '../Cards/TaskCard';

export default function SidebarLayout({
  task,
  allTasks,
  onSelectTask,
  onClose,
  onUpdateTask,
}) {

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="task-details sidebar">
      <div className="header">
        <h2>{task.name}</h2>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="description">
        <p>{task.description}</p>
      </div>
      
      {/* Metrics: Progress and Weight */}
      <div className="metrics">
        <span>Progress: {task.progress}%</span>
        <span> | Weight: {task.weight}</span>
      </div>
      
      {/* Dates */}
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
      
      {/* Parent / Child relationships */}
      <div className="relationships">
        {task.parentIds && task.parentIds.length > 0 && (
          <div className="parents">
            <h3>Parent Task(s):</h3>
            <div className="card-container">
              {task.parentIds.map((parentId) => {
                const parentTask = allTasks.find((t) => t._id === parentId);
                if (!parentTask) return null;
                
                return (
                  <TaskCard
                    key={parentId}
                    task={parentTask}
                    allTasks={allTasks}
                    mode="minimal"
                    onSelectTask={onSelectTask}
                    onUpdateTask={onUpdateTask}
                  />
                );
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
                if (!childTask) return null;
                
                return (
                  <TaskCard
                    key={childId}
                    task={childTask}
                    allTasks={allTasks}
                    mode="minimal"
                    onSelectTask={onSelectTask}
                    onUpdateTask={onUpdateTask}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
