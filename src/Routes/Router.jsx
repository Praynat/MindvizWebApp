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

export default function AppRouter() {
  return (
      <Routes>
        <Route path="" element={<Navigate to={ROUTES.HOME} />} />
        <Route path="/Mindviz" element={<Navigate to={ROUTES.HOME} />} />
        <Route path={ROUTES.HOME} element={<HomePage/>} />
        <Route path={ROUTES.DASHBOARD_VIEW} element={<DashboardPage/>} />
        <Route path={ROUTES.CALENDAR_VIEW} element={<CalendarPage/>} />
        <Route path={ROUTES.LIST_VIEW} element={<ListPage/>} />
        <Route path={ROUTES.MINDMAPPING_VIEW} element={<MindMappingPage/>} />
        <Route path={ROUTES.SEARCH_TASKS} element={<SearchPage />} />
        <Route path={ROUTES.USER_PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.EDIT_USER} element={<EditProfilePage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.CREATE_TASK} element={<CreateTaskPage/>} />
        <Route path={ROUTES.EDIT_TASK + "/:id"} element={<EditTaskPage/>} />
        <Route path={ROUTES.TASK_DETAILS + "/:id"} element={<TaskDetailsPage/>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
  );
}
