// SidebarLayout.jsx
import React from 'react';
import './../Css/TaskDetailsSidebar.css';
import TaskCard from '../Cards/TaskCard';
import ROUTES from '../../../Routes/routesModel';

export default function SidebarLayout({
  task,
  allTasks,
  onSelectTask,
  onClose,
  onUpdateTask,
  onDeleteTask, // Receive delete handler
  onAddChild,   // Receive add child handler
  onNavigate,   // Receive navigate function
  isRoot,       // <<< Receive isRoot prop
}) {

  if (!task) {
    return <div>Task not found</div>;
  }

  const handleEdit = () => {
    if (onNavigate && task?._id) {
      onNavigate(`${ROUTES.EDIT_TASK}/${task._id}`);
    } else {
      console.error("Navigate function or task ID missing");
    }
  };

  const handleAdd = () => {
    if (onAddChild && task) {
      onAddChild(task); // Pass the current task as the parent
    } else {
       console.error("onAddChild function or task missing");
    }
  };

  const handleDelete = () => {
    if (onDeleteTask && task?._id) {
      onDeleteTask(task._id); // Call the delete handler from useTasks
      onClose(); // Close sidebar after deletion attempt
    } else {
       console.error("onDeleteTask function or task ID missing");
    }
  };

  return (
    <div className="task-details sidebar">
      <div className="header">
        <h2>{task.name}</h2>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      {/* Action Buttons */}
      <div className="sidebar-actions">
        <button onClick={handleEdit} className="sidebar-button edit">Edit</button>
        <button onClick={handleAdd} className="sidebar-button add-child">Add Child</button>
        {/* Conditionally render the delete button */}
        {!isRoot && (
          <button onClick={handleDelete} className="sidebar-button delete">Delete</button>
        )}
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
