import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const DashboardRedirect = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'doctor':
      return <Navigate to="/doctor-dashboard" replace />;
    case 'patient':
      return <Navigate to="/patient-dashboard" replace />; // Will create this later
    case 'family':
      return <Navigate to="/family-dashboard" replace />; // Will create this later
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default DashboardRedirect;
