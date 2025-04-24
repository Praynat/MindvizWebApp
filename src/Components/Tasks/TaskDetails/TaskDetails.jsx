// TaskDetails.jsx
import React from 'react';
import PageLayout from '../Layouts/PageLayout';
import SidebarLayout from '../Layouts/SidebarLayout';
import ModalLayout from '../Layouts/ModalLayout';
import '../Css/TaskDetailsGeneral.css';
import '../Css/TaskDetailsSidebar.css';
import '../Css/TaskDetailsModal.css';
import '../Css/TaskDetailsPage.css';

export default function TaskDetails(props) {
  const { mode, allTasks, categories = [], onDeleteTask, onAddChild, onNavigate, ...otherProps } = props;

  switch (mode) {
    case 'sidebar':
      return <SidebarLayout {...props} onDeleteTask={onDeleteTask} onAddChild={onAddChild} onNavigate={onNavigate} />;
    case 'modal':
      return <ModalLayout 
        {...props} 
        onDeleteTask={onDeleteTask} 
        onAddChild={onAddChild} 
        onNavigate={onNavigate} 
        
      />;
    case 'page':
    default:
      return <PageLayout 
        tasks={allTasks} 
        categories={categories} 
        onDeleteTask={onDeleteTask}
        onAddChild={onAddChild}
        onNavigate={onNavigate}
        selectedTaskId={props.task?._id}
        {...otherProps} 
      />;
  }
}
