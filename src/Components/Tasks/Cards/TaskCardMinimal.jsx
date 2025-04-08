import React from 'react';

const TaskCardMinimal = ({ task, isCompleted, onSelectTask, isRootTask, onToggleCompletion }) => {
  return (
    <div 
      className={`task-card task-card-minimal ${isCompleted ? 'completed' : ''} ${isRootTask ? 'root-task' : ''}`}
      onClick={() => onSelectTask && onSelectTask(task)}
    >
      <div className="task-card-content">
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
      </div>
    </div>
  );
};

export default TaskCardMinimal;