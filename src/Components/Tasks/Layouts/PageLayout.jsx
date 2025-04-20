// Imports
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../ListView/Sidebar';
import TaskCard from '../Cards/TaskCard';
import TaskDetails from '../TaskDetails/TaskDetails';
import '../Css/PageLayout.css';

// Component Definition
const PageLayout = ({
  tasks,
  categories,
  onNewTask,
  onFilter,
  onViewChange,
  onSelectTask,
  onUpdateTask,
  task 
}) => {

  // Retrieve Saved Filters
  const getSavedFilters = () => {
    try {
      const savedFilters = localStorage.getItem('mindviz_filters');
      return savedFilters ? JSON.parse(savedFilters) : null;
    } catch (e) {
      console.error("Error loading saved filters", e);
      return null;
    }
  };

  // Initialize States
  const [viewMode, setViewMode] = useState(() => {
    const saved = getSavedFilters();
    return saved?.viewMode || 'list';
  });
  
  const [filterVisible, setFilterVisible] = useState(false);
  
  const [listFilters, setListFilters] = useState(() => {
    const saved = getSavedFilters();
    return saved?.list || { sortBy: 'hierarchy', sortDirection: 'asc', filterName: '' };
  });
  
  const [cardFilters, setCardFilters] = useState(() => {
    const saved = getSavedFilters();
    return saved?.card || { sortBy: 'hierarchy', sortDirection: 'asc', filterName: '' };
  });
  
  const [kanbanFilters, setKanbanFilters] = useState(() => {
    const saved = getSavedFilters();
    return saved?.kanban || { sortBy: 'hierarchy', sortDirection: 'asc', filterName: '' };
  });
  
  const [syncFilters, setSyncFilters] = useState(() => {
    const saved = getSavedFilters();
    return saved?.syncFilters || false;
  });
  
  const [modalTask, setModalTask] = useState(null);
  const [selectedListTask, setSelectedListTask] = useState(null);

  // Filter Functions
  const getCurrentFilter = () => {
    switch (viewMode) {
      case 'list': return listFilters;
      case 'card': return cardFilters;
      case 'kanban': return kanbanFilters;
      default: return listFilters;
    }
  };

  const updateCurrentFilter = (updates) => {
    const newFilter = { ...getCurrentFilter(), ...updates };
    if (syncFilters) {
      setListFilters(newFilter);
      setCardFilters(newFilter);
      setKanbanFilters(newFilter);
    } else {
      switch (viewMode) {
        case 'list':
          setListFilters(newFilter);
          break;
        case 'card':
          setCardFilters(newFilter);
          break;
        case 'kanban':
          setKanbanFilters(newFilter);
          break;
        default:
          break;
      }
    }
  };

  // Persist Filters to localStorage
  useEffect(() => {
    const filtersToSave = {
      viewMode,
      list: listFilters,
      card: cardFilters,
      kanban: kanbanFilters,
      syncFilters
    };
    localStorage.setItem('mindviz_filters', JSON.stringify(filtersToSave));
  }, [viewMode, listFilters, cardFilters, kanbanFilters, syncFilters]);

  // View and Task Handlers
  const handleViewChange = (mode) => {
    setViewMode(mode);
    if (onViewChange) onViewChange(mode);
  };

  const handleTaskSelect = (selectedTask) => {
    if (viewMode === 'list') {
      setSelectedListTask(selectedTask);
    } else {
      setModalTask(selectedTask);
    }
    if (onSelectTask) {
      onSelectTask(selectedTask);
    }
  };
  
  const handleCloseSidebar = () => {
    setSelectedListTask(null);
  };

  const currentFilter = getCurrentFilter();
  const { sortBy, sortDirection, filterName } = currentFilter;
  const handleCloseModal = () => {
    setModalTask(null);
  };

  // Filter and Sort Tasks
  const filteredAndSortedTasks = useMemo(() => {
    if (!tasks) return [];
    
    let result = [...tasks];
    
    // Apply name filter if set.
    if (filterName) {
      result = result.filter(t => t.name.toLowerCase().includes(filterName.toLowerCase()));
    }
    
    // If a sidebar selection exists (i.e. a parent task is selected)…
    if (currentFilter.filterTaskId) {
      // Collect the parent and all its descendants.
      const taskIds = new Set();
      const collectTaskIds = (taskId) => {
        const task = tasks.find(t => t._id === taskId);
        if (task) {
          taskIds.add(task._id);
          if (task.childrenIds && task.childrenIds.length > 0) {
            task.childrenIds.forEach(childId => collectTaskIds(childId));
          }
        }
      };
      collectTaskIds(currentFilter.filterTaskId);
      
      // Only include tasks in this set.
      result = result.filter(task => taskIds.has(task._id));
      
      // Extract the parent's task.
      const parentTask = result.find(task => task._id === currentFilter.filterTaskId);
      // Remove the parent temporarily.
      result = result.filter(task => task._id !== currentFilter.filterTaskId);
      
      // Now sort the remaining tasks based on your chosen sort.
      switch (sortBy) {
        case 'alphabetical':
          result.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return sortDirection === 'asc'
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA);
          });
          break;
        case 'date':
          result.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return sortDirection === 'asc'
              ? dateA - dateB
              : dateB - dateA;
          });
          break;
        case 'hierarchy':
          const rootTasks = result.filter(t => !t.parentIds || t.parentIds.length === 0);
          const childTasks = result.filter(t => t.parentIds && t.parentIds.length > 0);
          rootTasks.sort((a, b) => a.name.localeCompare(b.name));
          childTasks.sort((a, b) => a.name.localeCompare(b.name));
          if (sortDirection === 'desc') {
            rootTasks.reverse();
            childTasks.reverse();
          }
          result = [...rootTasks, ...childTasks];
          break;
        default:
          const defaultRootTasks = result.filter(t => !t.parentIds || t.parentIds.length === 0);
          const defaultChildTasks = result.filter(t => t.parentIds && t.parentIds.length > 0);
          defaultRootTasks.sort((a, b) => a.name.localeCompare(b.name));
          defaultChildTasks.sort((a, b) => a.name.localeCompare(b.name));
          result = [...defaultRootTasks, ...defaultChildTasks];
          break;
      }
      
      // Finally, put the parent's task at the very beginning.
      if (parentTask) {
        result.unshift(parentTask);
      }
      
    } else {
      // If no sidebar selection, apply sorting normally to the entire result.
      switch (sortBy) {
        case 'alphabetical':
          result.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return sortDirection === 'asc'
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA);
          });
          break;
        case 'date':
          result.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return sortDirection === 'asc'
              ? dateA - dateB
              : dateB - dateA;
          });
          break;
        case 'hierarchy':
          const rootTasks = result.filter(t => !t.parentIds || t.parentIds.length === 0);
          const childTasks = result.filter(t => t.parentIds && t.parentIds.length > 0);
          rootTasks.sort((a, b) => a.name.localeCompare(b.name));
          childTasks.sort((a, b) => a.name.localeCompare(b.name));
          if (sortDirection === 'desc') {
            rootTasks.reverse();
            childTasks.reverse();
          }
          result = [...rootTasks, ...childTasks];
          break;
        default:
          const defaultRootTasks = result.filter(t => !t.parentIds || t.parentIds.length === 0);
          const defaultChildTasks = result.filter(t => t.parentIds && t.parentIds.length > 0);
          defaultRootTasks.sort((a, b) => a.name.localeCompare(b.name));
          defaultChildTasks.sort((a, b) => a.name.localeCompare(b.name));
          result = [...defaultRootTasks, ...defaultChildTasks];
          break;
      }
    }
    
    return result;
  }, [tasks, currentFilter, filterName, sortBy, sortDirection]);
  
  
  // Build Task Hierarchy
  const buildTaskHierarchy = (parentTask) => {
    if (!parentTask) return null;
    const children = tasks ? tasks.filter(t => t.parentIds && t.parentIds.includes(parentTask._id)) : [];
    return {
      ...parentTask,
      subCategories: children.length > 0 ? children.map(child => buildTaskHierarchy(child)) : []
    };
  };

  const rootTasks = tasks ? tasks.filter(task => !task.parentIds || task.parentIds.length === 0) : [];
  const taskHierarchy = rootTasks.map(buildTaskHierarchy);

  // Render Component
  return (
    <div className="page-layout">
      <Sidebar 
        categories={taskHierarchy} 
        onFilterSelect={(selectedTask) => {
          if (selectedTask === null) {
            updateCurrentFilter({ filterTaskId: null });
            setSelectedListTask(null);
          } else {
            updateCurrentFilter({ filterTaskId: selectedTask._id });
            setSelectedListTask(selectedTask);
          }
        }}
        
        selectedItemId={currentFilter.filterTaskId}
      />
      <main className="main-content">
        <div className="toolbar">
          <div className="view-toggle">
            <button 
              className={viewMode === 'list' ? 'active' : ''} 
              onClick={() => handleViewChange('list')}>
              List
            </button>
            <button 
              className={viewMode === 'card' ? 'active' : ''} 
              onClick={() => handleViewChange('card')}>
              Cards
            </button>
            <button 
              className={viewMode === 'kanban' ? 'active' : ''} 
              onClick={() => handleViewChange('kanban')}>
              Kanban
            </button>
          </div>
          <div className="action-buttons">
            <button onClick={() => setFilterVisible(!filterVisible)}>
              <i className="icon-filter" /> Filters
            </button>
            <button onClick={onNewTask} className="new-task-btn">
              <i className="icon-plus" /> New Task
            </button>
          </div>
        </div>
        {filterVisible && (
          <div className="filter-options">
            <div className="filter-section">
              <label>
                Search:
                <input 
                  type="text" 
                  value={filterName} 
                  onChange={(e) => updateCurrentFilter({ filterName: e.target.value })}
                  placeholder="Filter by name..." 
                />
              </label>
            </div>
            <div className="filter-section">
              <label>
                Sort By:
                <select 
                  value={sortBy} 
                  onChange={(e) => updateCurrentFilter({ sortBy: e.target.value })}
                >
                  <option value="hierarchy">Hierarchy</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="date">Creation Date</option>
                </select>
              </label>
              <div className="sort-direction">
                <label>
                  <input 
                    type="radio" 
                    checked={sortDirection === 'asc'} 
                    onChange={() => updateCurrentFilter({ sortDirection: 'asc' })}
                  />
                  {sortBy === 'alphabetical' ? 'A to Z' : sortBy === 'date' ? 'Oldest First' : 'Ascending'}
                </label>
                <label>
                  <input 
                    type="radio" 
                    checked={sortDirection === 'desc'} 
                    onChange={() => updateCurrentFilter({ sortDirection: 'desc' })}
                  />
                  {sortBy === 'alphabetical' ? 'Z to A' : sortBy === 'date' ? 'Newest First' : 'Descending'}
                </label>
              </div>
            </div>
            <div className="filter-section sync-option">
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={syncFilters}
                  onChange={() => {
                    if (!syncFilters) {
                      const currentFilter = getCurrentFilter();
                      setListFilters(currentFilter);
                      setCardFilters(currentFilter);
                      setKanbanFilters(currentFilter);
                    }
                    setSyncFilters(!syncFilters);
                  }}
                />
                Apply filters to all views
              </label>
              <button 
                className="reset-filters-btn"
                onClick={() => {
                  const defaultFilter = { sortBy: 'hierarchy', sortDirection: 'asc', filterName: '' };
                  setListFilters(defaultFilter);
                  setCardFilters(defaultFilter);
                  setKanbanFilters(defaultFilter);
                }}
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
        <div className={`tasks ${viewMode}`}>
          {viewMode === 'list' && (
            <div className="list-view-container">
              <div className="task-list-panel">
                <ul className="list-view">
                  {filteredAndSortedTasks.map(task => (
                    <li 
                      key={task._id}
                      id={`task-${task._id}`}
                      className={`list-item ${selectedListTask && selectedListTask._id === task._id ? 'selected' : ''}`}
                      onClick={() => handleTaskSelect(task)}
                    >
                      <TaskCard
                        task={task}
                        allTasks={tasks}
                        mode="medium"
                        onSelectTask={() => handleTaskSelect(task)}
                        onUpdateTask={onUpdateTask}
                        isRootTask={!task.parentIds || task.parentIds.length === 0}
                        isSelected={currentFilter.filterTaskId === task._id}
                        />
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`task-details-panel ${selectedListTask ? 'open' : ''}`}>
                {selectedListTask && (
                  <TaskDetails
                    task={selectedListTask}
                    allTasks={tasks}
                    onSelectTask={handleTaskSelect}
                    onUpdateTask={onUpdateTask}
                    mode="sidebar"
                    onClose={handleCloseSidebar}
                  />
                )}
              </div>
            </div>
          )}
          {viewMode === 'card' && (
            <div className="card-view">
              {filteredAndSortedTasks.map(task => (
                <div key={task._id} className="card-item">
                  <TaskCard
                    task={task}
                    allTasks={tasks}
                    mode="medium"
                    onSelectTask={handleTaskSelect}
                    onUpdateTask={onUpdateTask}
                    isRootTask={!task.parentIds || task.parentIds.length === 0}
                    isSelected={currentFilter.filterTaskId === task._id}
                    />
                </div>
              ))}
            </div>
          )}
          {viewMode === 'kanban' && (
            <div className="kanban-view">
              <div className="kanban-column">
                <h5>To Do</h5>
                <div className="kanban-cards-container">
                  {filteredAndSortedTasks
                    .filter(task => task.progress === 0)
                    .map(task => (
                      <div key={task._id} className="kanban-card">
                        <TaskCard
                          task={task}
                          allTasks={tasks}
                          mode="medium"
                          onSelectTask={handleTaskSelect}
                          onUpdateTask={onUpdateTask}
                          isRootTask={!task.parentIds || task.parentIds.length === 0}
                          isSelected={currentFilter.filterTaskId === task._id}
                          />
                      </div>
                    ))}
                </div>
              </div>
              <div className="kanban-column">
                <h5>In Progress</h5>
                <div className="kanban-cards-container">
                  {filteredAndSortedTasks
                    .filter(task => task.progress > 0 && task.progress < 100)
                    .map(task => (
                      <div key={task._id} className="kanban-card">
                        <TaskCard
                          task={task}
                          allTasks={tasks}
                          mode="medium"
                          onSelectTask={handleTaskSelect}
                          onUpdateTask={onUpdateTask}
                          isRootTask={!task.parentIds || task.parentIds.length === 0}
                          isSelected={currentFilter.filterTaskId === task._id}
                          />
                      </div>
                    ))}
                </div>
              </div>
              <div className="kanban-column">
                <h5>Done</h5>
                <div className="kanban-cards-container">
                  {filteredAndSortedTasks
                    .filter(task => task.progress === 100)
                    .map(task => (
                      <div key={task._id} className="kanban-card">
                        <TaskCard
                          task={task}
                          allTasks={tasks}
                          mode="medium"
                          onSelectTask={handleTaskSelect}
                          onUpdateTask={onUpdateTask}
                          isRootTask={!task.parentIds || task.parentIds.length === 0}
                          isSelected={currentFilter.filterTaskId === task._id}
                          />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {modalTask && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="task-details-modal" onClick={(e) => e.stopPropagation()}>
              <TaskDetails
                mode="modal"
                task={modalTask}
                allTasks={tasks}
                onSelectTask={handleTaskSelect}
                onUpdateTask={onUpdateTask}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PageLayout;
