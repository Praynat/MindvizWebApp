import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TaskList from './TaskList';

const TaskListView = ({ tasks = [] }) => {
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Build the task map for quick lookup
  const taskMap = tasks.reduce((map, task) => {
    map[task._id] = task;
    return map;
  }, {});

  // Filter tasks when selection changes
  useEffect(() => {
    if (!selectedTaskId) {
      // Show all tasks when no task is selected
      setFilteredTasks(tasks);
    } else {
      // Show the selected task and all its descendants
      const tasksToShow = getTaskAndAllDescendants(selectedTaskId, taskMap);
      setFilteredTasks(tasksToShow);
    }
  }, [selectedTaskId, tasks, taskMap]);

  // Handler for sidebar task selection
  const handleTaskSelect = (task) => {
    setSelectedTaskId(task ? task._id : null);
  };

  // Get top-level tasks to use as main sidebar items
  const rootTasks = tasks.filter(task => !task.parentIds || task.parentIds.length === 0);
  
  // Find child tasks for each top-level task
  const buildTaskHierarchy = (parentTask) => {
    if (!parentTask || !parentTask.childrenIds) return parentTask;
    
    return {
      ...parentTask,
      subCategories: parentTask.childrenIds
        .map(childId => taskMap[childId])
        .filter(Boolean)
        .map(buildTaskHierarchy)
    };
  };
  
  // Build the complete hierarchy
  const taskHierarchy = rootTasks.map(buildTaskHierarchy);

  return (
    <div className="task-list-view">
      <Sidebar 
        categories={taskHierarchy} 
        onFilterSelect={handleTaskSelect} 
      />
      <TaskList tasks={filteredTasks} />
    </div>
  );
};

// Helper function to get a task and all its descendants
const getTaskAndAllDescendants = (taskId, taskMap) => {
  const result = [];
  
  // Recursive function to collect all descendants
  const collectTasks = (id) => {
    const task = taskMap[id];
    if (!task) return;
    
    // Add this task
    result.push(task);
    
    // Add all children recursively
    if (task.childrenIds && task.childrenIds.length > 0) {
      task.childrenIds.forEach(childId => collectTasks(childId));
    }
  };
  
  collectTasks(taskId);
  return result;
};

export default TaskListView;