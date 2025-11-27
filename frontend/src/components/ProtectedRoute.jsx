import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Optionally, show an unauthorized page or redirect to a different dashboard
    return <Navigate to="/unauthorized" replace />; // You'll need to create an UnauthorizedPage
  }

  return <Outlet />;
};

export default ProtectedRoute;
