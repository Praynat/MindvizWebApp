import React from 'react';
import TaskCardMinimal from './TaskCardMinimal';

const TaskCardFull = ({ 
  task, 
  allTasks, 
  isCompleted, 
  onSelectTask, 
  onToggleCompletion,
  onUpdateTask,
  isRootTask
}) => {
  
  const dueDate = task.endDate ? new Date(task.endDate).toLocaleDateString() : 'No due date';
  const createdDate = task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown';
  
  // Calculate if task is overdue
  const isOverdue = task.endDate ? new Date(task.endDate) < new Date() && !isCompleted : false;
  
  // Get subtasks (children) if any
  const subtasks = task.childrenIds ? 
    task.childrenIds.map(id => allTasks.find(t => t._id === id)).filter(Boolean) : 
    [];

  // Get parent tasks if any
  const parentTasks = task.parentIds ? 
    task.parentIds.map(id => allTasks.find(t => t._id === id)).filter(Boolean) : 
    [];

  return (
    <div className={`task-card task-card-full ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isRootTask ? 'root-task' : ''}`}>
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
          <button className="edit-button" onClick={(e) => {e.stopPropagation(); /* Add edit handler */}}>
            ✏️
          </button>
        </div>
      </div>
      
      <div className="task-card-body">
        <div className="task-meta">
          <span className="due-date">
            {isOverdue ? '⚠️ ' : '📅 '}{dueDate}
          </span>
          <span className="created-date">Created: {createdDate}</span>
          {task.weight && <span className="weight">Weight: {task.weight}</span>}
        </div>
        
        <div className="progress-container">
          <div className="progress-label">Progress: {task.progress || 0}%</div>
          <div className="progress-track">
            <div 
              className="progress-bar" 
              style={{width: `${task.progress || 0}%`}}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="task-card-details">
        {task.description && (
          <div className="task-description">
            <h4>Description</h4>
            <p>{task.description}</p>
          </div>
        )}
        
        {parentTasks.length > 0 && (
          <div className="task-parents">
            <h4>Parent Tasks</h4>
            <div className="parents-grid">
              {parentTasks.map(parent => (
                <div key={parent._id} className="parent-card-wrapper">
                  <TaskCardMinimal
                    task={parent}
                    isCompleted={parent.progress === 100}
                    onSelectTask={() => onSelectTask && onSelectTask(parent)}
                    onToggleCompletion={(checked) => {
                      const updatedParent = {
                        ...parent,
                        progress: checked ? 100 : 0
                      };
                      onUpdateTask(parent._id, updatedParent);
                    }}
                    isRootTask={!parent.parentIds || parent.parentIds.length === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {subtasks.length > 0 && (
          <div className="task-children">
            <h4>Subtasks</h4>
            <div className="subtasks-grid">
              {subtasks.map(subtask => (
                <div key={subtask._id} className="subtask-card-wrapper">
                  <TaskCardMinimal
                    task={subtask}
                    isCompleted={subtask.progress === 100}
                    onSelectTask={() => onSelectTask && onSelectTask(subtask)}
                    onToggleCompletion={(checked) => {
                      const updatedSubtask = {
                        ...subtask,
                        progress: checked ? 100 : 0
                      };
                      onUpdateTask(subtask._id, updatedSubtask);
                    }}
                    isRootTask={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCardFull;