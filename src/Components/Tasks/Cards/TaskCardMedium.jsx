import React from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../Routes/routesModel';

const TaskCardMedium = ({ task, isCompleted, onSelectTask, onToggleCompletion, isRootTask, isSelected }) => {
  const dueDate = task.endDate ? new Date(task.endDate).toLocaleDateString() : 'No due date';
  
  // Calculate if task is overdue
  const isOverdue = task.endDate ? new Date(task.endDate) < new Date() && !isCompleted : false;
   const navigate = useNavigate();

const handleEdit = () => {
    // replace with your actual route constant
    navigate(`${ROUTES.EDIT_TASK}/${task._id}`, {
      state: { prefill: task }
    });
  };
  return (
    <div 
      className={`task-card task-card-medium ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isRootTask ? 'root-task' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelectTask && onSelectTask(task)}
    >
      <div className="task-card-header">
        {!isRootTask && (
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => onToggleCompletion(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            className="task-checkbox"
          />
        )}
        <span className={`task-title ${isCompleted ? 'completed' : ''} ${isRootTask ? 'root-title' : ''}`}>
          {task.name}
          {isRootTask && <span className="root-indicator">root</span>}
        </span>
        <div className="task-actions">
          <button className="edit-button" onClick={(e) => {e.stopPropagation(); handleEdit();}}>
            ✏️
          </button>
        </div>
      </div>
      
      <div className="task-card-body">
        <div className="task-meta">
          <span className="due-date">
            {isOverdue ? '⚠️ ' : '📅 '}{dueDate}
          </span>
          <span className="progress-value">
            {task.progress || 0}%
          </span>
        </div>
        
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{width: `${task.progress || 0}%`}}
            title={`Progress: ${task.progress || 0}%`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TaskCardMedium;