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
  const { mode, allTasks,categories = [], ...otherProps } = props;

  switch (mode) {
    case 'sidebar':
      return <SidebarLayout {...props} />;
    case 'modal':
      return <ModalLayout {...props} />;
    case 'page':
    default:
      return <PageLayout tasks={allTasks} categories={categories} {...otherProps} />;  }
}
