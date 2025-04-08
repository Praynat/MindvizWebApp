import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../ListView/Sidebar';
import TaskCard from '../Cards/TaskCard';
import TaskDetails from '../TaskDetails/TaskDetails';
import '../Css/PageLayout.css';

const PageLayout = ({
  tasks,
  categories,
  onNewTask,
  onFilter,
  onViewChange,
  onSelectTask,
  onUpdateTask,
  task // Current selected task
}) => {
  // Retrieve saved filters from localStorage on initial load
  const getSavedFilters = () => {
    try {
      const savedFilters = localStorage.getItem('mindviz_filters');
      return savedFilters ? JSON.parse(savedFilters) : null;
    } catch (e) {
      console.error("Error loading saved filters", e);
      return null;
    }
  };

  // Setup states with persisted values
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

  // Add new state for expanded task and modal
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [modalTask, setModalTask] = useState(null);
  
  // Get the current filter based on view mode
  const getCurrentFilter = () => {
    switch (viewMode) {
      case 'list': return listFilters;
      case 'card': return cardFilters;
      case 'kanban': return kanbanFilters;
      default: return listFilters;
    }
  };

  // Update the current filter
  const updateCurrentFilter = (updates) => {
    const newFilter = { ...getCurrentFilter(), ...updates };
    
    if (syncFilters) {
      // Update all filters when sync is enabled
      setListFilters(newFilter);
      setCardFilters(newFilter);
      setKanbanFilters(newFilter);
    } else {
      // Update only the current view's filter
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

  // Save filters to localStorage whenever they change
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

  const handleViewChange = (mode) => {
    setViewMode(mode);
    if (onViewChange) onViewChange(mode);
  };

  // Handle task selection based on view mode
  const handleTaskSelect = (selectedTask) => {
    if (viewMode === 'list') {
      // Toggle expansion in list view
      setExpandedTaskId(expandedTaskId === selectedTask._id ? null : selectedTask._id);
      
      // Add auto-scrolling - wait for state update to complete
      setTimeout(() => {
        const taskElement = document.getElementById(`task-${selectedTask._id}`);
        if (taskElement && expandedTaskId !== selectedTask._id) {
          taskElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
    } else {
      // Show modal in card/kanban view
      setModalTask(selectedTask);
    }
    
    // Still call the external handler if provided
    if (onSelectTask) {
      onSelectTask(selectedTask);
    }
  };
  
  // Close modal
  const handleCloseModal = () => {
    setModalTask(null);
  };

  // Get the current active filters
  const currentFilter = getCurrentFilter();
  const { sortBy, sortDirection, filterName } = currentFilter;

  // Apply sorting and filtering to tasks
  const filteredAndSortedTasks = useMemo(() => {
    if (!tasks) return [];
    
    // First filter by name if filter is set
    let result = filterName 
      ? tasks.filter(t => t.name.toLowerCase().includes(filterName.toLowerCase()))
      : [...tasks];
    
    // Then sort according to selected option
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
        // Get top-level tasks first, then children
        const rootTasks = result.filter(t => !t.parentIds || t.parentIds.length === 0);
        const childTasks = result.filter(t => t.parentIds && t.parentIds.length > 0);
        
        rootTasks.sort((a, b) => a.name.localeCompare(b.name));
        childTasks.sort((a, b) => a.name.localeCompare(b.name));
        
        // Always put root tasks first for hierarchy sorting, regardless of direction
        if (sortDirection === 'desc') {
          rootTasks.reverse();
          childTasks.reverse();
        }
        result = [...rootTasks, ...childTasks];
        break;
      default:
        // Handle any unexpected sort values - use hierarchy as default
        const defaultRootTasks = result.filter(t => !t.parentIds || t.parentIds.length === 0);
        const defaultChildTasks = result.filter(t => t.parentIds && t.parentIds.length > 0);
        
        defaultRootTasks.sort((a, b) => a.name.localeCompare(b.name));
        defaultChildTasks.sort((a, b) => a.name.localeCompare(b.name));
        
        result = [...defaultRootTasks, ...defaultChildTasks];
        break;
    }
    
    return result;
  }, [tasks, sortBy, sortDirection, filterName]);

  return (
    <div className="page-layout">
      <Sidebar categories={categories} />

      <main className="main-content">
        <div className="toolbar">
          {/* View toggle buttons on the left */}
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
          
          {/* Action buttons on the right */}
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
                  {sortBy === 'alphabetical' ? 'A to Z' : 
                   sortBy === 'date' ? 'Oldest First' : 
                   'Ascending'}
                </label>
                <label>
                  <input 
                    type="radio" 
                    checked={sortDirection === 'desc'} 
                    onChange={() => updateCurrentFilter({ sortDirection: 'desc' })}
                  />
                  {sortBy === 'alphabetical' ? 'Z to A' : 
                   sortBy === 'date' ? 'Newest First' : 
                   'Descending'}
                </label>
              </div>
            </div>
            
            <div className="filter-section sync-option">
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={syncFilters}
                  onChange={() => {
                    // If turning on sync, immediately apply current filter to all views
                    if (!syncFilters) {
                      const currentFilter = getCurrentFilter();
                      setListFilters(currentFilter);
                      setCardFilters(currentFilter);
                      setKanbanFilters(currentFilter);
                    }
                    // Toggle the sync setting
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
            <ul className="list-view">
              {filteredAndSortedTasks.map(task => (
                <li 
                  key={task._id}
                  id={`task-${task._id}`} // Add this line
                  className={`list-item ${expandedTaskId === task._id ? 'expanded' : ''}`}
                  onClick={() => handleTaskSelect(task)}
                >
                  <TaskCard
                    task={task}
                    allTasks={tasks}
                    mode={expandedTaskId === task._id ? "full" : "medium"}
                    onSelectTask={(clickedTask) => {
                      // If this is a subtask, navigate to it
                      if (clickedTask._id !== task._id) {
                        handleTaskSelect(clickedTask);
                      }
                      // Otherwise, the main li click handler will toggle expansion
                    }}
                    onUpdateTask={onUpdateTask}
                    isRootTask={!task.parentIds || task.parentIds.length === 0}
                  />
                </li>
              ))}
            </ul>
          )}
          
          {/* Update other views to use filteredAndSortedTasks too */}
          {viewMode === 'card' && (
            <div className="card-view">
              {filteredAndSortedTasks.map(task => (
                // Card view implementation
                <div key={task._id} className="card-item">
                  <TaskCard
                    task={task}
                    allTasks={tasks}
                    mode="medium"
                    onSelectTask={handleTaskSelect}
                    onUpdateTask={onUpdateTask}
                    isRootTask={!task.parentIds || task.parentIds.length === 0}
                  />
                </div>
              ))}
            </div>
          )}
          
          {viewMode === 'kanban' && (
            <div className="kanban-view">
              {/* Kanban columns remain filtered by progress */}
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
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Task Details Modal for Card and Kanban views */}
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
