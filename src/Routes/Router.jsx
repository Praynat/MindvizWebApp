import React from 'react';
import ROUTES from './routesModel';

import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../Pages/HomePage';
import ErrorPage from '../Pages/Utils/ErrorPage';
import SignupPage from '../Pages/Users/SignUpPage';
import ContactPage from '../Pages/Utils/ContactPage';
import AboutPage from '../Pages/Utils/AboutPage';
import LoginPage from '../Pages/Users/LoginPage';
import EditProfilePage from '../Pages/Users/EditProfilePage';
import ProfilePage from '../Pages/Users/ProfilePage';
import MindMappingPage from '../Pages/MindMapping';
import CalendarPage from '../Pages/CalendarPage';
import DashboardPage from '../Pages/DashboardPage';
import ListPage from '../Pages/ListPage';
import SearchPage from '../Pages/Tasks/SearchPage';
import CreateTaskPage from '../Pages/Tasks/CreateTaskPage';
import EditTaskPage from '../Pages/Tasks/EditTaskPage';
import TaskDetailsPage from '../Pages/Tasks/TaskDetailsPage';
import GroupsPage from '../Pages/GroupsPage'; 
import { useMyUser } from '../Providers/Users/UserProvider';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useMyUser();

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return children;
};

// New component for home redirect
const HomeRedirect = () => {
  const { user, loading } = useMyUser();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return user ? <Navigate to={ROUTES.MINDMAPPING_VIEW} replace /> : <HomePage />;
};

export default function AppRouter() {
  const { user, loading } = useMyUser(); 

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const isAuthenticated = !!user;

  return (
    <Routes>
      <Route path="" element={isAuthenticated ? <Navigate to={ROUTES.MINDMAPPING_VIEW} /> : <Navigate to={ROUTES.HOME} />} />
      <Route path="/Mindviz" element={isAuthenticated ? <Navigate to={ROUTES.MINDMAPPING_VIEW} /> : <Navigate to={ROUTES.HOME} />} />

      {/* Public Routes with authentication check */}
      <Route path={ROUTES.HOME} element={<HomeRedirect />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Protected Routes */}
      <Route path={ROUTES.DASHBOARD_VIEW} element={<ProtectedRoute><DashboardPage/></ProtectedRoute>} />
      <Route path={ROUTES.CALENDAR_VIEW} element={<ProtectedRoute><CalendarPage/></ProtectedRoute>} />
      <Route path={ROUTES.LIST_VIEW} element={<ProtectedRoute><ListPage/></ProtectedRoute>} />
      <Route path={ROUTES.MINDMAPPING_VIEW} element={<ProtectedRoute><MindMappingPage/></ProtectedRoute>} />
      <Route path={ROUTES.GROUPS_VIEW} element={<ProtectedRoute><GroupsPage/></ProtectedRoute>} /> 
      <Route path={ROUTES.SEARCH_TASKS} element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path={ROUTES.USER_PROFILE} element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path={ROUTES.EDIT_USER} element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
      <Route path={ROUTES.CREATE_TASK} element={<ProtectedRoute><CreateTaskPage/></ProtectedRoute>} />
      <Route path={ROUTES.EDIT_TASK + "/:id"} element={<ProtectedRoute><EditTaskPage/></ProtectedRoute>} />
      <Route path={ROUTES.TASK_DETAILS + "/:id"} element={<ProtectedRoute><TaskDetailsPage/></ProtectedRoute>} />

      {/* Catch-all Route */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
